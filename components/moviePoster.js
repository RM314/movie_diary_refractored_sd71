import { posterUrl } from "../src/tmdb.js";

function moviePoster(title, posterPath, { width = "w-full" } = {}) {

    // Container with fixed aspect ratio
    const container = document.createElement("div");
    container.className = `${width} aspect-[2/3] flex-shrink-0 bg-gray-100 overflow-hidden`;
    
    // Image fills the container
    const img = document.createElement("img");
    img.className = "w-full h-full object-cover";
    img.alt = title || "Movie poster";
    img.src = posterUrl(posterPath) || "";
    
    container.appendChild(img);
    return container;
  }

  export { moviePoster };