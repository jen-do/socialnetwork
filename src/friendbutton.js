import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.makeFriendRequest = this.makeFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.endFriendship = this.endFriendship.bind(this);
        // console.log("this.props in FriendButton", this.props);
    }

    componentDidMount() {
        axios
            .get("/friends/" + this.props.otherUserId)
            .then(({ data }) => {
                this.setState(data);
            })
            .catch(err => {
                console.log("error in checkFrienship axios: ", err);
            });
    }

    makeFriendRequest() {
        axios
            .post("/friendrequest/" + this.props.otherUserId)
            .then(({ data }) => {
                this.setState({
                    noRelationship: false,
                    ...data
                });
            })
            .catch(err => {
                console.log("error in makeFriendRequest axios: ", err);
            });
    }

    acceptFriendRequest() {
        axios
            .post("/acceptfriendrequest/" + this.props.otherUserId)
            .then(({ data }) => {
                this.setState(data);
            })
            .catch(err => {
                console.log("error in acceptFriendRequest axios: ", err);
            });
    }

    endFriendship() {
        axios
            .post("/endfriendship/" + this.props.otherUserId)
            .then(({ data }) => {
                this.setState(data);
            })
            .catch(err => {
                console.log("error in endFrienship axios: ", err);
            });
    }

    render() {
        let friendButton;

        if (this.state.noRelationship) {
            friendButton = (
                <button id="friendbutton" onClick={this.makeFriendRequest}>
                    Make friend request
                </button>
            );
        }
        if (!this.state.noRelationship) {
            if (!this.state.accepted) {
                if (this.state.sender == this.props.otherUserId) {
                    friendButton = (
                        <button
                            id="friendbutton"
                            onClick={this.acceptFriendRequest}
                        >
                            Accept friend request
                        </button>
                    );
                }
                if (this.state.sender != this.props.otherUserId) {
                    friendButton = (
                        <button onClick={this.endFriendship} id="endfriendship">
                            Cancel friend request
                        </button>
                    );
                }
            }
            if (this.state.accepted) {
                friendButton = (
                    <button onClick={this.endFriendship} id="endfriendship">
                        End friendship
                    </button>
                );
            }
        }

        return <div>{friendButton}</div>;
    }
}
