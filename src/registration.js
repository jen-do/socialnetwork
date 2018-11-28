import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // getting user's input from the registration input fields and storing it in state (via setState method)
    // note: setState is async, so here a callback is needed for consolelogging this.state
    handleChange(e) {
        console.log("handlechange running!", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this state in handleChange: ", this.state)
        );
    }

    // prevent the form's default behaviour and instead write a POST request to  pass the user input (this.state) to the server
    handleSubmit(e) {
        e.preventDefault();
        // console.log(this.state);
        axios
            .post("/registration", this.state)
            .then(resp => {
                // console.log("resp in then of POST /registration: ", resp);
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("error in axios POST /registration: ", err);
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div className="registration-container">
                <h1>Register here!</h1>
                {this.state.error && (
                    <div className="error-message">
                        Something went wrong. Please try again.
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="first name"
                    />
                    <input
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="last name"
                    />
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        onChange={this.handleChange}
                        name="pass"
                        type="password"
                        placeholder="password"
                    />
                    <button>register</button>
                </form>
            </div>
        );
    }
}
