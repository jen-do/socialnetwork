import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/user/" + this.props.match.params.id + "/profile")
            .then(({ data }) => {
                if (data.success) {
                    this.setState(data.results[0]);
                }
                if (!data.results.length > 0) {
                    this.props.history.push("/");
                }
            })
            .catch(err => {
                console.log("error in axios GET other person's profile", err);
                this.props.history.push("/");
            });
    }
    render() {
        return (
            <div id="profile">
                <h1 className="centered-text">Other Profiles</h1>
                <img
                    id="profile-pic"
                    src={this.state.image || "/images/placeholder.png"}
                />
                <h3>
                    {this.state.first} {this.state.last}
                </h3>
                <p>{this.state.bio}</p>
                <FriendButton otherUserId={this.props.match.params.id} />
            </div>
        );
    }
}
