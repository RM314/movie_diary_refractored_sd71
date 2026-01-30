import "./style.css";
import { fetchPopular, searchMovies, fetchNowPlaying } from "./tmdb.js";
import { addToFavs } from "./storage.js";
import { movieCard, heroCarouselItem } from "./ui.js";
import { initBurgerMenu } from "./burger.js";

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

function renderMovies(listEl, movies) {
  listEl.innerHTML = "";
  movies.forEach((m) => {
    const card = movieCard(m, {
      onFavClick: (movie) => {
        const result = addToFavs(movie);
        if (!result.ok) {
          toast("Already in favourites.");
        }
        return result;
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

// Hero Carousel Functions
function goToSlide(index) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentSlide = index;

  const slideWidth = heroCarousel.querySelector('.carousel-item')?.offsetWidth || 0;
  heroCarousel.scrollTo({ left: slideWidth * currentSlide, behavior: 'smooth' });

  // Update indicators
  const indicators = carouselIndicators.querySelectorAll('button');
  indicators.forEach((ind, i) => {
    ind.classList.toggle('bg-sand', i === currentSlide);
    ind.classList.toggle('bg-navy/30', i !== currentSlide);
  });
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
  try {
    const data = await fetchNowPlaying();
    const movies = (data.results || []).slice(0, 5); // Limit to 5 movies
    totalSlides = movies.length;

    heroCarousel.innerHTML = '';
    carouselIndicators.innerHTML = '';

    movies.forEach((movie, index) => {
      const item = heroCarouselItem(movie, {
        onFavClick: (m) => {
          const result = addToFavs(m);
          if (!result.ok) {
            toast("Already in favourites.");
          }
          return result;
        }
      });
      heroCarousel.appendChild(item);

      // Create indicator
      const indicator = document.createElement('button');
      indicator.className = `w-3 h-3 rounded-full transition-colors ${index === 0 ? 'bg-sand' : 'bg-navy/30'}`;
      indicator.addEventListener('click', () => {
        goToSlide(index);
        stopAutoSlide();
        startAutoSlide();
      });
      carouselIndicators.appendChild(indicator);
    });

    // Set up navigation buttons
    carouselPrev.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      stopAutoSlide();
      startAutoSlide();
    });

    carouselNext.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      stopAutoSlide();
      startAutoSlide();
    });

    // Start auto-slide
    startAutoSlide();

    // Pause on hover
    heroCarousel.addEventListener('mouseenter', stopAutoSlide);
    heroCarousel.addEventListener('mouseleave', startAutoSlide);

  } catch (e) {
    heroCarousel.innerHTML = `<div class="text-sm text-coral p-4">Failed to load carousel.</div>`;
    console.error(e);
  }
}

// Initialize
initHeroCarousel();
initPopular();
initBurgerMenu();
