import React from "react";

export default function ProfilePic(props) {
    return (
        <div>
            <img
                id="profile-pic"
                onClick={props.showUploader}
                src={props.image || "/images/placeholder.png"}
                title="edit your profile picture"
                alt={props.first}
            />
        </div>
    );
}
