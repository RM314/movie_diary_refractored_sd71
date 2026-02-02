export function initBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  const burger=document.querySelector(".burger");
  const close=document.querySelector(".close");

  console.log("A",burger);
  console.log("B",close);

  if (!burgerBtn || !mobileMenu || !burger || !close) return;

  burgerBtn.addEventListener("click", () => {
    const isHidden=mobileMenu.classList.toggle("hidden");
    burger.classList.toggle("hidden", !isHidden);
    close.classList.toggle("hidden", isHidden);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      mobileMenu.classList.add("hidden");
      burger.classList.remove("hidden");
      close.classList.add("hidden");
    }
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobileMenu.classList.add("hidden");
      burger.classList.remove("hidden");
      close.classList.add("hidden");
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

