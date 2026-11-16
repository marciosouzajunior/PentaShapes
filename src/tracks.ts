/** Public catalog: English is the default language for contributions. */
export { englishTracks as tracks, portugueseTracks, allRouteTracks as routeTracks, archivedTracks } from './track-locales';
import { englishTracks } from './track-locales';
export const purpleTrack=englishTracks.find(track=>track.manifest.musicalWork?.title==='Purple Haze')!;
