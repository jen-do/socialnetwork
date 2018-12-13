import React from "react";
import ProfilePic from "./profilepic";
import axios from "./axios";
import Bio from "./bio";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    deleteAccount() {
        console.log("this.props in profile", this.props);
        if (this.props.image !== null) {
            var amazonUrl = this.props.image;
            var lastIndex = amazonUrl.lastIndexOf("/");
            var amazonString = amazonUrl.slice(lastIndex + 1);
            console.log("amazonString", amazonString);
        }

        axios
            .post("/deleteimage", { amazonString })
            .then(
                axios.post("deleteaccount/" + this.props.id).then(resp => {
                    if (resp.data.deleted) {
                        location.replace("/logout");
                    }
                })
            )

            .catch(err => {
                console.log("error in axios POST /deleteaccount", err);
            });
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
