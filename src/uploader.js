import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // console.log("e.target.files[0] in uploader", e.target.files[0]);
        this.setState(
            {
                [e.target.name]: e.target.files[0]
            },
            () => console.log("this.state in uploader", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        if (this.props.image !== null) {
            var amazonUrl = this.props.image;
            var lastIndex = amazonUrl.lastIndexOf("/");
            var amazonString = amazonUrl.slice(lastIndex + 1);
            // console.log("amazonString", amazonString);
        }
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                if (data.success) {
                    this.props.updateProfilePic(data.image);
                    axios
                        .post("/deleteimage", { amazonString })
                        .then(results => {
                            console.log(
                                "results in deleteImage axious uploader:",
                                results
                            );
                        });
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div id="upload-outer-container">
                <div id="upload-inner-container">
                    <img
                        src="images/close.svg"
                        onClick={this.props.hideUploader}
                        id="close-img"
                    />
                    <h1>upload an image</h1>
                    {this.state.error && (
                        <div className="error-message">
                            Something went wrong. Please try again.
                        </div>
                    )}
                    <form onSubmit={this.handleSubmit}>
                        <label id="custom-file-upload">
                            choose an image<input
                                onChange={this.handleChange}
                                name="file"
                                type="file"
                                accept="image/*"
                            />
                        </label>
                        <button>upload</button>
                    </form>
                </div>
            </div>
        );
    }
}
