import { posterUrl } from "./tmdb.js";

export function movieCard(movie, { onFavClick, favLabel = "Add to favourites" } = {}) {
  const li = document.createElement("li");
  li.className =
    "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col";

  const img = document.createElement("img");
  img.className = "w-full h-64 object-cover bg-slate-100";
  img.alt = movie.title || "Movie poster";
  img.src = posterUrl(movie.poster_path) || "";
  li.appendChild(img);

  const body = document.createElement("div");
  body.className = "p-4 flex flex-col gap-2";

  const title = document.createElement("h3");
  title.className = "text-lg font-semibold";
  title.textContent = movie.title || "Untitled";
  body.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "text-sm text-slate-600";
  meta.textContent = `Release: ${movie.release_date || "N/A"} • Rating: ${movie.vote_average ?? "N/A"}`;
  body.appendChild(meta);

  const overview = document.createElement("p");
  overview.className = "text-sm text-slate-700 line-clamp-3";
  overview.textContent = movie.overview || "No overview available.";
  body.appendChild(overview);

  if (onFavClick) {
    const btn = document.createElement("button");
    btn.className =
      "mt-2 w-full rounded-lg bg-slate-900 text-white py-2 text-sm hover:bg-slate-800";
    btn.textContent = favLabel;
    btn.addEventListener("click", () => onFavClick(movie));
    body.appendChild(btn);
  }

  li.appendChild(body);
  return li;
}
