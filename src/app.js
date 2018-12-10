import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import Friends from "./friends";
import OnlineUsers from "./onlineusers";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

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

    showUploader() {
        this.setState(
            {
                uploaderIsVisible: true
            },
            () => console.log("this.state in showUploader", this.state)
        );
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    updateProfilePic(imgUrl) {
        console.log("updateProfilePic: ", this.state.image);
        this.setState(
            {
                image: imgUrl,
                uploaderIsVisible: false
            },
            () => console.log("this.state in updateProfilePic", this.state)
        );
    }

    setBio(bio) {
        this.setState(
            {
                bio: bio,
                editorIsVisible: false
            },
            () => console.log("this.state in setBio: ", this.state)
        );
    }

    logout() {
        this.props.history.push("/logout");
    }

    // #2 componentDidMount runs
    // built-in lifecyle method componentDidMount: similar to mounted function in Vue, runs when HTML loaded; axios GET requests for info needed from the server to correctly render the content go here
    // React lifecyle methods don't have to be bound
    componentDidMount() {
        axios.get("/user").then(
            ({ data }) => {
                this.setState(data);
            },
            () => console.log("data", this.state)
        );
    }

    // #1 first the render function runs
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
                        </div>
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateProfilePic={this.updateProfilePic}
                        hideUploader={this.hideUploader}
                    />
                )}
            </div>
        );
    }
}
