import React from "react";

export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    return (
        <div>
            <h1>
                Welcome to profilePic, {props.first} {props.last}
            </h1>
            <img
                id="profile-pic"
                onClick={props.showUploader}
                src={props.profilePicUrl || "/images/slide4-klein.jpg"}
            />
        </div>
    );
}
