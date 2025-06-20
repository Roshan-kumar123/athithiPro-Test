import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchSessions, 
  fetchMessagesBySession, 
  sendMessage, 
  deleteMessage, 
  deleteAllSessionMessages 
} from "./chatThunk";

const initialState = {
  sessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Messages by Session
      .addCase(fetchMessagesBySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesBySession.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessagesBySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete All Session Messages
      .addCase(deleteAllSessionMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllSessionMessages.fulfilled, (state, action) => {
        if (state.currentSession && state.currentSession._id === action.payload) {
          state.messages = [];
        }
        state.loading = false;
      })
      .addCase(deleteAllSessionMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentSession, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
