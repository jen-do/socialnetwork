import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Logo from "./logo";
import ProfilePic from "./profilepic";
import Menu from "./menu";
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
            uploaderIsVisible: false,
            menuIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
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

    showMenu() {
        this.setState({
            menuIsVisible: true
        });
    }

    hideMenu(e) {
        if (!e.target.matches("#menu-img")) {
            this.setState({
                menuIsVisible: false
            });
        }
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
            <div onClick={this.hideMenu}>
                <BrowserRouter>
                    <div>
                        <div id="header">
                            <img
                                src="images/hamburgermenu.svg"
                                onClick={this.showMenu}
                                id="menu-img"
                            />
                            <Logo />
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image}
                                showUploader={this.showUploader}
                            />
                        </div>

                        <div className="content-container">
                            {this.state.menuIsVisible && <Menu />}
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
