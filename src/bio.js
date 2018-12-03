import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorIsVisible: false
        };
        console.log("props in bio: ", props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showEditor = this.showEditor.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this.state in bio", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/bio", this.state)
            .then(({ data }) => {
                console.log("resp in axios POST bio:", data);
                if (data.success) {
                    this.props.setBio(data.bio);
                    this.setState({
                        editorIsVisible: false
                    });
                } else {
                    console.log("error in axios POST bio else", error);
                }
            })
            .catch(err => {
                console.log("error in axios POST bio catch:", err);
            });
    }

    showEditor() {
        this.setState(
            {
                editorIsVisible: true
            },
            () => console.log("this.state in showEditor", this.state)
        );
    }

    render() {
        let elem;

        if (this.props.bio) {
            elem = (
                <div>
                    <p>{this.props.bio}</p>
                    <button onClick={this.showEditor}>edit your bio</button>
                </div>
            );
        }
        if (!this.props.bio) {
            elem = (
                <div>
                    <button onClick={this.showEditor}>add your bio</button>
                </div>
            );
        }
        if (this.state.editorIsVisible) {
            elem = (
                <form onSubmit={this.handleSubmit}>
                    <textarea
                        onChange={this.handleChange}
                        defaultValue={this.state.bio}
                        name="bio"
                        type="text"
                    />
                    <button>save</button>
                </form>
            );
        }

        return <div id="bio">{elem}</div>;
    }
}
