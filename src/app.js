import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import Friends from "./friends";
import OnlineUsers from "./onlineusers";
import Chat from "./chat";
import Search from "./search";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then(
            ({ data }) => {
                this.setState(data);
            },
            () => console.log("data", this.state)
        );
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    updateProfilePic(imgUrl) {
        console.log("updateProfilePic: ", this.state.image);
        this.setState({
            image: imgUrl,
            uploaderIsVisible: false
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio,
            editorIsVisible: false
        });
    }

    logout() {
        this.props.history.push("/logout");
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <div id="header">
                            <Logo />
                            <div id="nav">
                                <Link to="/" className="navitem">
                                    home
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
                                <Link
                                    to="/logout"
                                    className="navitem"
                                    onClick={this.logout}
                                >
                                    logout
                                </Link>
                                <ProfilePic
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                    showUploader={this.showUploader}
                                />
                            </div>
                        </div>

                        <div className="content-container">
                            <Route
                                exact
                                path="/"
                                render={() => {
                                    return (
                                        <Profile
                                            id={this.state.id}
                                            first={this.state.first}
                                            last={this.state.last}
                                            image={this.state.image}
                                            bio={this.state.bio}
                                            setBio={this.setBio}
                                            showUploader={this.showUploader}
                                        />
                                    );
                                }}
                            />
                            <Route
                                path="/user/:id"
                                component={OtherPersonProfile}
                            />
                            <Route path="/friends" component={Friends} />
                            <Route
                                path="/onlineusers"
                                component={OnlineUsers}
                            />
                            <Route path="/search" component={Search} />
                            <Route path="/chat" component={Chat} />
                        </div>
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateProfilePic={this.updateProfilePic}
                        hideUploader={this.hideUploader}
                        image={this.state.image}
                    />
                )}
            </div>
        );
    }
}
