export function initBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!burgerBtn || !mobileMenu) return;

  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      mobileMenu.classList.add("hidden");
    }
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobileMenu.classList.add("hidden");
    }
  });

  /*
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      mobileMenu.classList.add("hidden");
    }
  });
  */
}

