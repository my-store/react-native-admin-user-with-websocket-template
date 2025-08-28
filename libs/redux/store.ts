import { configureStore /*, ThunkAction, Action*/ } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/login.slice";
import RootReducer from "./reducers/root.slice";

export const store = configureStore({
  reducer: {
    login: LoginReducer,
    root: RootReducer,
  },
});

export interface ActionInterface {
  payload: any;
  type: string;
}

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof ReduxStore.dispatch;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
