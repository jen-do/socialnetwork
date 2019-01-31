import React from "react";
import { Link } from "react-router-dom";

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.history.push("/logout");
    }

    render() {
        return (
            <div id="nav">
                <Link to="/" className="navitem">
                    edit profile
                </Link>
                <Link to="/friends" className="navitem">
                    friends
                </Link>
                <Link to="/onlineusers" className="navitem">
                    who's online
                </Link>
                <Link to="/search" className="navitem">
                    search
                </Link>
                <Link to="/chat" className="navitem">
                    chat
                </Link>
                <Link to="/logout" className="navitem" onClick={this.logout}>
                    logout
                </Link>
            </div>
        );
    }
}
