import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { initSocket } from "./socket";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;

if (location.pathname == "/welcome") {
    // render welcome screen with registration OR login
    component = <Welcome />;
} else {
    // render logged-in section, App and everything contained in App will have access to Redux, add initSocket(store) to be able to access the dispatch method in socket.js (outside of a component)
    component = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

// ReactDOM.render should only be called once in all of the code
ReactDOM.render(component, document.querySelector("main"));
