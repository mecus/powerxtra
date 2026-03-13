
// 📁 app/store/radio.actions.ts
import { createAction, props } from '@ngrx/store';
import { createReducer, on } from '@ngrx/store';

interface IUser {
  authTime: string;
  expirationTime: number;
  token: string;
  email: string;
  displayName: string;
  accountTyle: string;
  uid: string;
}

export const INIT_USER = createAction('[USER] Init User', props<{user: IUser}>);

const InitailState: IUser = {
  authTime: "",
  expirationTime: 0,
  token: "",
  email: "",
  displayName: "",
  accountTyle: "",
  uid: "",
}

export const userReducer = createReducer(
  InitailState,
  on(INIT_USER, (state, payload: any ) => (payload.user))
);
