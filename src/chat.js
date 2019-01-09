import React from "react";
import { connect } from "react-redux";
import { initSocket } from "./socket";
import { getChatMessages } from "./actions";
import moment from "moment";

class Chat extends React.Component {
    constructor() {
        super();
        this.sendMessage = this.sendMessage.bind(this);
        this.updateTime = this.updateTime.bind(this);
    }

    sendMessage(e) {
        let socket = initSocket();
        if (e.which === 13) {
            // console.log("moment", moment().get("second"));
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    }

    componentDidMount() {
        setInterval(() => this.updateTime(), 60000);
    }

    updateTime() {
        this.props.chatMessages.map(message => {
            moment(message.createdAt).fromNow();
            return message;
        });
    }

    componentDidUpdate() {
        console.log("this.elem:", this.elem);
        // add scrolling feature
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    // this.elem will give a refernce to this elem throughout the component  (here: the div with class chat-container)

    render() {
        return (
            <div>
                <h1>Chat</h1>
                <div ref={elem => (this.elem = elem)}>
                    {this.props.chatMessages &&
                        this.props.chatMessages
                            .sort((a, b) => a["id"] - b["id"])
                            .map((message, index) => {
                                return (
                                    <div key={index} className="chat-message">
                                        <img
                                            className="friends-pic"
                                            src={
                                                message.image ||
                                                "/images/placeholder.png"
                                            }
                                        />
                                        <div className="chat-user-message">
                                            <p>
                                                <strong>
                                                    {message.first}{" "}
                                                    {message.last} wrote:
                                                </strong>
                                            </p>
                                            <p>"{message.message}"</p>
                                            <p>{message.createdAt}</p>
                                        </div>
                                    </div>
                                );
                            })}
                </div>
                <textarea
                    id="chatfield"
                    onKeyDown={this.sendMessage}
                    placeholder="your message..."
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        chatMessages: state.chatMessages
    };
}

export default connect(mapStateToProps)(Chat);
