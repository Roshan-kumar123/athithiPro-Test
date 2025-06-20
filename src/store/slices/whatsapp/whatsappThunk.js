import { createAsyncThunk } from "@reduxjs/toolkit";

// Get permanent token from Facebook code
export const getPermanentToken = createAsyncThunk(
  "whatsapp/getPermanentToken",
  async (code, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:3000/api/whatsapp/get-permanent-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to get permanent token"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get permanent token error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update WABA token details
export const updateWabaTokenDetails = createAsyncThunk(
  "whatsapp/updateWabaTokenDetails",
  async (accessToken, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:3000/api/whatsapp/update-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accessToken }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to update token details"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update WABA token error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update WABA business details
export const updateWabaBusinessDetails = createAsyncThunk(
  "whatsapp/updateWabaBusinessDetails",
  async ({ businessAccountId, phoneNumberId, wabaId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:3000/api/whatsapp/update-business",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ businessAccountId, phoneNumberId, wabaId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to update business details"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update WABA business details error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Submit business verification form
export const submitBusinessVerification = createAsyncThunk(
  "whatsapp/submitBusinessVerification",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:3000/api/whatsapp/verify-business",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to submit verification"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Submit business verification error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);
