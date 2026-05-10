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
  groupId: number | null,
): Promise<any> {
  let BASE_URL = `/invitacions/${senderId}/${receiverId}`;
  if (groupId) {
    BASE_URL = BASE_URL + `/${groupId}`;
  }

  const { data } = await axiosConnection.post(BASE_URL);
  return data;
}

// export async function fetchPendingInvitations(
//   senderId: number | null,
//   receiverId: number | null,
//   groupId: number | null = null,
// ): Promise<any> {
//   const { data } = await axiosConnection.get(`/invitacions`);

//   let findInvitation = null;

//   if (senderId && receiverId && !groupId) {
//     findInvitation = data.find(
//       (el: invitationType) =>
//         (el.sender_id === senderId &&
//           el.receiver_id === receiverId &&
//           el.group_id === null &&
//           el.status === "pending") ||
//         (el.sender_id === receiverId &&
//           el.receiver_id === senderId &&
//           el.group_id === null &&
//           el.status === "pending"),
//     );
//   } else if (senderId && receiverId && groupId) {
//     findInvitation = data.find(
//       (el: invitationType) =>
//         (el.sender_id === senderId &&
//           el.receiver_id === receiverId &&
//           el.group_id === groupId &&
//           el.status === "pending") ||
//         (el.sender_id === receiverId &&
//           el.receiver_id === senderId &&
//           el.group_id === groupId &&
//           el.status === "pending"),
//     );
//   }

//   return !findInvitation ? data : findInvitation;
// }

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
