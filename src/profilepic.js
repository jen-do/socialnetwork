import React from "react";

export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    return (
        <div>
            <img
                id="profile-pic"
                onClick={props.showUploader}
                src={props.image || "/images/slide4-klein.jpg"}
                title="edit your profile picture"
                alt={props.first}
            />
        </div>
    );
}
