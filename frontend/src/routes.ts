// frontend/src/routes.ts
import LandingPage from './LandingPage.svelte';
import LocationPage from './LocationPage.svelte';
import Playlist from './Playlist.svelte';
import SpotifyTest from './SpotifyTest.svelte';

export default {
  '/': LandingPage,
  '/location': LocationPage,
  '/playlist': Playlist,
  '/spotify': SpotifyTest,
};
