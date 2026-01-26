import { loadFavs, removeFromFavs, updateNote } from "./storage.js";
import { posterUrl } from "./tmdb.js";

const favList = document.querySelector("#favList");

function renderFavs() {
  const favs = loadFavs();
  favList.innerHTML = "";

  if (!favs.length) {
    favList.innerHTML = `<li class="text-sm text-slate-600">No favourites yet. Add some from Home.</li>`;
    return;
  }

  favs.forEach((movie) => {
    const li = document.createElement("li");
    li.className = "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden";

    li.innerHTML = `
      <img class="w-full h-64 object-cover bg-slate-100" src="${posterUrl(movie.poster_path) || ""}" alt="${movie.title || "Movie poster"}" />
      <div class="p-4 flex flex-col gap-2">
        <h3 class="text-lg font-semibold">${movie.title || "Untitled"}</h3>
        <p class="text-sm text-slate-600">Release: ${movie.release_date || "N/A"} • Rating: ${movie.vote_average ?? "N/A"}</p>

        <label class="text-sm font-medium mt-2">Your note</label>
        <textarea class="note w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows="3"
          placeholder="Write your thoughts...">${movie.note || ""}</textarea>

        <div class="flex gap-2 mt-2">
          <button class="save rounded-lg bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">Save note</button>
          <button class="remove rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">Remove</button>
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
