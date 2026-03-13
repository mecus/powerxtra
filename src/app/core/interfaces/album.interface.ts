// import { ITrack } from "./track.interface";

export interface IAlbum {
  name: string,
  artist: string;
  artwork: string;
  release_date: Date;
  release_year: string;
  track_counts: number;
  duration: number;
  photos: string;
  createdBy: string;
  dateCreated: Date;
  status: string;
  active: boolean;
  genre: string; // Afrobeat
  tags: string;
  category: string; // internation | local
  tracks: any
}
