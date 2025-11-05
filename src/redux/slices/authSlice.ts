import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeAuthCookies } from "@/lib/cookies";

interface UserDetails {
  id?: string;
  email?: string;
  username?: string;
  sessionId?: string;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  isLogin: boolean;
  userDetails: UserDetails | null;
  token: string | null;
}

const initialState: AuthState = {
  isLogin: false,
  userDetails: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.userDetails = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.userDetails = null;
      state.token = null;
      // Remove auth cookies on logout
      removeAuthCookies();
    },
    hydrateFromCookies: (state, action: PayloadAction<AuthState>) => {
      state.isLogin = action.payload.isLogin;
      state.userDetails = action.payload.userDetails;
      state.token = action.payload.token;
    },
  },
});

export const {
  setLogin,
  setUserDetails,
  setToken,
  logout,
  hydrateFromCookies,
} = authSlice.actions;
export default authSlice.reducer;
