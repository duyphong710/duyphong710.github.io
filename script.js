/* ============================================================
   Duy Phong — Academic Portfolio · script.js
   ============================================================
   This file adds five small behaviours to the page:
   1. Mobile menu (hamburger button)
   2. Header shadow when you scroll down
   3. Highlight the nav link of the section you are reading
   4. Fade-in animation when sections scroll into view
   5. Award photos: show a placeholder until the photo file exists
   Plus: the current year in the footer.

   (English and Vietnamese are both always visible, so no
   language-switching code is needed. See style.css, part 3.)
   ============================================================ */

// Tell the CSS that JavaScript is running (used by the fade-in animation).
document.documentElement.classList.add("js");


/* ---------- 1. Mobile menu ---------- */

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

// Open or close the menu.
function toggleMenu(forceOpen) {
  // If forceOpen is given use it, otherwise flip the current state.
  const willOpen =
    typeof forceOpen === "boolean" ? forceOpen : !navMenu.classList.contains("open");

  navMenu.classList.toggle("open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
}

navToggle.addEventListener("click", function () {
  toggleMenu();
});

// Close the menu after tapping a link (so the page content is visible).
document.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    toggleMenu(false);
  });
});


/* ---------- 2. Header shadow on scroll ---------- */

const header = document.querySelector(".site-header");

function updateHeader() {
  // Add the "scrolled" class after the user scrolls 10px or more.
  header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeader);
updateHeader(); // run once in case the page loads already scrolled


/* ---------- 3. Highlight the current section in the nav ---------- */

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

// IntersectionObserver tells us when an element enters or leaves the screen.
// rootMargin shrinks the "viewing area" to a band around the middle of the
// screen, so a section counts as "current" when it reaches that band.
const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          // A link is active if its href is "#" + the section's id.
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach(function (section) {
  sectionObserver.observe(section);
});


/* ---------- 4. Fade-in on scroll ---------- */

const revealObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.12 } // trigger when 12% of the element is visible
);

document.querySelectorAll(".reveal").forEach(function (element) {
  revealObserver.observe(element);
});


/* ---------- 5. Award photos: show a placeholder if the file is missing ----------
   Each <figure class="award-photo"> contains the photo and a dashed
   placeholder box. If the photo can't be loaded (for example, the file
   hasn't been added to the "images" folder yet), we add the class
   "is-missing", and style.css shows the placeholder instead. */

document.querySelectorAll(".award-photo img").forEach(function (img) {
  function markMissing() {
    img.closest(".award-photo").classList.add("is-missing");
  }

  // The image may have already failed before this script ran…
  if (img.complete && img.naturalWidth === 0) {
    markMissing();
  }
  // …or it may fail later.
  img.addEventListener("error", markMissing);
});


/* ---------- Footer year ---------- */

document.getElementById("year").textContent = new Date().getFullYear();


/* ---------- Edit mode: show placeholders on your own computer ----------
   On the public website the <body> keeps the class "hide-empty", so
   visitors never see empty [placeholder] boxes.
   When you open the site on your own computer (localhost or a file),
   the class is removed, so every placeholder appears in a dashed frame
   and you can see what still needs to be filled in.
   On the public website, add "?edit" to the address
   (https://duyphong710.github.io/?edit) to see the same frames. */

if (location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.protocol === "file:" ||
    new URLSearchParams(location.search).has("edit")) {
  document.body.classList.remove("hide-empty");
}
