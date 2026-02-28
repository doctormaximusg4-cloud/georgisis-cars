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

async function init(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const hint = document.getElementById("detailHint");

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
    document.getElementById("color").textContent = car.color ?? "—";

    const imgs = (car.images && car.images.length) ? car.images : [""];
    const main = document.getElementById("mainImg");
    setMain(main, imgs[0]);

    const thumbs = document.getElementById("thumbs");
    thumbs.innerHTML = "";
    imgs.forEach((u, idx) => {
      const t = document.createElement("div");
      t.className = "thumb" + (idx === 0 ? " active" : "");
      t.innerHTML = `<img src="${u}" alt="thumb" loading="lazy">`;
      t.addEventListener("click", () => {
        [...thumbs.children].forEach(ch => ch.classList.remove("active"));
        t.classList.add("active");
        setMain(main, u);
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
