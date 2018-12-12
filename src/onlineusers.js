import React from "react";
import { connect } from "react-redux";
import { initSocket } from "./socket";

class OnlineUsers extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <h1>Who's online now</h1>
                {this.props.listUsersOnline &&
                    this.props.listUsersOnline.map((userOnline, index) => {
                        return (
                            <div key={index}>
                                <img
                                    className="friends-pic"
                                    src={
                                        userOnline.image ||
                                        "/images/placeholder.png"
                                    }
                                />
                                <p>
                                    {userOnline.first} {userOnline.last}
                                </p>
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
