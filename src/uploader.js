import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // storing the uploaded image in state
    handleChange(e) {
        console.log("handlechange runs", e.target.files[0]);
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
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("data in upload: ", data);
                if (data.success) {
                    this.props.updateProfilePic(data.image);
                    this.setState({
                        image: data.image
                    });
                    this.props.hideUploader();
                } else {
                    // console.log("error in axios POST /upload", error);
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
            <div>
                <h1>upload an image</h1>
                {this.state.error && (
                    <div className="error-message">
                        Something went wrong. Please try again.
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="file"
                        type="file"
                        accept="image/*"
                    />
                    <button>upload</button>
                </form>
            </div>
        );
    }
}
