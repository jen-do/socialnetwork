import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log("handlechange running!", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this state in handleChange: ", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
            .then(resp => {
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("error in axios POST /login: ", err);
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div className="login-container">
                <h2>Login</h2>
                {this.state.error && (
                    <div className="error-message">
                        Something went wrong. Please try again.
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="email"
                        placeholder="email"
                    />
                    <input
                        onChange={this.handleChange}
                        name="pass"
                        type="password"
                        placeholder="password"
                    />
                    <button>login</button>
                </form>
                <Link to="/">Got no account yet? Register here!</Link>
            </div>
        );
    }
}
