import "./style.css";
import { loadFavs, removeFromFavs, updateNote } from "./storage.js";
import { moviePoster } from "../components/moviePoster.js";
import { movieTextContent } from "../components/movieTextContent.js";

const favList = document.querySelector("#favList");

function renderFavs() {
  const favs = loadFavs();
  favList.innerHTML = "";

  if (!favs.length) {
    favList.innerHTML = `<li class="text-sm text-navy/70">No favourites yet. Add some from Home.</li>`;
    return;
  }

  favs.forEach((movie) => {
    favList.appendChild(journalMovieCard(movie));
  });
}

renderFavs();

function journalMovieCard(movie) {
  // list item..
  const li = document.createElement("li");
  li.className = "rounded-xl border-2 border-navy-50 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow";

  // adding poster
  li.append(moviePoster(movie.title, movie.poster_path));

  // adding text container - padding, etc
  const textContainer = document.createElement("div");
  textContainer.className = "p-2 flex flex-col gap-2 flex-1";

  // adds description without overview
  textContainer.append(movieTextContent(movie, false));

  // adding editing fields
  const label = document.createElement("label");
  label.className = "text-sm font-medium mt-2 text-navy";
  label.textContent = "Your note";
  textContainer.appendChild(label);

  // textarea
  const textarea = document.createElement("textarea");
  textarea.className = "note w-full rounded-lg border-2 border-navy/30 px-3 py-2 text-sm text-navy focus:border-teal focus:outline-none";
  textarea.rows = 3;
  textarea.placeholder = "Write your thoughts...";
  textarea.value = movie.note || "";
  textContainer.appendChild(textarea);

  // adding buttons
  textContainer.appendChild(journalButtonsContainer(movie.id, textarea));

  // finalising
  li.appendChild(textContainer);

  return li;
}

function journalButtonsContainer(movieID, textarea) {
  // buttons!
  const buttonsContainer = document.createElement("span");
  buttonsContainer.className = "flex gap-2 mt-2";

  const buttonDesign = "rounded-lg py-1 text-sm transition-colors";

  // save button
  const saveButton = document.createElement("button");
  saveButton.className = `save ${buttonDesign} px-5 bg-teal text-white hover:bg-navy`;
  saveButton.textContent = "Save note";
  saveButton.addEventListener("click", () => {
    updateNote(movieID, textarea.value.trim());
    alert("Note saved!");
  });
  buttonsContainer.appendChild(saveButton);

  // remove button
  const removeButton = document.createElement("button");
  removeButton.className = `remove ${buttonDesign} px-3 border-2 border-coral text-coral hover:bg-coral hover:text-black`;
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    removeFromFavs(movieID);
    renderFavs();
  });

  // finalising
  buttonsContainer.appendChild(removeButton);

  return buttonsContainer
}