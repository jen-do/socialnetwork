# social network project

A social network, where people can register/login and create a personal profile, search for and chat with other users and make friends. In case you want to leave the network, you can delete your account again and all personal information about you stored in the network.

**Technologies used**: React.js, Redux, socket.io, PostgreSQL, Node.js ... and of course JavaScript and CSS.

This project was build within 12 days of learning React.js and Redux by doing and coding. The result represents core features of a social network.

For me this was a good opportunity to gather more practical experience with asychronous JavaScript (using Promises and async/await) as well as with database queries - and to explore React, a very powerful framework for buildung single-site applications.

## the features in detail

### registration, login and own profile

Starting off people can create an account or sign in. An error message is displayed when a user omits to fill in a required field or enters credentials that are not valid. For login and registration I used a Higher Order Component (HOC) that contains the logic for both processes and forms and `bcyrpt` for password encryption.

Once logged in a user can edit his_her profile - upload an personal profile picture, add some information about his_herself or update both. The profile pictures are stored online at Amazon Webservice cloud storage.

![login and editing profile](https://github.com/jen-do/socialnetwork/raw/master/public/images/login-profile-edit.gif)

### finding people on the network

You can search other users by name and view their profiles.

![user search](https://github.com/jen-do/socialnetwork/raw/master/public/images/user-search.gif)

You can also check out who's online now. For this feature I used socket.io and Redux to get and maintain the list of users currently online. As soon as a new user joins or another user logs out of the network the list is updated instantaneously without reloading the page. This gif shows on a split screen the accounts of two users - one of them just about to log in and appear in the list of online users.

![who's online now](https://github.com/jen-do/socialnetwork/raw/master/public/images/onlineusers.gif)

### friend requests and chat

It's possible to send and accept friend requests or to end an existing friendship. A list shows all friends and pending friendship requests. Again you can see the interaction on a split screen showing two users logged in.

![friendship request](https://github.com/jen-do/socialnetwork/raw/master/public/images/friendshiprequests.gif)

People can also connect in a public chat room. This feature was built using socket.io; the new message pops up instantaneously. I made the website responsive, here you can see how it looks on mobile devices.

![public chat](https://github.com/jen-do/socialnetwork/raw/master/public/images/chat.gif)

### account and image deletion

To ensure that all previously uploaded data (like old profile pictures) is deleted as well, I implemented this feature as a two-step process:

1.  Once the user changes his_her profile picture the old image is deleted from AWS by default.
2.  If the user decides to leave the network and kill the account both the current image and subsequently all infomation about the user (including chat messages) are deleted.
