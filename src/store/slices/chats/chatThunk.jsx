import { createAsyncThunk } from "@reduxjs/toolkit";

// Base API URL
const API_URL = "http://localhost:3000/api/chat"; // Update with your actual API URL

// 1. Fetch all chat sessions
export const fetchSessions = createAsyncThunk(
  "chat/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/sessions`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to fetch sessions");
      }
      
      return data;
    } catch (error) {
      console.error("Fetch sessions error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// 2. Fetch messages by session ID
export const fetchMessagesBySession = createAsyncThunk(
  "chat/fetchMessagesBySession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/messages/${sessionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to fetch messages");
      }
      
      return data;
    } catch (error) {
      console.error("Fetch messages error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// 3. Send a new message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to send message");
      }
      
      return data;
    } catch (error) {
      console.error("Send message error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// 4. Delete a message
export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/message/${messageId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to delete message");
      }
      
      return messageId; // Return the ID of the deleted message
    } catch (error) {
      console.error("Delete message error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// 5. Delete all messages for a session
export const deleteAllSessionMessages = createAsyncThunk(
  "chat/deleteAllSessionMessages",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/messages/${sessionId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to delete messages");
      }
      
      return sessionId; // Return the session ID whose messages were deleted
    } catch (error) {
      console.error("Delete all messages error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Delete a lead
export const deleteLead = createAsyncThunk(
    "leads/deleteLead",
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:3000/api/leads/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          return rejectWithValue(data.message || "Failed to delete lead");
        }
        
        return id; // Return the id of the deleted lead
      } catch (error) {
        console.error("Delete lead error:", error);
        return rejectWithValue(error.message || "Network error");
      }
    }
  );
  