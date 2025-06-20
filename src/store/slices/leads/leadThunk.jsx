import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all leads
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (_, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/api/leads", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the auth token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch leads");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch leads error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Create a new lead
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, { rejectWithValue, dispatch }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the auth token
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to create lead");
      }

      const data = await response.json();

      // Force a refresh of the leads list after creating a new lead
      dispatch(fetchLeads());

      return data;
    } catch (error) {
      console.error("Create lead error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update an existing lead
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch(`http://localhost:3000/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the auth token
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to update lead");
      }

      const responseData = await response.json();

      // Refresh the lead list after updating a lead
      // dispatch(fetchLeads());

      return responseData;
    } catch (error) {
      console.error("Update lead error:", error);
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

// New comprehensive leads fetching with filters, pagination and sorting
export const getAllLeadsWithSearchFilter = createAsyncThunk(
  "leads/getAllLeadsWithSearchFilter",
  async (params, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.status && params.status !== "all")
        queryParams.append("status", params.status);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.phoneNumber)
        queryParams.append("phoneNumber", params.phoneNumber);

      const queryString = queryParams.toString();
      const url = `http://localhost:3000/api/leads${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch leads");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch leads error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch lead details by ID
export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch(`http://localhost:3000/api/leads/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the auth token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch lead details"
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch lead details error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);
