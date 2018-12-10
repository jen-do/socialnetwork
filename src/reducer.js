export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_AND_WANNABES") {
        console.log("action.list in reducer", action.list);
        var list = action.list;

        return { ...state, list };
    }
    if (action.type == "ACCEPT") {
        console.log(
            "ACCEPT action.list in reducer",
            action.sender,
            action.accepted
        );
        state = {
            ...state,
            list:
                state.list &&
                state.list.map(user => {
                    if (user.id == action.sender) {
                        return {
                            ...user,
                            accepted: action.accepted
                        };
                    } else {
                        return user;
                    }
                })
        };
    }
    if (action.type == "END") {
        console.log("END in reducer", action);
        state = {
            ...state,
            list:
                state.list &&
                state.list.map(user => {
                    if (user.id == action.otherUser && !user.noRelationship) {
                        return {
                            ...user,
                            accepted: action.accepted,
                            noRelationship: action.noRelationship
                        };
                    } else {
                        return {
                            ...user
                        };
                    }
                })
        };
    }
    if (action.type == "ONLINE_USERS_LIST") {
        console.log("ONLINE_USERS_LIST in reducer", action);
        var listOfUsersOnline = action.onlineUsers;
        return { ...state, listOfUsersOnline };
    }
    if (action.type == "USER_WHO_JOINED") {
        console.log("USER_WHO_JOINED", action.newUser);
        var newUser = action.newUser;
        return (state = {
            ...state,
            listOfUsersOnline:
                state.listOfUsersOnline &&
                state.listOfUsersOnline.concat(newUser)
        });
    }
    console.log("state in reducer", state);
    return state;
}
