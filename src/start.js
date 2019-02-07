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

// rendering either Welcome (login or registration) or logged-in section contained in App
// App and all of its child components will have access to Redux
if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    component = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

ReactDOM.render(component, document.querySelector("main"));
