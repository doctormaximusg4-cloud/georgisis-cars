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
  const brands = uniqSorted(cars.map(c => c.brand));
  sel.innerHTML = '<option value="">Όλες οι Μάρκες</option>' + brands.map(b=>`<option value="${b}">${b}</option>`).join("");
}

function applyFilters(){
  const brand = document.getElementById("brandFilter").value.trim();
  const fuel = document.getElementById("fuelFilter").value.trim();
  const maxPrice = Number(document.getElementById("maxPrice").value || 0);

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

  count.textContent = String(cars.length);
  if(cars.length === 0){
    grid.innerHTML = '<div class="hint">Δεν βρέθηκαν αυτοκίνητα με αυτά τα φίλτρα.</div>';
  } else {
    grid.innerHTML = cars.map(cardHTML).join("");
  }
  hint.textContent = "       ";
}

function openCar(id){
  window.location.href = `car.html?id=${encodeURIComponent(id)}`;
}

async function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  const hint = document.getElementById("statusHint");

  try{
    allCars = await fetchCars();
    renderBrands(allCars);
    initCustomBrandSelect();
    render();
    hint.textContent = "       ";
  }catch(e){
    console.error(e);
    hint.textContent = "Σφάλμα φόρτωσης δεδομένων. Έλεγξε το data/cars.json.";
  }

  document.getElementById("searchBtn").addEventListener("click", render);
  document.getElementById("resetBtn").addEventListener("click", ()=>{
    document.getElementById("brandFilter").value = "";
    document.getElementById("fuelFilter").value = "";
    document.getElementById("maxPrice").value = "";
    render();
  });
}
document.addEventListener("DOMContentLoaded", init);
function initCustomBrandSelect() {
  const select = document.getElementById("brandSelect");
  const selected = select.querySelector(".select-selected");
  const itemsContainer = select.querySelector(".select-items");

  const brands = uniqSorted(allCars.map(c => c.brand));
  const options = ["Όλες οι Μάρκες", ...brands];

  itemsContainer.innerHTML = "";

  options.forEach(value => {
    const div = document.createElement("div");
    div.textContent = value;
    div.addEventListener("click", function() {
      selected.textContent = value;
      document.getElementById("brandFilterValue").value =
        value === "Όλες οι Μάρκες" ? "" : value;
      itemsContainer.classList.add("select-hide");
      render();
    });
    itemsContainer.appendChild(div);
  });

  selected.addEventListener("click", function() {
    itemsContainer.classList.toggle("select-hide");
  });
}
