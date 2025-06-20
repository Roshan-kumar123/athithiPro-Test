import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // You'll need to install this: npm install jwt-decode

// Helper to get orgId from token
const getOrgIdFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.orgId;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Fetch all sub-admins
export const fetchSubAdmins = createAsyncThunk(
  "subAdmins/fetchSubAdmins",
  async (_, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Get orgId from token
      const orgId = getOrgIdFromToken();
      if (!orgId) {
        return rejectWithValue("Organization ID not found in token");
      }
      
      // Append orgId as a query parameter
      const response = await fetch(`http://localhost:3000/api/sub-admin?orgId=${orgId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch sub-admins");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch sub-admins error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Create a new sub-admin
export const createSubAdmin = createAsyncThunk(
  "subAdmins/createSubAdmin",
  async (subAdminData, { rejectWithValue, dispatch }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('authToken');
      const orgId = getOrgIdFromToken();
      
      if (!orgId) {
        return rejectWithValue("Unable to retrieve organization ID");
      }
      
      // Add orgId to the data
      const dataWithOrgId = {
        ...subAdminData,
        orgId,
        role: "SUB_ADMIN" // Ensure role is SUB_ADMIN
      };
      
      const response = await fetch("http://localhost:3000/api/sub-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataWithOrgId),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to create sub-admin");
      }
      
      const data = await response.json();
      
      // Force a refresh of the sub-admins list after creating a new one
      dispatch(fetchSubAdmins());
      
      return data;
    } catch (error) {
      console.error("Create sub-admin error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update an existing sub-admin
export const updateSubAdmin = createAsyncThunk(
    "subAdmins/updateSubAdmin",
    async ({ id, updatedFields }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
  
        const response = await fetch(`http://localhost:3000/api/sub-admin/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updatedFields),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || "Failed to update sub-admin");
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Update sub-admin error:", error);
        return rejectWithValue(error.message || "Network error");
      }
    }
  );

// Fetch sub-admin details by ID
export const fetchSubAdminById = createAsyncThunk(
  "subAdmins/fetchSubAdminById",
  async (id, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:3000/api/sub-admin/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch sub-admin details");
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error("Fetch sub-admin details error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Soft delete a sub-admin (set isDeleted = true)
export const softDeleteSubAdmin = createAsyncThunk(
  "subAdmins/softDeleteSubAdmin",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:3000/api/sub-admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          isDeleted: true,
          // Include orgId to ensure proper authorization
          orgId: getOrgIdFromToken()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to delete sub-admin");
      }
      
      const data = await response.json();
      
      // Refresh the list after soft delete
      dispatch(fetchSubAdmins());
      
      return data;
    } catch (error) {
      console.error("Soft delete sub-admin error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);
