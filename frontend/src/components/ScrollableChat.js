import { Avatar, Icon, Tooltip } from "@chakra-ui/react";
import { React, useRef, useEffect, useState } from "react";
import { Element } from "react-scroll";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";

import { saveAs } from "file-saver";

const download = (e) => {
  // saveAs(e.target.src)
  console.log(e);
  let name = e.target.src;
  saveAs(e.target.src, `${name.substring(22,)}`);
};

const downloadFile = (e) => {
  // saveAs(e.target.src)
  console.log(e);
  let name = e.target.src;
  saveAs(e.target.src, `${name}`);
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const messageEndRef = useRef(null);
  console.log(messages);

  // console.log(`http://localhost:5000/${messages[25].content}`);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <Element>
      {messages &&
        messages.map((m, i) =>
          // console.log(m.content.substring(0, 7) === "uploads"),
          m.content.substring(0, 7) === "uploads" ? (
            m.content.substring(m.content.length - 3, m.content.length) ===
            "mp4" ? (
              <Element style={{ display: "flex" }} key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={
                        m.sender.pic !==
                        `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
                          ? m.sender.pic
                          : m.sender.name
                      }
                    />
                  </Tooltip>
                )}

                <video
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "green" : "black"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    color: "white",
                  }}
                  src={`http://localhost:5000/${m.content}`}
                  alt="video"
                  type="video/mp4"
                  controls
                />
              </Element>
            ) : m.content.substring(m.content.length - 3, m.content.length) ===
              "pdf" ? (
              <Element style={{ display: "flex" }} key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={
                        m.sender.pic !==
                        `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
                          ? m.sender.pic
                          : m.sender.name
                      }
                    />
                  </Tooltip>
                )}
                <div
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "green" : "white"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 5px",
                    // maxWidth: "75%",
                    width: "250px",
                    // height: "50px",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                  }}
                  
                >
              
                  <img
                    src="https://img.icons8.com/color/48/000000/pdf.png"
                    height="24px"
                    width="24px"
                    alt="pic"
                    // onClick={downloadFile}
                  />
                  {m.content.substring(22,)}
                  <input type="image" src={`http://localhost:5000/${m.content}`} alt="" width="24" height="24" onClick={downloadFile}/>
                </div>
              </Element>
            ) : (
              <Element style={{ display: "flex" }} key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={
                        m.sender.pic !==
                        `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
                          ? m.sender.pic
                          : m.sender.name
                      }
                    />
                  </Tooltip>
                )}

                <img
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "green" : "white"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 5px",
                    // maxWidth: "75%",
                    width: "35%",
                    height: "35%",
                    color: "white",
                    cursor: "pointer",
                  }}
                  src={`http://localhost:5000/${m.content}`}
                  alt="pic"
                  onClick={download}
                />
              </Element>
            )
          ) : (
            <Element style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={
                      m.sender.pic !==
                      `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
                        ? m.sender.pic
                        : m.sender.name
                    }
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "green" : "black"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  color: "white",
                }}
              >
                {m.content}
              </span>
            </Element>
          )
        )}
      <div ref={messageEndRef} />
    </Element>
  );
};

export default ScrollableChat;
