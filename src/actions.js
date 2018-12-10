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
