// ============================================================
// 2️⃣ NGRX ENTERPRISE STATE MANAGEMENT
// ============================================================

// 📁 app/store/radio.actions.ts
import { createAction, props } from '@ngrx/store';

export const play = createAction('[Radio] Play');
export const pause = createAction('[Radio] Pause');
export const radioOn = createAction('[Radio] On');
export const radioOff = createAction('[Radio] Off');
export const duration = createAction('[Radio] Duration', props<{duration: number}>);
export const currentTime = createAction('[Radio] Current Time', props<{currentTime: number}>);
export const setVolume = createAction(
  '[Radio] Set Volume',
  props<{ volume: number }>()
);
export const updateNowPlaying = createAction(
  '[Radio] Update Now Playing',
  props<{ payload: any }>()
);
export const toggleRepeat = createAction('[Radio] Repeat Toggle', props<{repeat: boolean}>);
export const toggleVolume = createAction('[Radio] Toggle Volume', props<{mute: boolean}>);

