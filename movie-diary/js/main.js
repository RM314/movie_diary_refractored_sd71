import { fetchPopular, searchMovies } from "./tmdb.js";
import { addToFavs } from "./storage.js";
import { movieCard } from "./ui.js";

const popularList = document.querySelector("#popularList");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

const dialog = document.querySelector("#searchDialog");
const closeDialog = document.querySelector("#closeDialog");
const searchStatus = document.querySelector("#searchStatus");
const searchList = document.querySelector("#searchList");

function toast(msg) {
  alert(msg);
}

function renderMovies(listEl, movies) {
  listEl.innerHTML = "";
  movies.forEach((m) => {
    const card = movieCard(m, {
      onFavClick: (movie) => {
        const result = addToFavs(movie);
        toast(result.ok ? "Added to favourites!" : "Already in favourites.");
      },
    });
    listEl.appendChild(card);
  });
}

async function initPopular() {
  try {
    const data = await fetchPopular();
    renderMovies(popularList, data.results || []);
  } catch (e) {
    popularList.innerHTML =
      `<li class="text-sm text-red-600">Failed to load popular movies.</li>`;
    console.error(e);
  }
}

closeDialog.addEventListener("click", () => dialog.close());

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();

  searchStatus.textContent = "Searching...";
  searchList.innerHTML = "";
  dialog.showModal();

  try {
    const data = await searchMovies(q);
    const results = data.results || [];
    searchStatus.textContent = results.length
      ? `Found ${results.length} results for "${q}".`
      : `No results found for "${q}".`;

    renderMovies(searchList, results);
  } catch (err) {
    searchStatus.textContent = "Search failed. Please try again.";
    console.error(err);
  }
});

initPopular();
