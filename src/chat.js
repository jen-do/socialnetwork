import React from "react";
import { connect } from "react-redux";
import { initSocket } from "./socket";
import { getChatMessages } from "./actions";

class Chat extends React.Component {
    constructor() {
        super();
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        let socket = initSocket();
        if (e.which === 13) {
            socket.emit("newMessage", e.target.value);
        }
    }

    componentDidUpdate() {
        console.log("this.elem:", this.elem);
        // add scrolling feature
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    // this.elem will give a refernce to this elem throughout the component  (here: the div with class chat-container)

    render() {
        console.log(
            "this.props.chatMessages in chat component",
            this.props.chatMessages
        );
        return (
            <div id="chat">
                <h1>Chat</h1>
                <div id="chat-messages" ref={elem => (this.elem = elem)}>
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
                                        <p>
                                            {message.first} {message.last}{" "}
                                            wrote:
                                        </p>
                                        <p>"{message.message}"</p>
                                    </div>
                                );
                            })}
                </div>
                <textarea onKeyDown={this.sendMessage} />
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
