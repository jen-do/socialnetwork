import React from "react";
import { connect } from "react-redux";
import {
    getFriendsAndWannabes,
    acceptFriendRequest,
    endFriendship
} from "./actions";
// import { Link } from "react-router-dom";

class Friends extends React.Component {
    constructor() {
        super();
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        // call dispatch function for getting the complete list of friends and wannabes (action getFriendsAndWannabes)
        this.props.dispatch(getFriendsAndWannabes());
    }

    redirect(id) {
        this.props.history.push("/user/" + id);
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
                <h1>Your friends</h1>
                <div id="friends-list">
                    {this.props.friends &&
                        this.props.friends.map(friend => {
                            return (
                                <div className="other-users" key={friend.id}>
                                    <img
                                        className="friends-pic"
                                        src={
                                            friend.image ||
                                            "/images/placeholder.png"
                                        }
                                        onClick={() => this.redirect(friend.id)}
                                    />

                                    <h3>
                                        {friend.first} {friend.last}
                                    </h3>
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
                <h1>These people want to be your friends</h1>
                <div id="wannabe-list">
                    {this.props.wannabes &&
                        this.props.wannabes.map(wannabe => {
                            return (
                                <div className="other-users" key={wannabe.id}>
                                    <img
                                        className="friends-pic"
                                        src={
                                            wannabe.image ||
                                            "/images/placeholder.png"
                                        }
                                        onClick={() =>
                                            this.redirect(wannabe.id)
                                        }
                                    />

                                    <h3>
                                        {wannabe.first} {wannabe.last}
                                    </h3>
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
