export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_AND_WANNABES") {
        var list = action.list;

        return { ...state, list };
    }
    if (action.type == "ACCEPT") {
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
        var listOfUsersOnline = action.onlineUsers;
        return { ...state, listOfUsersOnline };
    }
    if (action.type == "USER_WHO_JOINED") {
        var newUser = action.newUser;
        return (state = {
            ...state,
            listOfUsersOnline:
                state.listOfUsersOnline &&
                state.listOfUsersOnline.concat(newUser)
        });
    }
    if (action.type == "USER_WHO_LEFT") {
        return (state = {
            ...state,
            listOfUsersOnline:
                state.listOfUsersOnline &&
                state.listOfUsersOnline.filter(
                    userOnline => userOnline.id !== action.userLeft
                )
        });
    }
    if (action.type == "CHAT_MESSAGES") {
        return {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type == "NEW_MESSAGE") {
        return {
            ...state,
            chatMessages:
                state.chatMessages &&
                state.chatMessages.concat(action.newMessage)
        };
    }
    if (action.type == "USER_SEARCH") {
        var resultsFromUserSearch = action.users;
        var noResults = action.noResults;
        return { ...state, resultsFromUserSearch, noResults };
    }

    return state;
}
