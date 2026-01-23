const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDFlNGQxZDBmY2Y4YmU3ZDU4MTI1ZGE3MWM0MzBiOSIsIm5iZiI6MTc2ODkwNDY1Ny4wODcwMDAxLCJzdWIiOiI2OTZmNTdkMTAzOGNkNjY1ZDNmZTEwZjAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.wpwcEaMa71ohbIMI5fdgenznKC0tsHSAnq-wu6GJ1Dw";
const BASE = "https://api.themoviedb.org/3";

const maxSearch = 50;

async function searchMovie(query, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = new URL(`${BASE}/search/movie`);
    url.searchParams.set("query", query);
    url.searchParams.set("language", "en-GB");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();

  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Search stopped (Timeout)");
    }
    throw err;

  } finally {
    clearTimeout(timer);
  }
}


const IMG_BASE = "https://image.tmdb.org/t/p/w500";

function createMovieCard(movie) {
  const article = document.createElement("article");
  article.className =
    "w-full max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm";

  /* Poster wrapper */
  const posterWrap = document.createElement("div");
  posterWrap.className = "relative aspect-[2/3] bg-black/5";

  if (movie.poster_path) {
    const img = document.createElement("img");
    img.src = IMG_BASE + movie.poster_path;
    img.alt = `${movie.title} Poster`;
    img.loading = "lazy";
    img.className = "h-full w-full object-cover";
    posterWrap.appendChild(img);
  }


  /* Rating */
  const rating = document.createElement("div");
  rating.className = "absolute bottom-3 left-3";

  const ratingPill = document.createElement("span");
  ratingPill.className =
    "inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-black backdrop-blur";

  ratingPill.textContent =
    `★ ${movie.vote_average.toFixed(1)} (${movie.vote_count})`;

  rating.appendChild(ratingPill);
  posterWrap.appendChild(rating);

  /* Content */
  const content = document.createElement("div");
  content.className = "space-y-3 p-5";

  const title = document.createElement("h3");
  title.className = "text-lg font-semibold leading-snug text-black";
  title.textContent = movie.title;

  const meta = document.createElement("p");
  meta.className = "text-sm text-black/60";
  meta.textContent =
    `${movie.release_date?.slice(0, 4) ?? "—"} • ${movie.original_language}`;

  const overview = document.createElement("p");
  overview.className =
    "line-clamp-4 text-sm leading-relaxed text-black/70";
  overview.textContent =
    movie.overview || "Keine Beschreibung vorhanden.";

  const btn = document.createElement("button");
  btn.className =
    "mt-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 active:scale-95";
  btn.textContent = "Details";
  btn.dataset.id = movie.id;

  content.append(title, meta, overview, btn);

  article.append(posterWrap, content);
  return article;
}


document.getElementById("btn").onclick = async () => {
  await doRealSearch();
};

async function doRealSearch() {
  const q = document.getElementById("q").value;
  const data = await searchMovie(q,5000);
  //document.getElementById("out").textContent =
  //  JSON.stringify(data.results.slice(0, 50), null, 2);

  const cards=document.getElementById("cards");
  cards.innerHTML=""
  data.results.slice(0,50).forEach(movie => {
    const c=createMovieCard(movie);
    cards.appendChild(c);
  });
}

