// functional component (just renders the registration form; server checks whether a user is logged in or not )

import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        // all of JSX goes here
        <div className="welcome-container">
            <h1>Welcome!</h1>
            <Registration />
        </div>
    );
}
