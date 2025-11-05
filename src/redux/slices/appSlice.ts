import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axiosInstance";

interface AccessGroup {
  _id: string | number | any;
  [key: string]: any;
}
interface Action {
  _id: string;
  action: string;
}
interface Permission {
  feature: string;
  actions: Action[];
}
interface AppState {
  permissions: Permission[];
  fetchedPermissions: boolean;
  accessGroups: AccessGroup[];
  accessGroupTotalRecords: number;
  fetchedAccessGroups: boolean;
  loggedInUserDetails?: any;
  fetchedLoggedInUserDetails: boolean;
}

// Initial State
const initialState: AppState = {
  permissions: [],
  fetchedPermissions: false,
  accessGroups: [],
  accessGroupTotalRecords: 0,
  fetchedAccessGroups: false,
  loggedInUserDetails: null,
  fetchedLoggedInUserDetails: false,
};

// Async Thunks
export const fetchLoggedInUserDetails = createAsyncThunk(
  "app/fetchLoggedInUserDetails",
  async () => {
    const response = await axios.get("user-detail");
    return response.data?.Response;
  }
);

export const fetchPermissions = createAsyncThunk(
  "app/fetchPermissions",
  async () => {
    const response = await axios.get("permissions");
    return response.data?.Response?.Permissions;
  }
);

export const fetchAccessGroups = createAsyncThunk(
  "app/fetchAccessGroups",
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await axios.get("access-groups", {
      params: { page: 1, limit: 10, ...params },
    });
    return response.data?.Response;
  }
);

// Slice
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Permissions
    setLoggedInUserDetails(state, action: PayloadAction<any>) {
      state.loggedInUserDetails = action.payload;
    },
    updateLoggedInUserDetails(state, action: PayloadAction<any>) {
      state.loggedInUserDetails = action.payload;
    },

    // Permissions
    setPermissions(state, action: PayloadAction<Permission[]>) {
      state.permissions = action.payload;
    },

    // Access Groups
    setAccessGroups(
      state,
      action: PayloadAction<{ accessGroups: AccessGroup[]; total: number }>
    ) {
      state.accessGroups = action.payload.accessGroups;
      state.accessGroupTotalRecords = action.payload.total;
    },
    setAccessGroupTotalRecords(state, action: PayloadAction<number>) {
      state.accessGroupTotalRecords = action.payload;
    },
    addAccessGroup(state, action: PayloadAction<AccessGroup>) {
      state.accessGroups.unshift(action.payload);
      state.accessGroupTotalRecords += 1;
    },
    updateAccessGroup(state, action: PayloadAction<AccessGroup>) {
      const index = state.accessGroups.findIndex(
        (g) => g._id === action.payload._id
      );
      if (index !== -1) {
        state.accessGroups[index] = action.payload;
      }
    },
    deleteAccessGroup(state, action: PayloadAction<string | number>) {
      state.accessGroups = state.accessGroups.filter(
        (g) => g._id !== action.payload
      );
      state.accessGroupTotalRecords -= 1;
    },
    setMoreAccessGroups(
      state,
      action: PayloadAction<{ accessGroups: AccessGroup[]; total: number }>
    ) {
      const { accessGroups, total } = action.payload;

      // Filter out duplicates
      const newGroups = accessGroups.filter(
        (newGroup) =>
          !state.accessGroups.some((group) => group._id === newGroup._id)
      );

      state.accessGroups = [...state.accessGroups, ...newGroups];
      state.accessGroupTotalRecords = total;
    },
    updateAccessGroupDepartments(
      state,
      action: PayloadAction<{
        _id: string;
        department: string;
        actionType: "add" | "remove";
      }>
    ) {
      const { _id, department, actionType } = action.payload;
      const index = state.accessGroups.findIndex(
        (group: any) => group._id === _id
      );

      if (index !== -1) {
        const currentGroup = state.accessGroups[index];
        const currentDepartments = currentGroup.departments || [];

        let updatedDepartments = [...currentDepartments];

        if (actionType === "add" && !updatedDepartments.includes(department)) {
          updatedDepartments.push(department);
        }

        if (actionType === "remove") {
          updatedDepartments = updatedDepartments.filter(
            (d) => d !== department
          );
        }

        state.accessGroups[index] = {
          ...currentGroup,
          departments: updatedDepartments,
        };
      }
    },

    logoutInAppSlice(state) {
      state.loggedInUserDetails = null;
      state.fetchedPermissions = false;
      state.fetchedLoggedInUserDetails = false;
      state.fetchedAccessGroups = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserDetails.fulfilled, (state, action) => {
        state.loggedInUserDetails = action.payload;
        state.fetchedLoggedInUserDetails = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
        state.fetchedPermissions = true;
      })
      .addCase(fetchAccessGroups.fulfilled, (state, action) => {
        state.accessGroups = action.payload?.AccessGroups || [];
        state.accessGroupTotalRecords = action.payload?.totalRecords || 0;
        state.fetchedAccessGroups = true;
      });
  },
});

// Exports
export const {
  setPermissions,
  setAccessGroups,
  setAccessGroupTotalRecords,
  addAccessGroup,
  updateAccessGroup,
  deleteAccessGroup,
  setMoreAccessGroups,
  updateAccessGroupDepartments,
  setLoggedInUserDetails,
  updateLoggedInUserDetails,
  logoutInAppSlice,
} = appSlice.actions;

export default appSlice.reducer;
