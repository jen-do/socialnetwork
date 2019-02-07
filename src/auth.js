import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export const Login = wrapAuth(LoginForm, "/login");
export const Registration = wrapAuth(RegistrationForm, "/registration");

function wrapAuth(Component, url) {
    return class AuthForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.url = url;
        }

        handleChange(e) {
            this.setState({
                [e.target.name]: e.target.value
            });
        }

        handleSubmit(e) {
            e.preventDefault();
            axios
                .post(this.url, this.state)
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
                    console.log(
                        "error in axios POST /registration or login: ",
                        err
                    );
                    this.setState({
                        error: true
                    });
                });
        }
        render() {
            return (
                <Component
                    error={this.state.error}
                    handleChange={e => this.handleChange(e)}
                    handleSubmit={e => this.handleSubmit(e)}
                />
            );
        }
    };
}

function LoginForm({ handleChange, handleSubmit, error }) {
    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && (
                <div className="error-message">
                    Something went wrong. Please try again.
                </div>
            )}
            <form onSubmit={handleSubmit} id="auth" autoComplete="off">
                <input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    placeholder="your email"
                />
                <input
                    onChange={handleChange}
                    name="pass"
                    type="password"
                    placeholder="password"
                />
                <button>login</button>
                <Link to="/">Got no account yet? Register here!</Link>
            </form>
        </div>
    );
}

function RegistrationForm({ handleChange, handleSubmit, error }) {
    return (
        <div className="auth-container">
            <h2>Register here!</h2>
            {error && (
                <div className="error-message">
                    Something went wrong. Please try again.
                </div>
            )}
            <form onSubmit={handleSubmit} id="auth" autoComplete="off">
                <input
                    onChange={handleChange}
                    name="first"
                    type="text"
                    placeholder="first name"
                />
                <input
                    onChange={handleChange}
                    name="last"
                    type="text"
                    placeholder="last name"
                />
                <input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    placeholder="your email"
                />
                <input
                    onChange={handleChange}
                    name="pass"
                    type="password"
                    placeholder="password"
                />
                <button>login</button>
                <Link to="/login">Already got an account? Login here.</Link>
            </form>
        </div>
    );
}
