let cars=[];
async function init(){
  const r=await fetch('data/cars.json');
  cars=await r.json();
  render();
}
function render(){
  const brand=document.getElementById('brandFilter').value;
  const maxPrice=document.getElementById('maxPrice').value;
  let v=cars.filter(c=>c.published);
  if(brand) v=v.filter(c=>c.brand===brand);
  if(maxPrice) v=v.filter(c=>c.price<=maxPrice);
  const ctn=document.getElementById('cars');
  ctn.innerHTML='';
  v.forEach(car=>{
    ctn.innerHTML+=`<div class="card" onclick="openCar(${car.id})">
      <img src="${car.images[0]}">
      <h3>${car.brand} ${car.model}</h3>
      <p>${car.year} • ${car.kilometers} km • ${car.fuel}</p>
      <h4>€${car.price}</h4>
    </div>`;
  });
}
function openCar(id){location.href='car.html?id='+id;}
document.addEventListener('DOMContentLoaded',init);
