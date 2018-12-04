import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.makeFriendRequest = this.makeFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.cancelFriendship = this.cancelFriendship.bind(this);
        console.log("this.props in FriendButton", this.props);
    }

    componentDidMount() {
        console.log("props in FriendButton", this.props.otherUserId);
        axios
            .get("/friends/" + this.props.otherUserId)
            .then(({ data }) => {
                console.log("data in checkfriendship axios:", data);
                this.setState(data[0]);
            })
            .catch(err => {
                console.log("error in checkFrienship axios: ", err);
            });
    }

    makeFriendRequest() {
        axios
            .post("/friendrequest/" + this.props.otherUserId)
            .then(({ data }) => {
                console.log("data in makeFriendRequest axios:", data);
                this.setState({
                    noFriendsYet: false,
                    ...data
                });
            })
            .catch(err => {
                console.log("error in makeFriendRequest axios: ", err);
            });
    }

    acceptFriendRequest() {
        console.log("acceptFriendrequest");
        axios
            .post("/acceptfriendrequest/" + this.props.otherUserId)
            .then(({ data }) => {
                console.log("data in acceptFriendRequest axios:", data);
            })
            .catch(err => {
                console.log("error in acceptFriendRequest axios: ", err);
            });
    }

    cancelFriendship() {
        console.log("cancel friendship/friend request");
    }

    render() {
        let friendButton;

        if (this.state.noFriendsYet) {
            friendButton = (
                <button id="friendbutton" onClick={this.makeFriendRequest}>
                    Make friend request
                </button>
            );
        }
        if (!this.state.noFriendsYet) {
            if (!this.state.accepted) {
                console.log("1", this.state.sender, this.props.otherUserId);
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
                        <button
                            onClick={this.cancelFriendship}
                            id="friendbutton"
                        >
                            Cancel friend request
                        </button>
                    );
                }
            }
            if (this.state.accepted) {
                friendButton = (
                    <button onClick={this.cancelFriendship} id="friendbutton">
                        End friendship
                    </button>
                );
            }
        }

        return <div>{friendButton}</div>;
    }
}
