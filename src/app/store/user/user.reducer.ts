
// 📁 app/store/radio.actions.ts
import { createAction, props } from '@ngrx/store';
import { createReducer, on } from '@ngrx/store';

interface IUser {
  authTime: string;
  expirationTime: number;
  token: string;
  email: string;
  displayName: string;
  accountType: string;
  uid: string;
}

export const INIT_USER = createAction('[USER] Init User', props<{user: IUser}>());
export const LOGOUT_USER = createAction('[USER] Sign Off');

const InitailState: IUser = {
  authTime: "",
  expirationTime: 0,
  token: "",
  email: "",
  displayName: "",
  accountType: "",
  uid: "",
}

export const userReducer = createReducer(
  InitailState,
  on(INIT_USER, (state, payload: any ) => (payload.user)),
  on(LOGOUT_USER, (state, payload) => ({...InitailState}))
);
