const STORAGE_KEY = "movieDiary:favs";

export function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavs(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function addToFavs(movie) {
  const favs = loadFavs();
  const exists = favs.some((m) => m.id === movie.id);
  if (exists) return { ok: false, reason: "already-exists" };

  favs.push({ ...movie, note: "" });
  saveFavs(favs);
  return { ok: true };
}

export function removeFromFavs(movieId) {
  const favs = loadFavs().filter((m) => m.id !== movieId);
  saveFavs(favs);
}

export function updateNote(movieId, note) {
  const favs = loadFavs();
  const idx = favs.findIndex((m) => m.id === movieId);
  if (idx === -1) return;
  favs[idx].note = note;
  saveFavs(favs);
}
