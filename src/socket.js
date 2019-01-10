import * as io from "socket.io-client";
import {
    showListOfOnlineUsers,
    showUserWhoJoined,
    hideUserWhoLeft,
    getChatMessages,
    addNewMessage
} from "./actions";

let socket;

export function initSocket(store) {
    // check if the user already has an open socket, , if no: open a new socket connection
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", listofOnlineUsers => {
            console.log("listofOnlineUsers", listofOnlineUsers);
            store.dispatch(showListOfOnlineUsers(listofOnlineUsers));
        });

        socket.on("userJoined", userWhoJoined => {
            console.log("showUserWhoJoined", userWhoJoined);
            store.dispatch(showUserWhoJoined(userWhoJoined));
        });

        socket.on("userLeft", userWhoLeft => {
            store.dispatch(hideUserWhoLeft(userWhoLeft));
        });

        socket.on("getChatMessages", chatMessages => {
            console.log("chatMessages: ", chatMessages);
            store.dispatch(getChatMessages(chatMessages));
        });

        socket.on("addNewMessage", newMessage => {
            console.log("newMessage in socket.js:", newMessage);
            store.dispatch(addNewMessage(newMessage));
        });
    }
    return socket;
}
