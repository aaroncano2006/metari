type UserProfilePictureProps = {
    url: string
}

export function UserProfilePicture ({url} : UserProfilePictureProps) {
    return (
        <>
            <img className="img-fluid user-profile-picture" src={url}></img> 
        </>
    );
}