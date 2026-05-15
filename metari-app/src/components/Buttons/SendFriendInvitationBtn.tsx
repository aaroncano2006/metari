import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth/loginService";
import {
  acceptInvitation,
  fetchFriends,
  fetchInvitations,
  rejectOrDeleteInvitation,
  sendInvitation,
} from "../../services/invitationService";
import type { invitationType } from "../../types/invitationType";

type SendInvitationButtonProps = {
  receiverId: number;
  small?: boolean;
};

export default function SendFriendInvitationButton({
  receiverId,
  small,
}: SendInvitationButtonProps) {
  const [_error, setError] = useState<boolean>(false);
  const [_success, setSuccess] = useState<boolean>(false);
  const [alreadyFriends, setAlreadyFriends] = useState<boolean>(false);
  const [pendingInvitation, setPendingInvitation] =
    useState<invitationType | null>(null);
  const [recharge, setRecharge] = useState(0);
  const userId = getUserId() ?? 0;

  useEffect(() => {
    const areAlreadyFriends = async () => {
      const friends = await fetchFriends(userId);

      if (friends) {
        const isFriendWithCurUser = friends.find((el) => el.id === receiverId);
        return setAlreadyFriends(isFriendWithCurUser ? true : false);
      }

      return setAlreadyFriends(false);
    };

    const isPendingInvitation = async () => {
      const data = await fetchInvitations(userId, receiverId, "pending");

      return setPendingInvitation(data);
    };

    areAlreadyFriends();
    isPendingInvitation();
  }, [recharge]);

  useEffect(() => {
    const handleRecharge = () => setRecharge((cur) => cur + 1);
    window.addEventListener("buttonChange", handleRecharge);
    return () => window.removeEventListener("buttonChange", handleRecharge);
  }, [recharge]);

  const sendInvitationToUser = async () => {
    try {
      setError(false);
      setSuccess(false);

      const send = await sendInvitation(userId, receiverId);

      if (!send) {
        throw new Error("Error enviant la invitació");
      }

      const pending = await fetchInvitations(userId, receiverId, "pending");
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

      const rejectOrDelete = await rejectOrDeleteInvitation(userId, receiverId);

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

      setAlreadyFriends(true);
      setPendingInvitation(null);
      window.dispatchEvent(new Event("buttonChange"));
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <>
      {!alreadyFriends && !pendingInvitation && (
        <button
          className={`btn ${small ? "p-1" : ""} btn-success`}
          onClick={async (event) => {event.stopPropagation(); await sendInvitationToUser()}}
        >
          <i className={`bi bi-person-fill-add ${!small ? "me-2" : ""}`}></i>
          {!small && <span>Afegir amic</span>}
        </button>
      )}
      {!alreadyFriends &&
        pendingInvitation &&
        pendingInvitation.sender_id !== userId && (
          <button
            className={`btn ${small ? "p-1" : ""} btn-success me-2`}
            onClick={async (event) => {event.stopPropagation(); await handleAcceptInvitation()}}
          >
            <i className={`bi bi-person-fill-add ${!small ? "me-2" : ""}`}></i>
            {!small && <span>Acceptar invitació</span>}
          </button>
        )}
      {(alreadyFriends || pendingInvitation) && (
        <button
          className={`btn ${small ? "p-1" : ""} btn-danger`}
          onClick={async (event) => { event.stopPropagation(); await handleRejectOrDelete() }}
        >
          <i className={`bi bi-person-fill-dash ${!small ? "me-2" : ""}`}></i>
          {!small ? (
            alreadyFriends
              ? "Eliminar amic"
              : pendingInvitation?.sender_id === userId
                ? "Eliminar invitació"
                : "Rebutjar invitació"
          ) : null}
        </button>
      )}
    </>
  );
}
