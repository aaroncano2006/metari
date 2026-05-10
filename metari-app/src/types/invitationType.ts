import type { groupType } from "./groupType"
import type { userTypeFrontend } from "./userTypeFrontend"

export type invitationType = {
    id: number,
    sender_id: number,
    receiver_id: number,
    group_id: number | null,
    status: "pending" | "accepted" | "rejected"
    sender: userTypeFrontend
    receiver: userTypeFrontend
    group?: groupType | null
}