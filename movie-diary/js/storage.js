// key to store data in localstorage
const STORAGE_KEY = "movieDiary:favs";

// function to load favourites from localstorage
export function loadFavs() {
  try {
    // get data from localstorage using the key
    const stored = localStorage.getItem(STORAGE_KEY);
    // convert the string back into array
    return JSON.parse(stored) || [];
  } catch {
    // return empty list, if no json
    return [];
  }
}

// saving favourites to localstorage
export function saveFavs(favs) {
// convert array into string before saving
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

// add one movie to favourites
export function addToFavs(movie) {
  // load existing favourites
  const favs = loadFavs();

  // check if movie already exists (same id)
  const exists = favs.some((m) => m.id === movie.id);

  // stop here, if movie already exists
  if (exists) return { ok: false, reason: "already-exists" };

  favs.push({ ...movie, note: "" });

  // save updated list
  saveFavs(favs);

  return { ok: true };
}

// remove a movie from favourites
export function removeFromFavs(movieId) {
  // load favourites and keep everything except the movieId
  const favs = loadFavs().filter((m) => m.id !== movieId);

  saveFavs(favs);
}

// update the note for a movie
export function updateNote(movieId, note) {
  // load favourites
  const favs = loadFavs();

  // find index of movie
  const idx = favs.findIndex((m) => m.id === movieId);

  // stop, if movie not found
  if (idx === -1) return;

  // update note
  favs[idx].note = note;

  saveFavs(favs);
}
