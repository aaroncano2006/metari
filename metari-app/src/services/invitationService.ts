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

export async function fetchPendingInvitations(
  userId: number,
  otherUserId: number,
): Promise<any> {
  const [sent, received] = await Promise.all([
    axiosConnection.get<invitationType[]>(
      `/invitacions/${userId}/sent/pending`,
    ),
    axiosConnection.get<invitationType[]>(
      `/invitacions/${userId}/received/pending`,
    ),
  ]);
  const pending = [...sent.data, ...received.data].find(
    (el) =>
      el.group_id === null &&
      el.status === "pending" &&
      ((el.sender_id === userId && el.receiver_id === otherUserId) ||
        (el.sender_id === otherUserId && el.receiver_id === userId)),
  );
  return pending ?? null;
}
