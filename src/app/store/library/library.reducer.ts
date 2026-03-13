
import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';
import { ITrack } from '../../core/interfaces';

export const loadLibrary = createAction('[ Library ] Load',
  props<{
    tracks: ITrack[]
  }>()
);
const trackState = {
  tracks: []
}

const InitalLoad: ITrack  = {
    active: true,
    artist: "Wizkid",
    album:"Welcome to lagos",
    artwork: "https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FEssence%20.jpg?alt=media&token=85021ed2-1d89-400c-96d8-207c843eaa0d",
    bitrate: 209,
    category: "internation",
    duration: 249.080756,
    file: "https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/tracks%2F1773101324112_Wizkid-Essence-ft-Tems.mp3?alt=media&token=2e28e75d-5f36-4ae2-9f58-1ec1d764f616",
    genre: "Afrobeats",
    other_artist: "none",
    release_year: "2020",
    size: 10099689,
    status: "active",
    tags: "Afrobeats, afrobeats",
    title: "Essence",
    upload_date: new Date(),
    uploadedBy:"PowerX"
}

export const libraryReducer = createReducer(trackState,
  on(loadLibrary, (state: any, { tracks } ) => ({
    ...state,
    tracks: [ ...tracks]
  }))
)
