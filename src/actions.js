import axios from "./axios";

// frienship requests

export function getFriendsAndWannabes() {
    return axios.get("/listfriendsandwannabes").then(({ data }) => {
        return {
            type: "GET_FRIENDS_AND_WANNABES",
            list: data
        };
    });
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post("/acceptfriendrequest/" + id);
    return {
        type: "ACCEPT",
        sender: data.sender,
        accepted: data.accepted
    };
}

export async function endFriendship(id) {
    const { data } = await axios.post("/endfriendship/" + id);
    return {
        type: "END",
        noRelationship: true,
        otherUser: data.otherUser,
        accepted: data.accepted
    };
}

// who's online now

export function showListOfOnlineUsers(listOfUsersOnline) {
    return {
        type: "ONLINE_USERS_LIST",
        onlineUsers: listOfUsersOnline
    };
}

export function showUserWhoJoined(userWhoJoined) {
    return {
        type: "USER_WHO_JOINED",
        newUser: userWhoJoined
    };
}

export function hideUserWhoLeft(userWhoLeft) {
    return {
        type: "USER_WHO_LEFT",
        userLeft: userWhoLeft
    };
}

// chat

export function getChatMessages(chatMessages) {
    return {
        type: "CHAT_MESSAGES",
        chatMessages: chatMessages
    };
}

export function addNewMessage(newMessage) {
    return {
        type: "NEW_MESSAGE",
        newMessage: newMessage
    };
}

// search

export async function searchUsers(username) {
    try {
        const { data } = await axios.get("/search/" + username);
        return {
            type: "USER_SEARCH",
            users: data.results,
            noResults: data.noSearchResults
        };
    } catch (err) {
        console.log("error in searchUsers", error);
    }
}

export function clearStateInSearch() {
    return {
        type: "USER_SEARCH",
        users: null,
        noResults: null
    };
}
