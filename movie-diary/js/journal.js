import { loadFavs, removeFromFavs, updateNote } from "./storage.js";
import { posterUrl } from "./tmdb.js";

const favList = document.querySelector("#favList");

function renderFavs() {
  const favs = loadFavs();
  favList.innerHTML = "";

  if (!favs.length) {
    favList.innerHTML = `<li class="text-sm text-navy/70">No favourites yet. Add some from Home.</li>`;
    return;
  }

  favs.forEach((movie) => {
    const li = document.createElement("li");
    li.className = "rounded-xl border-2 border-navy bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow";

    li.innerHTML = `
      <img class="w-full h-64 object-cover bg-teal/10" src="${posterUrl(movie.poster_path) || ""}" alt="${movie.title || "Movie poster"}" />
      <div class="p-4 flex flex-col gap-2">
        <h3 class="text-lg font-semibold text-navy">${movie.title || "Untitled"}</h3>
        <p class="text-sm text-navy/70">Release: ${movie.release_date || "N/A"} • Rating: ${movie.vote_average ?? "N/A"}</p>

        <label class="text-sm font-medium mt-2 text-navy">Your note</label>
        <textarea class="note w-full rounded-lg border-2 border-navy/30 px-3 py-2 text-sm text-navy focus:border-teal focus:outline-none" rows="3"
          placeholder="Write your thoughts...">${movie.note || ""}</textarea>

        <div class="flex gap-2 mt-2">
          <button class="save rounded-lg bg-teal text-white px-3 py-2 text-sm hover:bg-navy transition-colors">Save note</button>
          <button class="remove rounded-lg border-2 border-coral text-coral px-3 py-2 text-sm hover:bg-coral hover:text-white transition-colors">Remove</button>
        </div>
      </div>
    `;

    const noteEl = li.querySelector(".note");
    li.querySelector(".save").addEventListener("click", () => {
      updateNote(movie.id, noteEl.value.trim());
      alert("Note saved!");
    });

    li.querySelector(".remove").addEventListener("click", () => {
      removeFromFavs(movie.id);
      renderFavs();
    });

    favList.appendChild(li);
  });
}

renderFavs();
