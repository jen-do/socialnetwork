import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Registration, Login } from "./auth";

export default function Welcome() {
    return (
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
