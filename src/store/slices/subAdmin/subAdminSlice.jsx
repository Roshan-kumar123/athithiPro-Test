import { createSlice } from "@reduxjs/toolkit";
import { fetchSubAdmins, createSubAdmin, updateSubAdmin, fetchSubAdminById, softDeleteSubAdmin } from "./subAdminThunk";

export const SubAdminRole = {
  ADMIN: "ADMIN",
  SUB_ADMIN: "SUB_ADMIN",
  EMPLOYER: "EMPLOYER",
  LABOUR: "LABOUR"
};

const initialState = {
  subAdmins: [],
  loading: false,
  error: null,
  currentSubAdmin: null,
  pagination: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

const subAdminSlice = createSlice({
  name: "subAdmins",
  initialState,
  reducers: {
    clearSubAdminErrors: (state) => {
      state.error = null;
    },
    setCurrentSubAdmin: (state, action) => {
      state.currentSubAdmin = action.payload;
    },
    clearCurrentSubAdmin: (state) => {
      state.currentSubAdmin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch SubAdmins
      .addCase(fetchSubAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubAdmins.fulfilled, (state, action) => {
        state.loading = false;
        // Update based on the actual response format
        state.subAdmins = action.payload.data || [];
      })
      .addCase(fetchSubAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sub-admins";
      })
      
      // Create SubAdmin
      .addCase(createSubAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Will be updated through fetchSubAdmins
      })
      .addCase(createSubAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create sub-admin";
      })
      
      // Update SubAdmin
      .addCase(updateSubAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Adjust for the actual response format
        const updatedSubAdmin = action.payload.data; // May need adjustment based on update response
        if (updatedSubAdmin) {
          const index = state.subAdmins.findIndex(admin => admin._id === updatedSubAdmin._id);
          if (index !== -1) {
            state.subAdmins[index] = updatedSubAdmin;
          }
          // Also update currentSubAdmin if it's the same sub-admin
          if (state.currentSubAdmin && state.currentSubAdmin._id === updatedSubAdmin._id) {
            state.currentSubAdmin = updatedSubAdmin;
          }
        }
      })
      .addCase(updateSubAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update sub-admin";
      })
      
      // Fetch SubAdmin By ID
      .addCase(fetchSubAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubAdminById.fulfilled, (state, action) => {
        state.loading = false;
        // If your API returns the data directly (not wrapped in a data property)
        state.currentSubAdmin = action.payload.data || action.payload;
      })
      .addCase(fetchSubAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sub-admin details";
      })
      
      // Soft Delete SubAdmin
      .addCase(softDeleteSubAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteSubAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Will be refreshed by the fetchSubAdmins call in the thunk
      })
      .addCase(softDeleteSubAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete sub-admin";
      })
  }
});

export const { clearSubAdminErrors, setCurrentSubAdmin, clearCurrentSubAdmin } = subAdminSlice.actions;
export default subAdminSlice.reducer;
