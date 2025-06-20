import { createAsyncThunk } from "@reduxjs/toolkit";

// Create a separate thunk that doesn't rely on the other action creators
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log("Making API call to login endpoint");
      
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const checkEmailExists = createAsyncThunk(
  "auth/checkEmailExists",
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/organizations/check-email?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Pass proper message for 409 or other errors
        return rejectWithValue(data.message || "Email check failed");
      }

      return data;
    } catch (error) {
      console.error("Email check error:", error);
      return rejectWithValue("Network error");
    }
  }
);


export const submitOnboarding = createAsyncThunk(
  "auth/submitOnboarding",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/api/organizations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log("Onboarding response:", data);
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      console.error("Onboarding error:", error);
      return rejectWithValue({
        message: error.message || "Network error",
        errors: [{ path: "form", msg: "Network error occurred. Please try again." }]
      });
    }
  }
);
