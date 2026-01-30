const API_KEY = "d41e4d1d0fcf8be7d58125da71c430b9";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

export function posterUrl(path) {
  return path ? `${IMG}${path}` : "";
}

async function request(path, { signal } = {}) {
  //const res = await fetch(`${BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${API_KEY}`);
  const res = await fetch(`${BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${API_KEY}`, { signal });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export function fetchPopular() {
  return request("/movie/popular?language=en-US&page=1");
}

export function fetchNowPlaying() {
  return request("/movie/now_playing?language=en-US&page=1");
}

export function fetchTrending() {
  return request("/trending/movie/week?language=en-US");
}

export function searchMovies(query,{ signal } = {}) {
  const q = encodeURIComponent(query);
  return request(`/search/movie?language=en-US&query=${q}&page=1&include_adult=false`,signal);
}
