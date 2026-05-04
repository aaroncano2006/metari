type UserProfilePictureProps = {
    url: string,
    id: any
}

export function UserProfilePicture ({url, id} : UserProfilePictureProps) {
    return (
        <>
            <img className="img-fluid user-profile-picture" src={url} id={id}></img> 
        </>
    );
}