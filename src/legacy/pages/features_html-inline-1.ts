// @ts-nocheck
// Mobile menu
    const menu = document.getElementById("mobileMenu");
    document.getElementById("menuOpen").addEventListener("click", () => menu.classList.add("open"));
    document.getElementById("menuClose").addEventListener("click", () => menu.classList.remove("open"));

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
