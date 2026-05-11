import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth/loginService";
import {
  fetchFriends,
  fetchPendingInvitations,
  rejectOrDeleteInvitation,
  sendInvitation,
} from "../../services/invitationService";

type SendInvitationButtonProps = {
  receiverId: number;
};

export default function SendFriendInvitationButton({
  receiverId,
}: SendInvitationButtonProps) {
  const [_error, setError] = useState<boolean>(false);
  const [_success, setSuccess] = useState<boolean>(false);
  const [alreadyFriends, setAlreadyFriends] = useState<boolean>(false);
  const [pendingInvitation, setPendingInvitation] = useState<boolean>(false);
  const [invitationSenderId, setInvitationSenderId] = useState<number | null>(
    null,
  );
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
      const pendingInvitation = await fetchPendingInvitations(
        userId,
        receiverId,
      );

      return setPendingInvitation(pendingInvitation ? true : false);
    };

    const getPendingInvitationSender = async () => {
      const pendingInvitation = await fetchPendingInvitations(
        userId,
        receiverId,
      );

      if (!pendingInvitation) {
        return setInvitationSenderId(null);
      }

      console.log(pendingInvitation.sender_id);
      return setInvitationSenderId(pendingInvitation.sender_id);
    };

    areAlreadyFriends();
    isPendingInvitation();
    getPendingInvitationSender();
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

      setPendingInvitation(true);
      setInvitationSenderId(userId);
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

      setPendingInvitation(false);
      setInvitationSenderId(null);
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
          className="btn btn-success"
          onClick={async () => await sendInvitationToUser()}
        >
          <i className="bi bi-person-fill-add me-2"></i>
          Afegir amic
        </button>
      )}
      {alreadyFriends ||
        (pendingInvitation && (
          <button
            className="btn btn-danger"
            onClick={async () => await handleRejectOrDelete()}
          >
            <i className="bi bi-person-fill-dash me-2"></i>
            {alreadyFriends
              ? "Eliminar amic"
              : invitationSenderId === userId
                ? "Eliminar invitació"
                : "Rebutjar invitació"}
          </button>
        ))}
    </>
  );
}
