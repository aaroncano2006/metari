import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth/loginService";
import {
  fetchFriends,
  fetchPendingInvitations,
  sendInvitation,
} from "../../services/invitationService";

type SendInvitationButtonProps = {
  receiverId: number;
};

export default function SendFriendInvitationButton({
  receiverId,
}: SendInvitationButtonProps) {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [alreadyFriends, setAlreadyFriends] = useState<boolean>(false);
  const [pendingInvitation, setPengingInvitation] = useState<boolean>(false);
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

      return setPengingInvitation(pendingInvitation ? true : false);
    };

    areAlreadyFriends();
    isPendingInvitation();
  }, []);

  const sendInvitationToUser = async () => {
    try {
        setError(false);
        setSuccess(false);

        const send = await sendInvitation(userId, receiverId);

        if (!send) {
            throw new Error("Error enviant la invitació");
        }

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
    </>
  );
}
