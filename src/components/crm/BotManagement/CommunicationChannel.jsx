import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CommunicationChannel.css";
import AgencyDropdown from "./AgencyDropdown";
import RightSidebar from "./RightSidebar";
import AgentAvatar from "./AgentAvatar";
import {
  fetchSessions,
  fetchMessagesBySession,
  sendMessage,
  deleteMessage,
  deleteAllSessionMessages,
} from "../../../store/slices/chats/chatThunk";
import { setCurrentSession } from "../../../store/slices/chats/chatSlice";
import { getAllLeadsWithSearchFilter } from "../../../store/slices/leads/leadThunk";
import { SendHorizontal } from "lucide-react";
import noChatImage from "../../../assets/noChats.png";

const FEMALE_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAbiyhbiVsB3BauQDza-fHaDfNxk52Pni0HMyFfqThLgsWnOtOeApfliG3-1BgH61WITg&usqp=CAU";
const MALE_AVATAR =
  "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740";

function getAvatar(gender) {
  return gender === "female" ? FEMALE_AVATAR : MALE_AVATAR;
}

// Function to render user messages based on type
const UserMessage = ({ msg }) => {
  if (!msg) return null;
  
  // Handle text messages
  if (msg.messageType === "text" || !msg.messageType) {
    return <div>{msg.user}</div>;
  }
  
  // Handle image messages
  if (msg.messageType === "image" && msg.mediaUrl) {
    return (
      <div className="user-media-message">
        <div className="media-container">
          <img src={msg.mediaUrl} alt="User sent" className="user-image" />
        </div>
        {msg.mediaCaption && <div className="media-caption">{msg.mediaCaption}</div>}
      </div>
    );
  }
  
  // Handle video messages
  if (msg.messageType === "video" && msg.mediaUrl) {
    return (
      <div className="user-media-message">
        <div className="media-container">
          <video controls className="user-video">
            <source src={msg.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {msg.mediaCaption && <div className="media-caption">{msg.mediaCaption}</div>}
      </div>
    );
  }
  
  // Handle audio messages
  if ((msg.messageType === "audio" || msg.messageType === "voice") && msg.mediaUrl) {
    return (
      <div className="user-media-message">
        <div className="media-container">
          <audio controls className="user-audio">
            <source src={msg.mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
    );
  }
  
  // Handle document messages
  if (msg.messageType === "document" && msg.mediaUrl) {
    return (
      <div className="user-media-message">
        <div className="document-container">
          <i className="fa fa-file-o"></i>
          <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">
            {msg.mediaCaption || "Document"}
          </a>
        </div>
      </div>
    );
  }
  
  // Handle location messages
  if (msg.messageType === "location") {
    return <div>📍 Location shared</div>;
  }
  
  // Handle contact messages
  if (msg.messageType === "contacts") {
    return <div>👤 Contact shared</div>;
  }
  
  // Fallback for other message types
  return <div>{msg.user}</div>;
};

// Improved BotMessage component
const BotMessage = ({ bot }) => {
  if (!bot) return null;

  // Handle text messages
  if (typeof bot === 'string') {
    return <div>{bot}</div>;
  }
  
  // Handle object format with text property
  if (bot.text) {
    return <div>{bot.text}</div>;
  }
  
  // Handle object format with content property
  if (bot.content) {
    return <div>{bot.content}</div>;
  }
  
  // Handle object format with type and content
  if (bot.type === 'text' && bot.content) {
    return <div>{bot.content}</div>;
  }

  // Handle button messages
  if (bot.type === "buttons" && bot.buttons) {
    return (
      <div className="bot-message-container">
        <div className="bot-message-text">{bot.content}</div>
        <div className="bot-message-buttons">
          {bot.buttons.map((button, index) => (
            <button key={index} className="bot-button">
              {button}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Handle carousel messages
  if (bot.type === "carousel" && bot.items) {
    return (
      <div className="bot-message-container">
        <div className="bot-message-text">{bot.content}</div>
        <div className="bot-carousel">
          {bot.items.map((item, index) => (
            <div key={index} className="carousel-item">
              <div className="carousel-item-title">{item.title}</div>
              <div className="carousel-item-desc">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle image messages
  if (bot.type === "image") {
    return (
      <div className="bot-message-container">
        <img src={bot.imageUrl} alt="Bot sent" className="bot-image" />
        {bot.caption && <div className="bot-image-caption">{bot.caption}</div>}
      </div>
    );
  }

  // Fallback for unknown formats
  return <div>{JSON.stringify(bot)}</div>;
};

const CommunicationChannel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessions, currentSession, messages, loading } = useSelector(
    (state) => state.chat
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [localSessions, setLocalSessions] = useState([]);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [pendingAgents, setPendingAgents] = useState([]);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const chatBodyRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const sessionPollingIntervalRef = useRef(null);
  const sentMessagesRef = useRef(new Set()); // Track sent messages to prevent duplicates

  // Initial fetch of sessions
  useEffect(() => {
    dispatch(fetchSessions())
      .then(response => {
        if (response.payload) {
          setLocalSessions(response.payload);
        }
      });
    
    // Ensure proper initialization without triggering sidebar
    setTimeout(() => {
      setIsInitialized(true);
      setHasInitialLoad(true);
    }, 100);
    
    // Start polling for sessions every 5 seconds
    sessionPollingIntervalRef.current = setInterval(() => {
      dispatch(fetchSessions())
        .then(response => {
          if (response.payload) {
            setLocalSessions(response.payload);
            
            // If we have a current session, update its data from the refreshed sessions
            if (currentSession) {
              const updatedSession = response.payload.find(s => s._id === currentSession._id);
              if (updatedSession) {
                dispatch(setCurrentSession(updatedSession));
              }
            }
          }
        });
    }, 5000);
    
    return () => {
      if (sessionPollingIntervalRef.current) {
        clearInterval(sessionPollingIntervalRef.current);
      }
    };
  }, [dispatch]);

  // When current session changes, fetch messages
  useEffect(() => {
    if (currentSession) {
      dispatch(fetchMessagesBySession(currentSession._id))
        .then(response => {
          if (response.payload) {
            // Remove duplicates by message content and timestamp
            const uniqueMessages = removeDuplicateMessages(response.payload);
            setLocalMessages(uniqueMessages);
            
            // Update sent messages tracking
            uniqueMessages.forEach(msg => {
              if (msg._id) {
                sentMessagesRef.current.add(msg._id);
              }
            });
          }
        });
      
      // Start polling for new messages every 3 seconds
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      pollingIntervalRef.current = setInterval(() => {
        dispatch(fetchMessagesBySession(currentSession._id))
          .then(response => {
            if (response.payload) {
              // Remove duplicates by message content and timestamp
              const uniqueMessages = removeDuplicateMessages(response.payload);
              setLocalMessages(uniqueMessages);
              
              // Update sent messages tracking
              uniqueMessages.forEach(msg => {
                if (msg._id) {
                  sentMessagesRef.current.add(msg._id);
                }
              });
            }
          });
      }, 3000);
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [dispatch, currentSession]);

  // Only reset agents when session actually changes, never auto-open sidebar
  useEffect(() => {
    if (currentSession && hasInitialLoad) {
      // Reset agents for new session
      setAssignedAgents([]);
      setPendingAgents([]);
      // Never automatically manipulate sidebar state
    }
  }, [currentSession?._id, hasInitialLoad]);

  // Function to remove duplicate messages
  const removeDuplicateMessages = (messages) => {
    const uniqueMap = new Map();
    const seenMessageIds = new Set();
    
    // First pass: Filter out duplicates by messageId
    const messagesWithoutDuplicateIds = messages.filter(msg => {
      if (!msg.messageId) return true;
      
      if (seenMessageIds.has(msg.messageId)) {
        return false;
      }
      
      seenMessageIds.add(msg.messageId);
      return true;
    });
    
    // Second pass: Group messages by content and timestamp (rounded to minute)
    messagesWithoutDuplicateIds.forEach(msg => {
      const isUser = !!msg.user;
      const content = isUser ? msg.user : (typeof msg.bot === 'string' ? msg.bot : 
                     msg.bot?.text || msg.bot?.content || JSON.stringify(msg.bot));
      
      // Round timestamp to the minute to group messages sent in the same minute
      const timestamp = new Date(msg.date);
      const timeKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}-${timestamp.getMinutes()}`;
      
      const key = `${isUser ? 'user' : 'bot'}-${content}-${timeKey}-${msg.messageType || 'text'}`;
      
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, msg);
      } else {
        // If we already have this message, keep the one with a valid _id
        const existing = uniqueMap.get(key);
        if (!existing._id && msg._id) {
          uniqueMap.set(key, msg);
        }
      }
    });
    
    // Convert back to array and sort by date
    return Array.from(uniqueMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [localMessages]);

  const filteredSessions = localSessions.filter((session) =>
    (session.name || session.phoneNumber)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSessionClick = (session) => {
    // Clear the sent messages tracking when changing sessions
    sentMessagesRef.current.clear();
    dispatch(setCurrentSession(session));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentSession) return;
    
    // Create a temporary ID for this message
    const tempId = `temp-${Date.now()}`;
    
    // Create a temporary message to show immediately
    const tempMessage = {
      _id: tempId,
      user: null,
      bot: { type: "text", text: messageText },
      sessionId: currentSession._id,
      date: new Date()
    };
    
    // Check if we've already sent this message
    if (sentMessagesRef.current.has(tempId)) {
      console.log("Preventing duplicate message send:", messageText);
      return;
    }
    
    // Track that we're sending this message
    sentMessagesRef.current.add(tempId);
    
    // Add to local messages immediately
    setLocalMessages(prevMessages => [...prevMessages, tempMessage]);
    
    // Clear input
    setMessageText("");
    
    // Send the actual message to the server
    const messageData = {
      user: null,
      bot: { type: "text", text: messageText },
      sessionId: currentSession._id,
    };
    
    dispatch(sendMessage(messageData));
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      dispatch(deleteMessage(messageId));
    }
  };

  const handleClearChat = () => {
    if (
      currentSession &&
      window.confirm(
        "Are you sure you want to delete all messages in this conversation?"
      )
    ) {
      dispatch(deleteAllSessionMessages(currentSession._id));
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to send predefined responses
  const sendPredefinedResponse = (responseType) => {
    if (!currentSession) return;

    let messageData = {
      user: null,
      sessionId: currentSession._id,
      bot: null,
    };

    switch (responseType) {
      case "greeting":
        messageData.bot = {
          type: "text",
          text: `Hello ${currentSession.name || ""}! How can I help you today?`,
        };
        break;
      case "appointment":
        const dateOptions = getNextThreeDates();
        messageData.bot = {
          type: "buttons",
          content: "📅 Please choose a date for your appointment:",
          buttons: dateOptions,
        };
        break;
      case "offers":
        messageData.bot = {
          type: "carousel",
          content: "🔥 Current Offers",
          items: [
            { title: "30% off Facial", description: "Limited time offer!" },
            { title: "Hair Spa Combo", description: "Buy 1 Get 1" },
          ],
        };
        break;
      default:
        return;
    }

    dispatch(sendMessage(messageData));
  };

  // Helper function to get next three dates (matching the backend)
  const getNextThreeDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
      dates.push(formattedDate);
    }
    return dates;
  };

  // Handle agent selection (pending state)
  const handleAgentSelect = (agents) => {
    setPendingAgents(agents);
  };

  // Handle adding/removing selected agents
  const handleAgentAdd = () => {
    const agentsToAdd = [];
    const agentsToRemove = [];

    pendingAgents.forEach((agent) => {
      const isCurrentlyAssigned = assignedAgents.some(
        (assigned) => assigned._id === agent._id
      );

      if (isCurrentlyAssigned) {
        agentsToRemove.push(agent);
      } else {
        agentsToAdd.push(agent);
      }
    });

    // Remove agents that are marked for removal
    const updatedAssigned = assignedAgents.filter(
      (assigned) =>
        !agentsToRemove.some((toRemove) => toRemove._id === assigned._id)
    );

    // Add new agents
    setAssignedAgents([...updatedAssigned, ...agentsToAdd]);
    setPendingAgents([]);
  };

  // Handle clearing agents
  const handleAgentClear = () => {
    setPendingAgents([]);
    setAssignedAgents([]);
  };

  // Handle removing individual assigned agent
  const handleRemoveAssignedAgent = (agentToRemove) => {
    setAssignedAgents(
      assignedAgents.filter((agent) => agent._id !== agentToRemove._id)
    );
    setPendingAgents(
      pendingAgents.filter((agent) => agent._id !== agentToRemove._id)
    );
  };

  // Handle tab navigation - ONLY open sidebar when user explicitly clicks
  const handleTabNavigation = (tabType) => {
    if (!currentSession) return;

    // Ensure we have a valid tab type before opening sidebar
    switch (tabType) {
      case "leads":
        dispatch(
          getAllLeadsWithSearchFilter({
            phoneNumber: currentSession.phoneNumber,
            page: 1,
            limit: 50,
          })
        );
        // Set both activeTab and sidebar state atomically
        setActiveTab("leads");
        setRightSidebarOpen(true);
        break;
      case "bookings":
        // Set both activeTab and sidebar state atomically
        setActiveTab("bookings");
        setRightSidebarOpen(true);
        break;
      default:
        // Don't open sidebar for invalid tab types
        break;
    }
  };

  // Handle sidebar close - reset both states
  const handleSidebarClose = () => {
    setRightSidebarOpen(false);
    setActiveTab(null);
  };

  // Function to get display name for chat header
  const getChatDisplayName = () => {
    return currentSession.name || currentSession.phoneNumber;
  };

  return (
    <div
      className={`comm-channel-root ${rightSidebarOpen ? "sidebar-open" : ""}`}
    >
      <div className="comm-channel-header">
        <span>Chat Management</span>
        <div className="comm-channel-header-actions">
          <i className="fa fa-globe"></i>
          <i className="fa fa-sliders"></i>
          <i className="fa fa-th"></i>
          <i className="fa fa-question-circle"></i>
          <i className="fa fa-bell"></i>
          <img
            className="comm-channel-profile"
            src={MALE_AVATAR}
            alt="profile"
          />
        </div>
      </div>

      <div className="comm-channel-main">
        <div className="comm-channel-sidebar">
          <div className="comm-channel-search">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Search contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="comm-channel-fav-header">
            <span>Conversations</span>
          </div>
          <div className="comm-channel-conv-list">
            {filteredSessions.length === 0 ? (
              <div className="no-results">No conversations found</div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session._id}
                  className={`comm-channel-conv-item${
                    currentSession && currentSession._id === session._id
                      ? " active"
                      : ""
                  }`}
                  onClick={() => handleSessionClick(session)}
                >
                  <img
                    src={MALE_AVATAR}
                    alt={session.name || session.phoneNumber}
                    className="comm-channel-conv-avatar"
                  />
                  <div className="comm-channel-conv-info">
                    <div className="comm-channel-conv-top">
                      <span className="comm-channel-conv-name">
                        {session.name || session.phoneNumber}
                      </span>
                      <span className="comm-channel-conv-time">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="comm-channel-conv-msg">
                      {session.awaitingName
                        ? "Awaiting name..."
                        : session.awaitingAppointment
                        ? "Awaiting appointment..."
                        : "Tap to view conversation"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {currentSession ? (
          <div className="comm-channel-chat">
            <div className="comm-channel-chat-header">
              <div className="comm-channel-user-info">
                <img
                  src={MALE_AVATAR}
                  alt={currentSession.name || currentSession.phoneNumber}
                />
                <div className="comm-channel-user-details">
                  <div className="comm-channel-chat-user">
                    {getChatDisplayName()}
                  </div>
                  <div className="comm-channel-chat-status">
                    {currentSession.awaitingName
                      ? "Awaiting name"
                      : currentSession.awaitingAppointment
                      ? "Awaiting appointment"
                      : "Active"}
                    {assignedAgents.length > 0 && (
                      <div className="assigned-agents">
                        • Assigned to:
                        <div className="agent-avatars">
                          {assignedAgents.map((agent) => (
                            <div
                              key={agent._id}
                              className="agent-avatar-container"
                            >
                              <AgentAvatar
                                agent={agent}
                                size="small"
                                showTooltip={true}
                              />
                              <button
                                className="remove-agent-btn"
                                onClick={() => handleRemoveAssignedAgent(agent)}
                                title={`Remove ${agent.fullName}`}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="comm-channel-header-right">
                <div className="comm-channel-user-tabs">
                  <button
                    className="comm-channel-tab-btn"
                    onClick={() => handleTabNavigation("leads")}
                    title={`View leads for ${currentSession.phoneNumber}`}
                  >
                    <i className="fas fa-users"></i>
                    <span>Leads</span>
                  </button>

                  <AgencyDropdown
                    pendingAgents={pendingAgents}
                    assignedAgents={assignedAgents}
                    onAgentSelect={handleAgentSelect}
                    onAgentAdd={handleAgentAdd}
                    onAgentClear={handleAgentClear}
                    currentSession={currentSession}
                  />

                  <button
                    className="comm-channel-tab-btn"
                    onClick={() => handleTabNavigation("bookings")}
                    title={`View bookings for ${currentSession.phoneNumber}`}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    <span>Bookings</span>
                  </button>
                </div>

                <div className="comm-channel-chat-actions">
                  <i
                    className="fa fa-trash comm-channel-chat-info"
                    onClick={handleClearChat}
                    title="Clear all messages"
                  ></i>
                </div>
              </div>
            </div>

            <div className="comm-channel-chat-body" ref={chatBodyRef}>
              {localMessages.length === 0 ? (
                <div className="no-messages">No messages yet</div>
              ) : (
                localMessages.map((msg, index) => {
                  // Generate a stable key that won't cause duplicates
                  const msgKey = msg._id || `msg-${index}-${msg.date}`;
                  
                  return (
                    <div
                      key={msgKey}
                      className={`comm-channel-msg-row ${msg.user ? 'recv' : 'sent'}`}
                      onDoubleClick={() => handleDeleteMessage(msg._id)}
                    >
                      {msg.user && (
                        <img
                          src={MALE_AVATAR}
                          alt="User"
                          className="comm-channel-msg-avatar"
                        />
                      )}
                      <div className="comm-channel-msg-bubble">
                        <div className="comm-channel-msg-text">
                          {msg.user ? (
                            <UserMessage msg={msg} />
                          ) : (
                            <BotMessage bot={msg.bot} />
                          )}
                          <span className="comm-channel-msg-time">
                            {formatMessageTime(msg.date)}
                          </span>
                        </div>
                      </div>
                      {!msg.user && (
                        <img
                          src={MALE_AVATAR}
                          alt="Bot"
                          className="comm-channel-msg-avatar"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="comm-channel-quick-responses">
              <button onClick={() => sendPredefinedResponse("greeting")}>
                Greeting
              </button>
              <button onClick={() => sendPredefinedResponse("appointment")}>
                Appointment
              </button>
              <button onClick={() => sendPredefinedResponse("offers")}>
                Offers
              </button>
            </div>

            <form
              className="comm-channel-chat-input"
              onSubmit={handleSendMessage}
            >
              <i className="fa fa-paperclip"></i>
              <i className="fa fa-smile-o"></i>
              <input
                type="text"
                placeholder="Type message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={!messageText.trim()}>
                <SendHorizontal size={20} />
              </button>
            </form>
          </div>
        ) : (
          <div className="comm-channel-empty-state">
            <div className="empty-state-content">
              <img
                src={noChatImage}
                alt="No chat selected"
                className="no-chat-image"
              />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Only render RightSidebar when it should be open AND has valid activeTab */}
      <RightSidebar
        isOpen={rightSidebarOpen && activeTab !== null}
        onClose={handleSidebarClose}
        activeTab={activeTab}
        currentSession={currentSession}
        selectedAgents={assignedAgents}
      />
    </div>
  );
};

export default CommunicationChannel;
