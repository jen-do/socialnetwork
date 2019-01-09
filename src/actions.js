import axios from "./axios";

export function getFriendsAndWannabes() {
    return axios.get("/listfriendsandwannabes").then(({ data }) => {
        console.log("data in actions GET request:", data);
        return {
            type: "GET_FRIENDS_AND_WANNABES",
            list: data
        };
    });
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post("/acceptfriendrequest/" + id);
    console.log("data in acceptFriendRequest actions: ", data);
    return {
        type: "ACCEPT",
        sender: data.sender,
        accepted: data.accepted
    };
}

export async function endFriendship(id) {
    const { data } = await axios.post("/endfriendship/" + id);
    console.log("data in endFriendship actions: ", data);
    return {
        type: "END",
        noRelationship: true,
        otherUser: data.otherUser,
        accepted: data.accepted
    };
}

export async function showListOfOnlineUsers(listOfUsersOnline) {
    console.log("list", listOfUsersOnline);
    return {
        type: "ONLINE_USERS_LIST",
        onlineUsers: listOfUsersOnline
    };
}

export async function showUserWhoJoined(userWhoJoined) {
    console.log("userWhoJoined", userWhoJoined);
    return {
        type: "USER_WHO_JOINED",
        newUser: userWhoJoined
    };
}

export async function hideUserWhoLeft(userWhoLeft) {
    console.log("userWhoLeft", userWhoLeft);
    return {
        type: "USER_WHO_LEFT",
        userLeft: userWhoLeft
    };
}

export async function getChatMessages(chatMessages) {
    console.log("chatMessages in actions: ", chatMessages);
    return {
        type: "CHAT_MESSAGES",
        chatMessages: chatMessages
    };
}

export async function addNewMessage(newMessage) {
    return {
        type: "NEW_MESSAGE",
        newMessage: newMessage
    };
}

export async function searchUsers(username) {
    const { data } = await axios.get("/search/" + username);
    // console.log("data in axios GET for user search: ", data);
    return {
        type: "USER_SEARCH",
        users: data.results,
        noResults: data.noSearchResults
    };
}
