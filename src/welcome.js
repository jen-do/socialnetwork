// functional component (just renders the registration form; server checks whether a user is logged in or not )

import React from "react";
import { HashRouter, Route } from "react-router-dom";
// import Registration from "./registration";
// import Login from "./login";
import { Registration, Login } from "./auth";

export default function Welcome() {
    return (
        // all of JSX goes here
        <div className="welcome-container">
            <h1>Welcome!</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}

// note: for registration it must be exact path = '/': this garantees that registration is rendered only when extat url is slash only
