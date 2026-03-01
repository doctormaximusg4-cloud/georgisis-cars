(() => {
  // Δημιουργία overlay
  const lb = document.createElement("div");
  lb.id = "kcLightbox";
  lb.className = "kc-lightbox";
  lb.innerHTML = `<img id="kcLightboxImg" alt="">`;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector("#kcLightboxImg");

  const open = (src, alt = "") => {
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  // Κλικ στο overlay => κλείνει (2ο κλικ)
  lb.addEventListener("click", close);

  // ESC => κλείνει
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Event delegation: πιάνει και κύρια φωτο + thumbnails
  document.addEventListener("click", (e) => {
    // αν είναι ανοιχτό, οποιοδήποτε κλικ κλείνει (toggle)
    if (lb.classList.contains("open")) { close(); return; }

    const img = e.target.closest(".galleryMain img, .thumb img");
    if (!img) return;

    open(img.currentSrc || img.src, img.alt || "");
  });
})();