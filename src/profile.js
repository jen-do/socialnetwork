import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div id="profile">
            <h1 className="centered-text">Welcome {props.first}!</h1>
            <ProfilePic showUploader={props.showUploader} image={props.image} />
            <h3>
                {props.first} {props.last}
            </h3>
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
