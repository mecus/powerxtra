
// 📁 app/store/radio.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as RadioActions from './radio.actions';

export interface RadioState {
  playing: boolean;
  volume: number;
  nowPlaying: any;
  duration: number | any;
  currentTime: number | any;
}

export const initialState: RadioState = {
  playing: false,
  volume: 0.8,
  nowPlaying: {
    artwork: "https://radioafricana.com/wp-content/uploads/2025/05/HSOTW-1536x1536.jpg"
  },
  duration: 0,
  currentTime: 0
};

export const radioReducer = createReducer(
  initialState,
  on(RadioActions.play, state => ({ ...state, playing: true })),
  on(RadioActions.radioOn, state => ({ ...state, live: true })),
  on(RadioActions.radioOff, state => ({ ...state, live: false })),
  on(RadioActions.duration, (state, payload : any) => ({
    ...state, duration: payload.duration
   })),
  on(RadioActions.currentTime, (state, payload: any ) => ({
    ...state, currentTime: payload.currentTime
   })),
  on(RadioActions.pause, state => ({ ...state, playing: false })),
  on(RadioActions.setVolume, (state, { volume }) => ({ ...state, volume })),
  on(RadioActions.updateNowPlaying, (state, { payload }) => ({
    ...state,
    nowPlaying: payload
  })),
  on(RadioActions.toggleRepeat, (state, payload: any) => ({ ...state, repeat: payload.repeat })),
  on(RadioActions.toggleVolume, (state, payload: any) => ({ ...state, mute: payload.mute })),
);
