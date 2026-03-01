function money(n){
  try { return new Intl.NumberFormat("el-GR").format(n); } catch { return n; }
}

async function fetchCars(){
  const url = `data/cars.json?v=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if(!res.ok) throw new Error("Failed to load cars.json");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || []);
}

function setMain(imgEl, url){ imgEl.src = url || ""; }

/* ---------- Lightbox helpers ---------- */
function ensureLightbox(){
  let lb = document.getElementById("kcLightbox");
  if (lb) return lb;

  lb = document.createElement("div");
  lb.id = "kcLightbox";
  lb.className = "kc-lightbox";
  lb.setAttribute("aria-hidden", "true");

  const img = document.createElement("img");
  img.id = "kcLightboxImg";
  img.alt = "photo";

  lb.appendChild(img);
  document.body.appendChild(lb);

  // κλικ πάνω στο overlay => κλείνει
  lb.addEventListener("click", closeLightbox);

  // ESC => κλείνει
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  return lb;
}

function openLightbox(src){
  const lb = ensureLightbox();
  const img = document.getElementById("kcLightboxImg");
  img.src = src || "";
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  const lb = document.getElementById("kcLightbox");
  if (!lb) return;
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  const img = document.getElementById("kcLightboxImg");
  if (img) img.src = "";
  document.body.style.overflow = "";
}

function toggleLightbox(src){
  const lb = document.getElementById("kcLightbox");
  if (lb && lb.classList.contains("open")) closeLightbox();
  else openLightbox(src);
}
/* ------------------------------------- */

}catch (e) {
  console.error("LOAD ERROR:", e);
  hint.textContent =
    "Σφάλμα φόρτωσης δεδομένων: " + (e?.message || e);
}
  try{
    const cars = await fetchCars();
    const car = cars.find(c => Number(c.id) === id);
    if(!car){ hint.textContent = "Δεν βρέθηκε αγγελία."; return; }

    document.getElementById("title").textContent = `${car.brand || ""} ${car.model || ""}`.trim();
    document.getElementById("price").textContent = `€${money(car.price || 0)}`;
    document.getElementById("year").textContent = car.year ?? "—";
    document.getElementById("km").textContent = car.kilometers ?? "—";
    document.getElementById("fuel").textContent = car.fuel ?? "—";
    document.getElementById("desc").textContent = car.description || "";
    

    const imgs = (car.images && car.images.length) ? car.images : [""];
    const main = document.getElementById("mainImg");
    setMain(main, imgs[0]);

    // κλικ στην κύρια φωτογραφία => toggle zoom
    main.addEventListener("click", () => {
      toggleLightbox(main.src);
    });

    const thumbs = document.getElementById("thumbs");
    thumbs.innerHTML = "";

    imgs.forEach((u, idx) => {
      const t = document.createElement("div");
      t.className = "thumb" + (idx === 0 ? " active" : "");
      t.innerHTML = `<img src="${u}" alt="thumb" loading="lazy">`;

      t.addEventListener("click", () => {
        const alreadyActive = t.classList.contains("active");

        // 1ο κλικ: ενεργοποίηση + αλλαγή main
        if (!alreadyActive){
          [...thumbs.children].forEach(ch => ch.classList.remove("active"));
          t.classList.add("active");
          setMain(main, u);
          return;
        }

        // 2ο κλικ στο ίδιο ενεργό thumb: zoom
        toggleLightbox(u);
      });

      thumbs.appendChild(t);
    });

    hint.textContent = "";
  }catch(e){
    console.error(e);
    hint.textContent = "Σφάλμα φόρτωσης δεδομένων.";
  }
}

document.addEventListener("DOMContentLoaded", init);
