
function movieTextContent(movie, showsOverview = true) {

  const container = document.createElement("div");
  container.className = "gap-2 flex flex-col mb-4";

  const title = document.createElement("h1");
  title.className = "text-lg font-bold text-navy";
  title.textContent = movie.title || "Untitled";
  container.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "text-sm text-navy/70";
  meta.textContent = `Release: ${movie.release_date || "N/A"} • \u2605 ${movie.vote_average?.toFixed(1) ?? "N/A"}`;
  container.appendChild(meta);

  const overview = document.createElement("p");
  overview.className = "text-sm text-navy/80 line-clamp-3 mt-1 mb-2";
  overview.textContent = movie.overview || "No overview available.";
  if (showsOverview) {
    container.appendChild(overview);
  }

  return container;
}

export { movieTextContent };