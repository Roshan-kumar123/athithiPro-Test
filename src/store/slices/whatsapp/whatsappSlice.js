import { createSlice } from "@reduxjs/toolkit";
import {
  getPermanentToken,
  updateWabaTokenDetails,
  updateWabaBusinessDetails,
  submitBusinessVerification,
} from "./whatsappThunk";

const initialState = {
  // Facebook/WABA connection state
  isConnected: false,
  accessToken: null,
  businessAccountId: null,
  phoneNumberId: null,
  wabaId: null,

  // Business verification state
  verificationStatus: "pending", // pending, approved, rejected
  businessDetails: {
    name: "",
    category: "",
    description: "",
    phoneNumber: "",
  },

  // Loading states
  isLoading: false,
  isSubmitting: false,
  isConnecting: false,

  // Error handling
  error: null,

  // Success messages
  successMessage: null,
};

const whatsappSlice = createSlice({
  name: "whatsapp",
  initialState,
  reducers: {
    // Clear error messages
    clearError: (state) => {
      state.error = null;
    },

    // Clear success messages
    clearSuccess: (state) => {
      state.successMessage = null;
    },

    // Update business form data
    updateBusinessForm: (state, action) => {
      state.businessDetails = {
        ...state.businessDetails,
        ...action.payload,
      };
    },

    // Reset connection state
    resetConnection: (state) => {
      state.isConnected = false;
      state.accessToken = null;
      state.businessAccountId = null;
      state.phoneNumberId = null;
      state.wabaId = null;
    },
  },
  extraReducers: (builder) => {
    // Get Permanent Token
    builder
      .addCase(getPermanentToken.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(getPermanentToken.fulfilled, (state, action) => {
        state.isConnecting = false;
        state.accessToken = action.payload.access_token;
        state.successMessage = "Successfully obtained permanent token";
      })
      .addCase(getPermanentToken.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload || "Failed to get permanent token";
      });

    // Update WABA Token Details
    builder
      .addCase(updateWabaTokenDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWabaTokenDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Token details updated successfully";
      })
      .addCase(updateWabaTokenDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update token details";
      });

    // Update WABA Business Details
    builder
      .addCase(updateWabaBusinessDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWabaBusinessDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = true;
        state.businessAccountId = action.meta.arg.businessAccountId;
        state.phoneNumberId = action.meta.arg.phoneNumberId;
        state.wabaId = action.meta.arg.wabaId;
        state.successMessage =
          "WhatsApp Business account connected successfully";
      })
      .addCase(updateWabaBusinessDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update business details";
      });

    // Submit Business Verification
    builder
      .addCase(submitBusinessVerification.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitBusinessVerification.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.verificationStatus = action.payload.status || "pending";
        state.successMessage = "Business verification submitted successfully";
      })
      .addCase(submitBusinessVerification.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Failed to submit verification";
      });
  },
});

export const { clearError, clearSuccess, updateBusinessForm, resetConnection } =
  whatsappSlice.actions;

export default whatsappSlice.reducer;
