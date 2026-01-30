import { fetchPopular, searchMovies, fetchNowPlaying } from "./tmdb.js";
import { addToFavs } from "./storage.js";
import { movieCard, heroCarouselItem } from "./ui.js";

// ---- start rm
import { inputEvent, hideSuggest } from "./int_search.js";
// ---- end rm

const popularList = document.querySelector("#popularList");
const searchForm = document.querySelector("#searchForm");
export const searchInput = document.querySelector("#searchInput");

const dialog = document.querySelector("#searchDialog");
const closeDialog = document.querySelector("#closeDialog");
const searchStatus = document.querySelector("#searchStatus");
const searchList = document.querySelector("#searchList");

// Carousel elements
const heroCarousel = document.querySelector("#heroCarousel");
const carouselIndicators = document.querySelector("#carouselIndicators");
const carouselPrev = document.querySelector("#carouselPrev");
const carouselNext = document.querySelector("#carouselNext");

let currentSlide = 0;
let totalSlides = 0;
let autoSlideInterval = null;

// ---- rm
export const searchSuggestions = document.getElementById("searchSuggestions");

function toast(msg) {
  alert(msg);
}


// Render movie cards into listEl.
// - Empty state uses a tag that matches either existing children or the container type.
 
function renderMovies(listEl, movies, emptyMsg = "No movies found.") {
  if (!listEl) return;

  const items = Array.isArray(movies) ? movies : [];

  const createItemNode = () => {
    // If cards already exist, match their tag to avoid invalid mismatches
    const existingTag = listEl.firstElementChild?.tagName;
    if (existingTag) return document.createElement(existingTag);

    // Otherwise take from container type
    const containerTag = listEl.tagName;
    if (containerTag === "UL" || containerTag === "OL") return document.createElement("li");
    return document.createElement("div");
  };

  if (items.length === 0) {
    const emptyNode = createItemNode();
    emptyNode.className = "text-sm text-slate-600 py-2";
    emptyNode.textContent = emptyMsg;

    listEl.replaceChildren(emptyNode);
    return;
  }

  const nodes = items.map((m) =>
    movieCard(m, {
      onFavClick: (movie) => {
        const result = addToFavs(movie);
        toast(result.ok ? "Added to favourites!" : "Already in favourites.");
      },
    })
  );

  listEl.replaceChildren(...nodes);
}

export async function initPopular() {
  try {
    const data = await fetchPopular();
    renderMovies(popularList, data?.results ?? [], "No popular movies found.");
  } catch (e) {
    renderMovies(popularList, [], "Failed to load popular movies.");
    console.error(e);
  }
}
// ------- start rm

export async function doSubmission() {
  if (!dialog || !searchList || !searchStatus || !searchInput) return;

  const q = searchInput.value.trim();

  // Open dialog and clear previous results safely
  dialog.showModal();
  searchStatus.textContent = "";
  searchList.replaceChildren();

  // Prevent searching for empty string
  if (!q) {
    searchStatus.textContent = "Type something to search.";
    // Keep list empty (no "No movies found" on blank)
    return;
  }

  searchStatus.textContent = "Searching...";

  try {
    const data = await searchMovies(q);
    const results = Array.isArray(data?.results) ? data.results : [];

    searchStatus.textContent = results.length
      ? `Found ${results.length} results for "${q}".`
      : `No results found for "${q}".`;

    renderMovies(searchList, results, `No results found for "${q}".`);
  } catch (err) {
    searchStatus.textContent = "Search failed. Please try again.";
    renderMovies(searchList, [], "Search failed.");
    console.error(err);
  }
}

// --- Event listeners

if (closeDialog && dialog) {
  closeDialog.addEventListener("click", () => {
    dialog.close();
    // Return to popular list when closing
    initPopular();
  });
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    doSubmission();
  });
}

// Double-binding can overwrite results.

// click outside of suggestions or input removes suggestions und brings back popular movies
if (searchInput) {
  searchInput.addEventListener("input", () => {
    inputEvent(searchInput, popularList);
  });
}

// Click outside input/suggestions hides suggestions and restores popular movies
document.addEventListener("click", (e) => {
  if (!searchInput || !searchSuggestions) return;
  if (e.target === searchInput) return;
  if (searchSuggestions.contains(e.target)) return;
  hideSuggest();
});

// ------------ end rm --------

// Hero Carousel Functions

function goToSlide(index) {
  if (!heroCarousel || totalSlides === 0) return;

  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentSlide = index;

  const slideWidth = heroCarousel.querySelector(".carousel-item")?.offsetWidth || 0;
  heroCarousel.scrollTo({ left: slideWidth * currentSlide, behavior: "smooth" });

  // Update indicators
  if (carouselIndicators) {
    const indicators = carouselIndicators.querySelectorAll("button");
    indicators.forEach((ind, i) => {
      ind.classList.toggle("bg-sand", i === currentSlide);
      ind.classList.toggle("bg-navy/30", i !== currentSlide);
    });
  }
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

async function initHeroCarousel() {
  if (!heroCarousel || !carouselIndicators) return;

  try {
    const data = await fetchNowPlaying();
    const movies = (data?.results ?? []).slice(0, 5);
    totalSlides = movies.length;
    currentSlide = 0;

    heroCarousel.replaceChildren();
    carouselIndicators.replaceChildren();

    if (totalSlides === 0) {
      heroCarousel.innerHTML = `<div class="text-sm text-slate-600 p-4">No movies available for carousel.</div>`;
      return;
    }

    movies.forEach((movie, index) => {
      const item = heroCarouselItem(movie, {
        onFavClick: (m) => {
          const result = addToFavs(m);
          if (!result.ok) toast("Already in favourites.");
          return result;
        },
      });
      heroCarousel.appendChild(item);

      // Create indicator
      const indicator = document.createElement("button");
      indicator.className = `w-3 h-3 rounded-full transition-colors ${
        index === 0 ? "bg-sand" : "bg-navy/30"
      }`;
      indicator.addEventListener("click", () => {
        goToSlide(index);
        stopAutoSlide();
        startAutoSlide();
      });
      carouselIndicators.appendChild(indicator);
    });

    // Set up navigation buttons
    if (carouselPrev) {
      carouselPrev.addEventListener("click", () => {
        goToSlide(currentSlide - 1);
        stopAutoSlide();
        startAutoSlide();
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener("click", () => {
        goToSlide(currentSlide + 1);
        stopAutoSlide();
        startAutoSlide();
      });
    }

    // Start auto-slide
    startAutoSlide();
    // Pause on hover
    heroCarousel.addEventListener("mouseenter", stopAutoSlide);
    heroCarousel.addEventListener("mouseleave", startAutoSlide);
  } catch (e) {
    heroCarousel.innerHTML = `<div class="text-sm text-coral p-4">Failed to load carousel.</div>`;
    console.error(e);
  }
}

// Initialize
initHeroCarousel();
initPopular();
