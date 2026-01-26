import { posterUrl } from "./tmdb.js";
import { loadFavs } from "./storage.js";

function isInFavourites(movieId) {
  const favs = loadFavs();
  return favs.some((m) => m.id === movieId);
}

export function movieCard(movie, { onFavClick, favLabel = "Add to favourites" } = {}) {
  const li = document.createElement("li");
  li.className =
    "rounded-xl border-2 border-navy bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow";

  const img = document.createElement("img");
  img.className = "w-full h-64 object-cover bg-teal/10";
  img.alt = movie.title || "Movie poster";
  img.src = posterUrl(movie.poster_path) || "";
  li.appendChild(img);

  const body = document.createElement("div");
  body.className = "p-4 flex flex-col gap-2";

  const title = document.createElement("h3");
  title.className = "text-lg font-semibold text-navy";
  title.textContent = movie.title || "Untitled";
  body.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "text-sm text-navy/70";
  meta.textContent = `Release: ${movie.release_date || "N/A"} • Rating: ${movie.vote_average ?? "N/A"}`;
  body.appendChild(meta);

  const overview = document.createElement("p");
  overview.className = "text-sm text-navy/80 line-clamp-3";
  overview.textContent = movie.overview || "No overview available.";
  body.appendChild(overview);

  if (onFavClick) {
    const btn = document.createElement("button");
    const alreadyAdded = isInFavourites(movie.id);
    
    if (alreadyAdded) {
      btn.className = "mt-2 w-full rounded-lg bg-navy/50 text-white py-2 text-sm cursor-default";
      btn.textContent = "Added";
      btn.disabled = true;
    } else {
      btn.className = "mt-2 w-full rounded-lg bg-teal text-white py-2 text-sm hover:bg-navy transition-colors";
      btn.textContent = favLabel;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const result = onFavClick(movie);
        if (result && result.ok) {
          btn.textContent = "Added";
          btn.className = "mt-2 w-full rounded-lg bg-navy/50 text-white py-2 text-sm cursor-default";
          btn.disabled = true;
        }
      });
    }
    body.appendChild(btn);
  }

  li.appendChild(body);
  return li;
}

export function heroCarouselItem(movie, { onFavClick } = {}) {
  const div = document.createElement("div");
  div.className = "carousel-item flex-shrink-0 w-full rounded-xl overflow-hidden bg-white shadow-md flex";

  // Poster on the left
  const imgContainer = document.createElement("div");
  imgContainer.className = "flex-shrink-0 w-40";
  
  const img = document.createElement("img");
  img.src = posterUrl(movie.poster_path) || "";
  img.alt = movie.title || "Movie poster";
  img.className = "w-full h-full object-cover rounded-l-xl";
  imgContainer.appendChild(img);
  div.appendChild(imgContainer);

  // Content on the right
  const body = document.createElement("div");
  body.className = "p-5 flex flex-col justify-center";

  const title = document.createElement("h3");
  title.className = "text-xl font-bold text-navy mb-1";
  title.textContent = movie.title || "Untitled";
  body.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "text-sm text-navy/70 mb-2";
  meta.textContent = `⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}`;
  body.appendChild(meta);

  const overview = document.createElement("p");
  overview.className = "text-sm text-navy/70 line-clamp-3 mb-4";
  overview.textContent = movie.overview || "No overview available.";
  body.appendChild(overview);

  if (onFavClick) {
    const btn = document.createElement("button");
    const alreadyAdded = isInFavourites(movie.id);
    
    if (alreadyAdded) {
      btn.className = "w-fit rounded-lg bg-navy/50 text-white px-4 py-2 text-sm cursor-default";
      btn.textContent = "Added";
      btn.disabled = true;
    } else {
      btn.className = "w-fit rounded-lg bg-teal text-white px-4 py-2 text-sm hover:bg-navy transition-colors";
      btn.textContent = "Add to favourites";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const result = onFavClick(movie);
        if (result && result.ok) {
          btn.textContent = "Added";
          btn.className = "w-fit rounded-lg bg-navy/50 text-white px-4 py-2 text-sm cursor-default";
          btn.disabled = true;
        }
      });
    }
    body.appendChild(btn);
  }

  div.appendChild(body);
  return div;
}
