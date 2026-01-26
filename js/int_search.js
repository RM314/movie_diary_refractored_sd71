import { doSubmission, searchSuggestions, searchInput, initPopular} from "./main.js";
import { searchMovies } from "./tmdb.js";

export {
    hideSuggest,
    inputEvent
};

const IMG_BASE_SMALL = "https://image.tmdb.org/t/p/w92";
const timeOut=1000;

let timer = null;
let controller = null;



function inputEvent()
{
    const q = searchInput.value.trim();

    if (controller) {
        controller.abort();
        controller = null;
    }

    if (q.length < 2) {
        clearTimeout(timer);
        hideSuggest();
        return;
    }

  popularList.innerHTML="";
  clearTimeout(timer);
  timer = setTimeout(() => {
    runSuggest(q);
  }, timeOut);
}


async function runSuggest(q) {
  // alten Request abbrechen
  if (controller) controller.abort();
  controller = new AbortController();

  try {
    //const data = await searchMovie2(q, { signal: controller.signal }); // deine TMDB search
    const data = await searchMovies(q, { signal: controller.signal }); // deine TMDB search
    showSuggest(data.results.slice(0, 11));
  } catch (err) {
    if (err.name === "AbortError") return;
    hideSuggest();
    console.error(err);
  }
}

function showSuggest(movies) {
  searchSuggestions.innerHTML = "";

  for (const m of movies) {
    const item = document.createElement("button");
    item.type = "button";
    item.className =
      "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-black/5";
    item.dataset.id = m.id;

    // Poster
    if (m.poster_path) {
      const img = document.createElement("img");
      img.src = IMG_BASE_SMALL + m.poster_path;
      img.alt = "";
      img.className = "h-14 w-10 rounded object-cover bg-black/10";
      img.loading = "lazy";
      item.appendChild(img);
    }

    // Textblock
    const textWrap = document.createElement("div");

    const title = document.createElement("div");
    title.className = "text-sm font-medium";
    title.textContent = m.title;

    const meta = document.createElement("div");
    meta.className = "text-xs text-black/60";
    meta.textContent = m.release_date
      ? m.release_date.slice(0, 4)
      : "—";

    textWrap.append(title, meta);
    item.appendChild(textWrap);

    item.addEventListener("click", () => {
      searchInput.value = m.title;
      hideSuggest();
      // optional: sofortige Suche oder Details öffnen
      doSubmission();
    });

    searchSuggestions.appendChild(item);
  }
  searchSuggestions.classList.remove("hidden");
}


function hideSuggest() {
    searchSuggestions.classList.add("hidden");
    searchSuggestions.innerHTML = "";
    initPopular();
}