import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Search organizations
 */
export const searchOrganizations = createAsyncThunk(
  "organizations/search",
  async (searchTerm, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:3000/api/organizations?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to search organizations"
        );
      }

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.error("Search organizations error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

/**
 * Fetch organization priority score data
 */
export const fetchPriorityScoreByOrgId = createAsyncThunk(
  "organizations/fetchPriorityScore",
  async (orgId, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:3000/api/priority-score/orgId/${orgId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch priority score data"
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch priority score error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

/**
 * Update priority score configuration
 */
export const updatePriorityScore = createAsyncThunk(
  "organizations/updatePriorityScore",
  async (priorityScoreData, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch(`http://localhost:3000/api/priority-score`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(priorityScoreData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to update priority score"
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Update priority score error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);
