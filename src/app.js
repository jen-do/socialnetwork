import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
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
        this.setState(
            {
                uploaderIsVisible: false
            },
            () => console.log("this.state in hideUploader", this.state)
        );
    }

    updateProfilePic(imgUrl) {
        console.log("updateProfilePic: ", this.state.profilePicUrl);
        this.setState(
            {
                profilePicUrl: imgUrl
            },
            () => console.log("this.state in updateProfilePic", this.state)
        );
    }

    // #2 componentDidMount runs
    // built-in lifecyle method componentDidMount: similar to mounted function in Vue, runs when HTML loaded; axios GET requests for info needed from the server to correctly render the content go here
    // React lifecyle methods don't have to be bound
    componentDidMount() {
        axios.get("/user").then(
            ({ data }) => {
                console.log("data", data);
                this.setState(data);
            },
            () => console.log("data", this.state)
        );
    }

    // #1 first the render function runs
    render() {
        return (
            <div>
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.profilePicUrl}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateProfilePic={this.updateProfilePic}
                        hideUploader={this.hideUploader}
                    />
                )}
                <h1>Welcome!</h1>
            </div>
        );
    }
}
