import { parseBlob } from 'music-metadata';
import * as mm from 'music-metadata-browser';

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string[];
  duration?: number;
  thumbnail?: string;
  artwork?: string;
}

export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  const metadata = await parseBlob(file);

  let artwork: string = '';

  if (metadata.common.picture?.length) {
    const pic = metadata.common.picture[0];
    const base64 = btoa(
      new Uint8Array(pic.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    artwork = `data:${pic.format};base64,${base64}`;
  }

  return {
    title: metadata.common.title,
    artist: metadata.common.artist,
    album: metadata.common.album,
    year: metadata.common.year,
    genre: metadata.common.genre,
    duration: metadata.format.duration,
    artwork
  };
}


// export interface AudioMetadata {
//   title?: string;
//   artist?: string;
//   album?: string;
//   duration?: number;
//   thumbnail?: string; // Base64 Image string
// }

export async function getAudioMetadataFromUrl(url: string): Promise<AudioMetadata> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch audio file');

    // Use parseReadableStream instead of parseWebStream
    const metadata = await mm.parseReadableStream(response.body!, {
      mimeType: response.headers.get('Content-Type') || 'audio/mpeg',
      size: Number(response.headers.get('Content-Length'))
    });

    const { common, format } = metadata;
    let artwork = '';

    if (common.picture && common.picture.length > 0) {
      const pic: any = common.picture[0];
      console.log(pic)
      const blob = new Blob([pic.data], { type: pic.format });
      artwork = URL.createObjectURL(blob);
    }

    return {
      title: common.title,
      artist: common.artist,
      album: common.album,
      duration: format.duration,
      artwork
    };
  } catch (error) {
    console.error('Metadata extraction failed:', error);
    throw error;
  }
}

// async function getAudioMetadataFromUrl(url: string): Promise<AudioMetadata> {
//   try {
//     // 1. Fetch the file as a stream/blob
//     const response = await fetch(url);
//     if (!response.ok) throw new Error('Failed to fetch audio file');

//     // 2. Parse the metadata from the web stream
//     const metadata = await mm.parseWebStream(response.body!, {
//       mimeType: response.headers.get('Content-Type') || 'audio/mpeg',
//       size: Number(response.headers.get('Content-Length'))
//     });

//     const { common, format } = metadata;
//     let thumbnailBase64 = '';

//     // 3. Extract and convert the thumbnail if it exists
//     if (common.picture && common.picture.length > 0) {
//       const pic = common.picture[0];
//       const base64 = btoa(
//         pic.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
//       );
//       thumbnailBase64 = `data:${pic.format};base64,${base64}`;
//     }

//     return {
//       title: common.title,
//       artist: common.artist,
//       album: common.album,
//       duration: format.duration,
//       thumbnail: thumbnailBase64
//     };
//   } catch (error) {
//     console.error('Error extracting metadata:', error);
//     throw error;
//   }
// }
