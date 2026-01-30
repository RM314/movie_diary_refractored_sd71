import { moviePoster } from "../components/moviePoster.js";
import { addToFavoritesButton } from "../components/addToFavoritesButton.js";
import { movieTextContent } from "../components/movieTextContent.js";

export function movieCard(movie, { onFavClick, favLabel = "Add to favourites" } = {}) {
  const li = document.createElement("li");

  // create a flex-col
  li.className =
    "h-full rounded-xl border-2 border-navy-50 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow";

  // 1/2 Use the reusable poster component
  const poster = moviePoster(movie.title, movie.poster_path);
  li.appendChild(poster);

  // 2/2 Body section - flex-1 makes it take remaining space, pushing button to bottom
  const body = document.createElement("div");
  body.className = "p-4 flex flex-col gap-2 flex-1";
  
  body.appendChild(movieTextContent(movie));

  if (onFavClick) {
    const fav = addToFavoritesButton(movie, { width: "w-full" }, onFavClick);
    body.appendChild(fav);
  }

  li.appendChild(body);
  return li;
}

export function heroCarouselItem(movie, { onFavClick } = {}) {
  const div = document.createElement("div");
  div.className = "carousel-item flex-shrink-0 w-full rounded-xl overflow-hidden bg-white shadow-md flex";

  const poster = moviePoster(movie.title, movie.poster_path, { width: "w-40" });
  div.appendChild(poster);

  // Content on the right
  const body = document.createElement("div");
  body.className = "p-5 flex flex-col justify-center";

  body.appendChild(movieTextContent(movie));

  if (onFavClick) {
    const fav = addToFavoritesButton(movie, onFavClick);
    body.appendChild(fav);
  }

  div.appendChild(body);
  return div;
}