import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    getFriendsAndWannabes,
    acceptFriendRequest,
    endFriendship
} from "./actions";

class Friends extends React.Component {
    constructor() {
        super();
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getFriendsAndWannabes());
    }
    redirect(id) {
        this.props.history.push("/user/" + id);
    }

    render() {
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
                                    <Link to={`/user/${friend.id}`}>
                                        visit {friend.first} {friend.last}'s
                                        profile
                                    </Link>
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
                <hr />
                <h1>Friend Requests</h1>
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
                                    <Link to={`/user/${wannabe.id}`}>
                                        visit {wannabe.first} {wannabe.last}'s
                                        profile
                                    </Link>
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
    return {
        friends:
            list &&
            list.filter(user => user.accepted == true && !user.noRelationship),
        wannabes:
            list && list.filter(user => !user.accepted && !user.noRelationship)
    };
}

export default connect(mapStateToProps)(Friends);
