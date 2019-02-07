import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { initSocket } from "./socket";

class OnlineUsers extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="opp-container">
                <h1>Who's online now</h1>
                {this.props.listUsersOnline &&
                    this.props.listUsersOnline.map((userOnline, index) => {
                        return (
                            <div key={index} className="other-users">
                                <img
                                    className="friends-pic"
                                    src={
                                        userOnline.image ||
                                        "/images/placeholder.png"
                                    }
                                />
                                <h3>
                                    {userOnline.first} {userOnline.last}
                                </h3>
                                <Link to={`/user/${userOnline.id}`}>
                                    visit {userOnline.first} {userOnline.last}'s
                                    profile
                                </Link>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        listUsersOnline: state.listOfUsersOnline
    };
}

export default connect(mapStateToProps)(OnlineUsers);
