import { createSlice } from "@reduxjs/toolkit";
import { ActionInterface } from "../store";

interface PrepareLoginDataInterface {
  tlp: string;
  pass: string;
}

interface DefaulState {
  isReady: boolean;
  isLogin: boolean;
  loginRole: string;
  loginWait: boolean;
  prepareLoginData: PrepareLoginDataInterface;
}

const DefaultLoginState: DefaulState = {
  isReady: false,
  isLogin: false,
  loginRole: "",
  loginWait: false,
  prepareLoginData: {
    tlp: "",
    pass: "",
  },
};

function SetLoginReady(state: DefaulState, action: ActionInterface) {
  state.isReady = action.payload;
}

function Login(state: DefaulState, action: ActionInterface) {
  state.isLogin = true;
  state.loginRole = action.payload;
}

function Logout(state: DefaulState) {
  state.isLogin = false;
  state.loginRole = "";
}

function SetLoginWaitHandler(state: DefaulState, action: ActionInterface) {
  state.loginWait = action.payload;
}

function SetLoginTlpHandler(state: DefaulState, action: ActionInterface) {
  state.prepareLoginData.tlp = action.payload;
}

function SetLoginPassHandler(state: DefaulState, action: ActionInterface) {
  state.prepareLoginData.pass = action.payload;
}

const LoginSlice = createSlice({
  name: "login",
  initialState: DefaultLoginState,
  reducers: {
    login: Login,
    logout: Logout,
    setLoginWait: SetLoginWaitHandler,
    setLoginReady: SetLoginReady,
    setLoginTlp: SetLoginTlpHandler,
    setLoginPass: SetLoginPassHandler,
  },
});

export const {
  login,
  logout,
  setLoginWait,
  setLoginReady,
  setLoginTlp,
  setLoginPass,
} = LoginSlice.actions;
export default LoginSlice.reducer;
