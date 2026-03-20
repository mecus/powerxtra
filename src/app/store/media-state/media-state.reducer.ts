import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';


const updateMediaSate = createAction('[MEDIA] Update Media State', props<{
  media: 'live' | 'autoDJ' | 'ondemand'
}>());

const initState = {
  media: 'autoDJ'
}


export const mediaReducer = createReducer(
  initState,
  on(updateMediaSate, (state, { media }) => ({
    ...state, media
  }))
)
