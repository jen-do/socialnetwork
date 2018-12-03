import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic showUploader={props.showUploader} image={props.image} />
            <h2>
                {props.first} {props.last}
            </h2>
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
