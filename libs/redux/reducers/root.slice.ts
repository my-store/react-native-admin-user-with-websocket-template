import { createSlice } from "@reduxjs/toolkit";
import { ActionInterface } from "../store";

interface DefaultRootStateInterface {
  isReady: boolean;
  isConnected: boolean;
}

const DefaultRootState: DefaultRootStateInterface = {
  isReady: false,
  isConnected: false,
};

function SetIsReadyHandler(
  state: DefaultRootStateInterface,
  action: ActionInterface
) {
  state.isReady = action.payload;
}

function SetIsConnectedHandler(
  state: DefaultRootStateInterface,
  action: ActionInterface
) {
  state.isConnected = action.payload;
}

const RootSlice = createSlice({
  name: "root",
  initialState: DefaultRootState,
  reducers: {
    setRootIsReady: SetIsReadyHandler,
    setRootIsConnected: SetIsConnectedHandler,
  },
});

export const { setRootIsReady, setRootIsConnected } = RootSlice.actions;
export default RootSlice.reducer;