async function fetchMovieDetails(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-GB&append_to_response=videos,credits`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

function showDetails(movie) {
  alert(
    `${movie.title}\n\n` +
    `Running time: ${movie.runtime} min\n` +
    `Director: ${movie.credits.crew.find(c => c.job === "Director")?.name}` +
    movie.overview
  );
}

const modal = document.getElementById("modal");
const titleEl = document.getElementById("modal-title");
const bodyEl  = document.getElementById("modal-body");
const closeBtn = document.getElementById("modal-close");

function showModal(movie) {
  titleEl.textContent = movie.title;
  bodyEl.textContent =
    `Laufzeit: ${movie.runtime} min\n` +
    `Bewertung: ${movie.vote_average}` +
    movie.overview;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function hideModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

closeBtn.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) hideModal(); // Klick auf Overlay
});

document.getElementById("cards").addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;

  const movie = await fetchMovieDetails(btn.dataset.id);
  showModal(movie);
});


function movieDetailsToFavorite(movie) {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    original_language: movie.original_language,
    poster_path: movie.poster_path,
    vote_average: Number(movie.vote_average.toFixed(1)),
    vote_count: movie.vote_count,
    overview: movie.overview,
    runtime: movie.runtime,
    director: movie.credits?.crew
      ?.find(c => c.job === "Director")
      ?.name ?? "—",

  };
}


let favorites=[];

function addFavorite(movie) {
    const fav = movieDetailsToFavorite(movie);
    if (favorites.some((f) => f.id === fav.id)) return;
    favorites.push(fav);
}

function removeFavorite(id) {
    const i = favorites.findIndex((f) => f.id === Number(id));
    if (i === -1) return;
    favorites.splice(i, 1);
}

// -----------------------------------------------

const input = document.getElementById("q");
const suggest = document.getElementById("suggest");
const IMG_BASE_SMALL = "https://image.tmdb.org/t/p/w92";

let timer = null;
let controller = null;

input.addEventListener("input", () => {
  const q = input.value.trim();


  // laufenden Suggest-Request abbrechen
  if (controller) {
    controller.abort();
    controller = null;
  }


  // UI sofort leeren/ausblenden wenn zu kurz
  if (q.length < 2) {
    clearTimeout(timer);
    hideSuggest();
    return;
  }

  //cards.innerHTML = "";
  const cards=document.getElementById("cards");
  cards.innerHTML=""
  clearTimeout(timer);
  timer = setTimeout(() => {
    runSuggest(q);
  }, 1000);
});


input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    doRealSearch();
  }
});

async function runSuggest(q) {
  // alten Request abbrechen
  if (controller) controller.abort();
  controller = new AbortController();

  try {
    const data = await searchMovie2(q, { signal: controller.signal }); // deine TMDB search
    showSuggest(data.results.slice(0, 6));
  } catch (err) {
    if (err.name === "AbortError") return;
    hideSuggest();
    console.error(err);
  }
}

function showSuggest(movies) {
  suggest.innerHTML = "";

  for (const m of movies) {
    const item = document.createElement("button");
    item.type = "button";
    item.className =
      "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-black/5";
    item.dataset.id = m.id;

    // Poster
    if (m.poster_path) {
      const img = document.createElement("img");
      img.src = IMG_BASE_SMALL + m.poster_path;
      img.alt = "";
      img.className = "h-14 w-10 rounded object-cover bg-black/10";
      img.loading = "lazy";
      item.appendChild(img);
    }

    // Textblock
    const textWrap = document.createElement("div");

    const title = document.createElement("div");
    title.className = "text-sm font-medium";
    title.textContent = m.title;

    const meta = document.createElement("div");
    meta.className = "text-xs text-black/60";
    meta.textContent = m.release_date
      ? m.release_date.slice(0, 4)
      : "—";

    textWrap.append(title, meta);
    item.appendChild(textWrap);

    item.addEventListener("click", () => {
      input.value = m.title;
      hideSuggest();
      // optional: sofortige Suche oder Details öffnen
      doRealSearch();
    });

    suggest.appendChild(item);
  }

  suggest.classList.remove("hidden");
}

function hideSuggest() {
  suggest.classList.add("hidden");
  suggest.innerHTML = "";
}

// Optional: Klick außerhalb schließt Dropdown
document.addEventListener("click", (e) => {
  if (e.target === input) return;
  if (suggest.contains(e.target)) return;
  hideSuggest();
});

async function searchMovie2(query, { signal } = {}) {
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("query", query);
  url.searchParams.set("language", "de-DE");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      Accept: "application/json",
    },
    signal,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}