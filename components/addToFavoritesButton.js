import { loadFavs } from "../src/storage.js";

function isInFavourites(movieId) {
    const favs = loadFavs();
    return favs.some((m) => m.id === movieId);
  }

  const addToFavoritesButton = (movie, { width = "w-fit" } = {}, onFavClick) => {
    const button = document.createElement("button");
    const alreadyAdded = isInFavourites(movie.id);

    const designDefault = `${width} mt-auto rounded-lg text-white px-4 py-2 text-sm`;

    const markAsAdded = () => {
      button.textContent = "Added";
      button.className = `${designDefault} bg-navy/50 cursor-default`;
      button.disabled = true;
    };

    if (alreadyAdded) {
      markAsAdded();
    } else {
      button.className = `${designDefault} bg-teal hover:bg-navy transition-colors`;
      button.textContent = "Add to favourites";
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const result = onFavClick(movie);
        if (result && result.ok) {
          markAsAdded();
        }
      });
    }

    return button;
  }

  export { addToFavoritesButton };