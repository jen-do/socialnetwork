// most of clientside socket code will go here

import * as io from "socket.io-client";
import { showListOfOnlineUsers, showUserWhoJoined } from "./actions";

let socket;

export function initSocket(store) {
    // this if-blocks checks if the user already has an open socket , if no: this opens a new socket connection, most of our clientside socket code will go here, inside the if-block
    if (!socket) {
        socket = io.connect();
        // listen for messages coming from the server, on() accepts 2 arguments: 1) the name of the message coming from the server, 2) callback function that will run the moment the client hears the 'catnip' event
        // value of message is whatever is
        // socket.on("catnip", message => {
        //     console.log(message);
        // });

        socket.on("onlineUsers", listofOnlineUsers => {
            console.log("listofOnlineUsers", listofOnlineUsers);
            store.dispatch(showListOfOnlineUsers(listofOnlineUsers));
        });

        socket.on("userJoined", userWhoJoined => {
            console.log("showUserWhoJoined", userWhoJoined);
            store.dispatch(showUserWhoJoined(userWhoJoined));
        });

        socket.on("userLeft", userWhoLeft => {
            store.dispatch();
        });
    }
    return socket;
}
