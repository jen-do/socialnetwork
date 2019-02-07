import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    // extracting the path of the image url stored at AWS
    // deleting 1) the image from amazon and 2) the user account
    async deleteAccount() {
        try {
            if (this.props.image !== null) {
                var amazonUrl = this.props.image;
                var lastIndex = amazonUrl.lastIndexOf("/");
                var amazonString = amazonUrl.slice(lastIndex + 1);
            }

            const deleteImage = await axios.post("/deleteimage", {
                amazonString
            });
            const deleteAccount = await axios.post(
                "deleteaccount/" + this.props.id
            );
            if (deleteAccount.data.deleted) {
                location.replace("/logout");
            }
        } catch (err) {
            console.log("error in axios POST /deleteaccount", err);
        }
    }

    render() {
        return (
            <div id="profile">
                <h1 className="centered-text">Welcome {this.props.first}!</h1>
                <ProfilePic
                    showUploader={this.props.showUploader}
                    image={this.props.image}
                />
                <h3>
                    {this.props.first} {this.props.last}
                </h3>
                <Bio bio={this.props.bio} setBio={this.props.setBio} />
                <button onClick={this.deleteAccount}>
                    delete your account
                </button>
            </div>
        );
    }
}
