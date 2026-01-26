// import helper to build poster image URLs
import { posterUrl } from "./tmdb.js";

// one movie card (li element)
export function movieCard(
  movie,
  { onFavClick, favLabel = "Add to favourites" } = {}
) {
  const li = document.createElement("li");

  // add tailwind styles
  li.className =
    "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col";

  // create image element
  const img = document.createElement("img");
  img.className = "w-full h-64 object-cover bg-slate-100";
  img.alt = movie.title || "Movie poster";
  img.src = posterUrl(movie.poster_path) || "";

  // Add image to card
  li.appendChild(img);

  // Create body container
  const body = document.createElement("div");
  body.className = "p-4 flex flex-col gap-2";

  // Create title
  const title = document.createElement("h3");
  title.className = "text-lg font-semibold";
  title.textContent = movie.title || "Untitled";
  body.appendChild(title);

  // Create meta info (release + rating)
  const meta = document.createElement("p");
  meta.className = "text-sm text-slate-600";
  meta.textContent = `Release: ${movie.release_date || "N/A"} • Rating: ${
    movie.vote_average ?? "N/A"
  }`;
  body.appendChild(meta);

  // Create overview text
  const overview = document.createElement("p");
  overview.className = "text-sm text-slate-700 line-clamp-3";
  overview.textContent = movie.overview || "No overview available.";
  body.appendChild(overview);

  // If favourite button is needed
  if (onFavClick) {
    const btn = document.createElement("button");
    btn.className =
      "mt-2 w-full rounded-lg bg-slate-900 text-white py-2 text-sm hover:bg-slate-800";
    btn.textContent = favLabel;

    // When button clicked, send movie back
    btn.addEventListener("click", () => onFavClick(movie));

    body.appendChild(btn);
  }

  // Add body to card
  li.appendChild(body);

  // Return complete card
  return li;
}
