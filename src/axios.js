import axios from "axios";

// configure axios to include csurf protection: adding the name and value of csurf token as properties to axois

var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token"
});

export default instance;
