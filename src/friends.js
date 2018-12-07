import React from "react";
import { connect } from "react-redux";
import {
    getFriendsAndWannabes,
    acceptFriendRequest,
    endFriendship
} from "./actions";

class Friends extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        // call dispatch function for getting the complete list of friends and wannabes (action getFriendsAndWannabes)
        this.props.dispatch(getFriendsAndWannabes());
    }

    render() {
        console.log(
            "this.props.friends and this.props.wannabes",
            this.props,
            this.props.friends,
            this.props.wannabes
        );
        return (
            <div>
                <div id="friends-list">
                    <h2>Your friends</h2>
                    {this.props.friends &&
                        this.props.friends.map(friend => {
                            return (
                                <div className="friends" key={friend.id}>
                                    <img
                                        className="friends-pic"
                                        src={
                                            friend.image ||
                                            "/images/placeholder.png"
                                        }
                                    />
                                    {friend.first} {friend.last}
                                    <button
                                        onClick={() =>
                                            this.props.dispatch(
                                                endFriendship(friend.id)
                                            )
                                        }
                                    >
                                        end friendship
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <div id="wannabe-list">
                    <h2>These people want to be your friends</h2>
                    {this.props.wannabes &&
                        this.props.wannabes.map(wannabe => {
                            return (
                                <div className="friends" key={wannabe.id}>
                                    <img
                                        className="friends-pic"
                                        src={
                                            wannabe.image ||
                                            "/images/placeholder.png"
                                        }
                                    />
                                    {wannabe.first} {wannabe.last}
                                    <button
                                        onClick={() =>
                                            this.props.dispatch(
                                                acceptFriendRequest(wannabe.id)
                                            )
                                        }
                                    >
                                        accept friend request
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    var list = state.list;
    console.log("list in friends.js", list);
    return {
        friends:
            list &&
            list.filter(user => user.accepted == true && !user.noRelationship),
        wannabes:
            list && list.filter(user => !user.accepted && !user.noRelationship)
    };
}

export default connect(mapStateToProps)(Friends);
