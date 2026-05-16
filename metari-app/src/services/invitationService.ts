import { axiosConnection } from "./axiosConnection";
import type { userTypeFrontend } from "../types/userTypeFrontend";
import type { invitationType } from "../types/invitationType";

export async function fetchFriends(
  userId: number,
): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeFrontend[]>(
    `/invitacions/friends/${userId}`,
  );
  return data;
}

export async function sendInvitation(
  senderId: number,
  receiverId: number,
  groupId: number | null = null,
): Promise<any> {
  let BASE_URL = `/invitacions/${senderId}/${receiverId}`;
  if (groupId) {
    BASE_URL = BASE_URL + `/${groupId}`;
  }

  const { data } = await axiosConnection.post(BASE_URL);
  return data;
}

export async function fetchInvitations(
  userId: number,
  otherUserId: number,
  status: "pending" | "accepted",
  groupId: number | null = null,
): Promise<any> {
  const [sent, received] = await Promise.all([
    axiosConnection.get<invitationType[]>(
      `/invitacions/${userId}/sent/${status}`,
    ),
    axiosConnection.get<invitationType[]>(
      `/invitacions/${userId}/received/${status}`,
    ),
  ]);
  const invitations = [...sent.data, ...received.data].find(
    (el) =>
      el.group_id === (groupId ?? null) &&
      el.status === status &&
      ((el.sender_id === userId && el.receiver_id === otherUserId) ||
        (el.sender_id === otherUserId && el.receiver_id === userId)),
  );
  return invitations ?? null;
}

export async function fetchMyInvitations(
  userId: number,
  status: "pending" | "accepted",
): Promise<any[]> {
  const [sent, received] = await Promise.all([
    axiosConnection.get<invitationType[]>(
      `/invitacions/${userId}/sent/${status}`,
    ),
    axiosConnection.get<invitationType[]>(
      `/invitacions/${userId}/received/${status}`,
    ),
  ]);

  const invitations = [...sent.data, ...received.data].filter(
    (el) =>
      el.status === status &&
      (el.sender_id === userId || el.receiver_id === userId),
  );

  return invitations ?? [];
}

export async function rejectOrDeleteInvitation(
  userId: number,
  otherUserId: number,
): Promise<any> {
  const pending = await fetchInvitations(userId, otherUserId, "pending");
  const accepted = await fetchInvitations(userId, otherUserId, "accepted");

  let deletePending = null;
  let deleteAccepted = null;
  if (pending && !accepted) {
    deletePending = await axiosConnection.delete(
      `/invitacions/${userId}/${pending.id}`,
    );
  } else if (!pending && accepted) {
    deleteAccepted = await axiosConnection.delete(
      `/invitacions/${userId}/${accepted.id}`,
    );
  }

  return pending ? deletePending : deleteAccepted;
}

export async function acceptInvitation(
  receiverId: number,
  invitationId: number,
): Promise<any> {
  const { data } = await axiosConnection.put(
    `/invitacions/${receiverId}/${invitationId}`,
  );
  return data;
}
