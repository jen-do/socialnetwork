import React from "react";
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
                            </div>
                        );
                    })}
            </div>
        );
    }
}

function mapStateToProps(state) {
    // console.log("state in mapStatetoProps", state.listOfUsersOnline);
    return {
        listUsersOnline: state.listOfUsersOnline
    };
}

export default connect(mapStateToProps)(OnlineUsers);
