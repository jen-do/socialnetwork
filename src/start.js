import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let component;

if (location.pathname == "/welcome") {
    // render welcome screen with registration OR login
    component = <Welcome />;
} else if (location.pathname == "/") {
    // render logged-in section
    component = <App />;
}

// ReactDOM.render should only be called once in all of the code
ReactDOM.render(component, document.querySelector("main"));
