import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth/loginService";
import {
  acceptInvitation,
  fetchInvitations,
  rejectOrDeleteInvitation,
  sendInvitation,
} from "../../services/invitationService";
import {
  fetchGroupUsers,
  createGroupUser,
  deleteGroupUser,
} from "../../services/groupUserService";
import type { invitationType } from "../../types/invitationType";

type SendGroupInvitationBtnProps = {
  receiverId: number;
  small?: boolean;
  groupId: number;
  isPublic?: boolean;
  ownerId?: number;
};

export default function SendGroupInvitationBtn({
  receiverId,
  small,
  groupId,
  isPublic = false,
  ownerId,
}: SendGroupInvitationBtnProps) {
  const [_error, setError] = useState<boolean>(false);
  const [_success, setSuccess] = useState<boolean>(false);
  const [alreadyInGrup, setAlreadyInGrup] = useState<boolean>(false);
  const [pendingInvitation, setPendingInvitation] =
    useState<invitationType | null>(null);
  const [recharge, setRecharge] = useState(0);
  const userId = getUserId() ?? 0;

  useEffect(() => {
    const checkGroupStatus = async () => {
      const groupUser = await fetchGroupUsers().then((response) => {
        const findGroupUser = response.find(
          (el) => el.group_id === groupId && el.user_id === receiverId,
        );
        return findGroupUser;
      });

      setAlreadyInGrup(groupUser ? true : false);

      const data = await fetchInvitations(
        userId,
        receiverId,
        "pending",
        groupId,
      );
      setPendingInvitation(data);
    };

    checkGroupStatus();
  }, [recharge, groupId, receiverId]);

  useEffect(() => {
    const handleRecharge = () => setRecharge((cur) => cur + 1);
    window.addEventListener("buttonChange", handleRecharge);
    return () => window.removeEventListener("buttonChange", handleRecharge);
  }, [recharge]);

  const joinPublicGroup = async () => {
    try {
      setError(false);
      setSuccess(false);

      await createGroupUser({
        group_id: groupId,
        user_id: userId,
        role: "member",
      });

      setAlreadyInGrup(true);
      window.dispatchEvent(new Event("buttonChange"));
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      setError(true);
    }
  };

  const sendInvitationToUser = async () => {
    try {
      setError(false);
      setSuccess(false);

      const send = await sendInvitation(userId, receiverId, groupId);

      if (!send) {
        throw new Error("Error enviant la invitació al grup");
      }

      const pending = await fetchInvitations(
        userId,
        receiverId,
        "pending",
        groupId,
      );
      setPendingInvitation(pending);
      window.dispatchEvent(new Event("buttonChange"));
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      setError(true);
    }
  };

  const handleRejectOrDelete = async () => {
    try {
      setError(false);
      setSuccess(false);

      const rejectOrDelete = await rejectOrDeleteInvitation(
        userId,
        receiverId,
        groupId,
      );

      if (!rejectOrDelete) {
        throw new Error("Error rebutjant o eliminant la invitació!");
      }

      setPendingInvitation(null);
      window.dispatchEvent(new Event("buttonChange"));
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      setError(true);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      setError(false);
      setSuccess(false);

      if (!pendingInvitation) return;

      const accepted = await acceptInvitation(userId, pendingInvitation.id);

      if (!accepted) {
        throw new Error("Error acceptant la invitació");
      }

      setAlreadyInGrup(true);
      setPendingInvitation(null);
      window.dispatchEvent(new Event("buttonChange"));
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      setError(true);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setError(false);
      setSuccess(false);

      await deleteGroupUser(groupId, receiverId);

      setAlreadyInGrup(false);
      window.dispatchEvent(new Event("buttonChange"));
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <>
      {pendingInvitation && (
        <>
          {pendingInvitation.sender_id !== userId && (
            <button
              className={`btn ${small ? "p-1 smallButton" : ""} btn-success me-1 `}
              onClick={async (event) => {
                event.stopPropagation();
                await handleAcceptInvitation();
              }}
              title={small ? "Acceptar invitació" : ""}
            >
              <i className={`bi bi-check-lg ${!small ? "me-2" : ""}`}></i>
              {!small && <span>Acceptar invitació</span>}
            </button>
          )}
          <button
            className={`btn ${small ? "p-1 smallButton" : ""} btn-danger`}
            onClick={async (event) => {
              event.stopPropagation();
              await handleRejectOrDelete();
            }}
            title={small ? (pendingInvitation.sender_id === userId ? "Cancel·lar invitació" : "Rebutjar") : ""}
          >
            <i className={`bi bi-x-lg ${!small ? "me-2" : ""}`}></i>
            {!small && (
              <span>
                {pendingInvitation.sender_id === userId
                  ? "Cancel·lar invitació"
                  : "Rebutjar"}
              </span>
            )}
          </button>
        </>
      )}
      {!pendingInvitation && alreadyInGrup && receiverId === userId && ownerId !== userId && (
        <button
          className={`btn ${small ? "p-1 smallButton" : ""} btn-danger`}
          onClick={async (event) => {
            event.stopPropagation();
            await handleLeaveGroup();
          }}
          title={small ? "Sortir del grup" : ""}
        >
          <i className={`bi bi-box-arrow-left ${!small ? "me-2" : ""}`}></i>
          {!small && <span>Sortir del grup</span>}
        </button>
      )}
      {!pendingInvitation && !alreadyInGrup && (isPublic || receiverId !== userId) && (
        <button
          className={`btn ${small ? "p-1 smallButton" : ""} btn-success`}
          onClick={async (event) => {
            event.stopPropagation();
            await (receiverId === userId ? joinPublicGroup() : sendInvitationToUser());
          }}
          title={small ? (receiverId === userId ? "Unir-se" : "Invitar al grup") : ""}
        >
          <i className={`bi bi-person-plus-fill ${!small ? "me-2" : ""}`}></i>
          {!small && <span>{receiverId === userId ? "Unir-se" : "Invitar al grup"}</span>}
        </button>
      )}
    </>
  );
}
