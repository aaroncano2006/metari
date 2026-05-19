import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth/loginService";
import {
  acceptInvitation,
  fetchInvitations,
  rejectOrDeleteInvitation,
  sendInvitation,
} from "../../services/invitationService";
import { fetchGroupUsers, deleteGroupUser } from "../../services/groupUserService";
import { fetchGroupsByUserId } from "../../services/groupService";
import type { invitationType } from "../../types/invitationType";
import type { groupUserType } from "../../types/groupUserType";

type SendGroupInvitationBtnProps = {
    receiverId: number;
    small?: boolean;
    groupId?: number;
}

export default function SendGroupInvitationBtn({receiverId, small, groupId}: SendGroupInvitationBtnProps) {
    const [error, setError] = useState<boolean>(false);
    const [success, setError] = useState<boolean>(false);
    const [alreadyInGrop, setAlreadyInGroup] = useState<boolean>(false);
    const [pendingInvitation, setPendingInvitation] =
    useState<invitationType | null>(null);
    const [selectGroupModalOpen, setSelectGroupModalOpen] = useState<boolean>(false);
    const [recharge, setRecharge] = useState(0);
    const userId = getUserId() ?? 0;

    useEffect(() => {
        const isAlreadyInGroup = async () => {
            const groupUser = await fetchGroupUsers().then((response) => {
                const findGroupUser = response.find((el) => el.group_id === groupId && el.user_id === receiverId);
                return findGroupUser;
            });

            return groupUser ? setAlreadyInGroup(true) : setAlreadyInGroup(false);
        };

        const isPendingInvitation = async () => {
            const data = await fetchInvitations(userId, receiverId, "pending", groupId);

            return setPendingInvitation(data);
        }

        isAlreadyInGroup();
        isPendingInvitation();
    }, [recharge]);

    useEffect(() => {
        const handleRecharge = () => setRecharge((cur) => cur + 1);
        window.addEventListener("buttonChange", handleRecharge);
        return () => window.removeEventListener("buttonChange", handleRecharge);
    }, [recharge]);

    return (
        <>

        </>
    )
}
