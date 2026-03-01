let allCars = [];

async function fetchCars(){
  const url = `data/cars.json?v=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if(!res.ok) throw new Error("Failed to load cars.json");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || []);
}

function uniqSorted(arr){
  return [...new Set(arr)].filter(Boolean).sort((a,b)=>a.localeCompare(b, "el"));
}

function money(n){
  try { return new Intl.NumberFormat("el-GR").format(n); } catch { return n; }
}

function renderBrands(cars){
  const sel = document.getElementById("brandFilter");
  if(!sel) return; // ✅ αν δεν υπάρχει σε αυτή τη σελίδα, δεν κάνουμε τίποτα

  const brands = uniqSorted(cars.map(c => c.brand));
  sel.innerHTML =
    '<option value="">Όλες οι Μάρκες</option>' +
    brands.map(b=>`<option value="${b}">${b}</option>`).join("");
}

function applyFilters(){
  const brandEl = document.getElementById("brandFilter");
  const fuelEl = document.getElementById("fuelFilter");
  const priceEl = document.getElementById("maxPrice");

  const brand = (brandEl ? brandEl.value : "").trim();
  const fuel = (fuelEl ? fuelEl.value : "").trim();
  const maxPrice = Number((priceEl ? priceEl.value : "") || 0);

  let cars = allCars.filter(c => c.published !== false);
  if(brand) cars = cars.filter(c => (c.brand||"") === brand);
  if(fuel) cars = cars.filter(c => (c.fuel||"") === fuel);
  if(maxPrice > 0) cars = cars.filter(c => Number(c.price||0) <= maxPrice);
  return cars;
}

function cardHTML(car){
  const img = (car.images && car.images.length) ? car.images[0] : "";
  return `
    <article class="card" onclick="openCar(${car.id})" role="button" tabindex="0">
      <img class="cardImg" src="${img}" alt="${(car.brand||"") + " " + (car.model||"")}" loading="lazy" />
      <div class="cardBody">
        <h3 class="cardTitle">${car.brand || ""} ${car.model || ""}</h3>
        <p class="cardMeta">${car.year || "—"} • ${(car.kilometers ?? "—")} km • ${car.fuel || "—"}</p>
        <div class="cardPrice">€${money(car.price || 0)}</div>
      </div>
    </article>
  `;
}

function render(){
  const cars = applyFilters();
  const grid = document.getElementById("cars");
  const count = document.getElementById("count");
  const hint = document.getElementById("statusHint");

  if(count) count.textContent = String(cars.length);

  if(grid){
    if(cars.length === 0){
      grid.innerHTML = '<div class="hint">Δεν βρέθηκαν αυτοκίνητα με αυτά τα φίλτρα.</div>';
    } else {
      grid.innerHTML = cars.map(cardHTML).join("");
    }
  }

  if(hint) hint.textContent = " ";
}

function openCar(id){
  window.location.href = `car.html?id=${encodeURIComponent(id)}`;
}

async function init(){
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const hint = document.getElementById("statusHint");

  try{
    allCars = await fetchCars();
    renderBrands(allCars);
    initCustomBrandSelect();   // ✅ μέσα του θα βάλουμε guard
    render();
    if(hint) hint.textContent = " ";
  }catch(e){
    console.error("LOAD ERROR:", e);
    if(hint) hint.textContent = "Σφάλμα φόρτωσης δεδομένων: " + (e?.message || e);
  }

  const searchBtn = document.getElementById("searchBtn");
  if(searchBtn) searchBtn.addEventListener("click", render);

  const resetBtn = document.getElementById("resetBtn");
  if(resetBtn) resetBtn.addEventListener("click", ()=>{
    const b = document.getElementById("brandFilter");
    const f = document.getElementById("fuelFilter");
    const p = document.getElementById("maxPrice");
    if(b) b.value = "";
    if(f) f.value = "";
    if(p) p.value = "";
    render();
  });
}
document.addEventListener("DOMContentLoaded", init);
function initCustomBrandSelect() {
  const select = document.getElementById("brandSelect");
  if(!select) return; // ✅ αν δεν υπάρχει, δεν κάνουμε τίποτα

  const selected = select.querySelector(".select-selected");
  const itemsContainer = select.querySelector(".select-items");
  if(!selected || !itemsContainer) return;

  const brandFilter = document.getElementById("brandFilter");
  if(!brandFilter) return; // ✅ το πραγματικό select που χρησιμοποιεί applyFilters

  const brands = uniqSorted(allCars.map(c => c.brand));
  const options = ["Όλες οι Μάρκες", ...brands];

  itemsContainer.innerHTML = "";

  options.forEach(value => {
    const div = document.createElement("div");
    div.textContent = value;
    div.addEventListener("click", function() {
      selected.textContent = value;

      // ✅ ενημερώνουμε το πραγματικό select
      brandFilter.value = (value === "Όλες οι Μάρκες") ? "" : value;

      itemsContainer.classList.add("select-hide");
      render();
    });
    itemsContainer.appendChild(div);
  });

  selected.addEventListener("click", function() {
    itemsContainer.classList.toggle("select-hide");
  });
}
