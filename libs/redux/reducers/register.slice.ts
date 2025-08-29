import { createSlice } from "@reduxjs/toolkit";
import { ActionInterface } from "../store";

interface DefaulStateInterface {
  registerWait: boolean;
  nama: string;
  tlp: string;
  foto: any;
  password: string;
}

const DefaultState: DefaulStateInterface = {
  registerWait: false,
  nama: "",
  tlp: "",
  foto: null,
  password: "",
};

function WaitHandler(state: DefaulStateInterface, action: ActionInterface) {
  state.registerWait = action.payload;
}

function NamaHandler(state: DefaulStateInterface, action: ActionInterface) {
  state.nama = action.payload;
}

function TlpHandler(state: DefaulStateInterface, action: ActionInterface) {
  state.tlp = action.payload;
}

function PasswordHandler(state: DefaulStateInterface, action: ActionInterface) {
  state.password = action.payload;
}

function FotoHandler(state: DefaulStateInterface, action: ActionInterface) {
  state.foto = action.payload;
}

const RegisterSlice = createSlice({
  name: "register",
  initialState: DefaultState,
  reducers: {
    setRegisterWait: WaitHandler,
    setRegisterNama: NamaHandler,
    setRegisterTlp: TlpHandler,
    setRegisterPassword: PasswordHandler,
    setRegisterFoto: FotoHandler,
  },
});

export const {
  setRegisterWait,
  setRegisterNama,
  setRegisterTlp,
  setRegisterPassword,
  setRegisterFoto,
} = RegisterSlice.actions;
export default RegisterSlice.reducer;
