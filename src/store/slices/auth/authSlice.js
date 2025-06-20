import { createSlice } from "@reduxjs/toolkit";
import { loginUser, checkEmailExists, submitOnboarding } from "./authThunk";

// Check if token exists in localStorage for initial state
const token = localStorage.getItem('authToken');

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
  isAuthenticated: !!token, // Set to true if token exists
  emailExists: false,
  emailChecking: false,
  emailCheckError: null,
  onboardingLoading: false,
  onboardingError: null,
  onboardingSuccess: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
    clearEmailCheck: (state) => {
      state.emailExists = false;
      state.emailChecking = false;
      state.emailCheckError = null;
    },
    clearOnboardingStatus: (state) => {
      state.onboardingLoading = false;
      state.onboardingError = null;
      state.onboardingSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })
      
      .addCase(checkEmailExists.pending, (state) => {
        state.emailChecking = true;
        state.emailCheckError = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.emailChecking = false;
        state.emailExists = action.payload.exists;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.emailChecking = false;
        state.emailCheckError = action.payload;
      })
      
      .addCase(submitOnboarding.pending, (state) => {
        state.onboardingLoading = true;
        state.onboardingError = null;
      })
      .addCase(submitOnboarding.fulfilled, (state, action) => {
        state.onboardingLoading = false;
        state.onboardingSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.onboardingLoading = false;
        state.onboardingError = action.payload;
      });
  },
});

export const { logout, clearEmailCheck, clearOnboardingStatus } = authSlice.actions;
export default authSlice.reducer;
