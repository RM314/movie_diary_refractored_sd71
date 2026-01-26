import { fetchPopular, searchMovies } from "./tmdb.js";
import { addToFavs } from "./storage.js";
import { movieCard } from "./ui.js";

// ---- start rm
import { inputEvent, hideSuggest } from "./int_search.js";
// ----- end rm


const popularList = document.querySelector("#popularList");
const searchForm = document.querySelector("#searchForm");
export const searchInput = document.querySelector("#searchInput");

const dialog = document.querySelector("#searchDialog");
const closeDialog = document.querySelector("#closeDialog");
const searchStatus = document.querySelector("#searchStatus");
const searchList = document.querySelector("#searchList");

// ---- rm
export const searchSuggestions = document.getElementById("searchSuggestions");



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

export async function initPopular() {
  try {
    const data = await fetchPopular();
    renderMovies(popularList, data.results || []);
  } catch (e) {
    popularList.innerHTML =
      `<li class="text-sm text-red-600">Failed to load popular movies.</li>`;
    console.error(e);
  }
}

//closeDialog.addEventListener("click", () => dialog.close());
// ------- start rm
closeDialog.addEventListener("click", () => {
  dialog.close();
  initPopular();
});

export async function doSubmission() {
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
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  doSubmission();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    doSubmission();
  }
});

searchInput.addEventListener("input", () => inputEvent(searchInput,popularList));

// click outside of suggestions or input removes suggestions und brings back popular movies
document.addEventListener("click", (e) => {
    if (e.target === searchInput) return;
    if (searchSuggestions.contains(e.target)) return;
    hideSuggest();
});

// ------------ end rm --------




initPopular();
