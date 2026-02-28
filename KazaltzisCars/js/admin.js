let cars=[];let editingId=null;
async function loadJSON(){
  const r=await fetch('data/cars.json');
  cars=await r.json();
  refresh();
}
function refresh(){
  document.getElementById('jsonEditor').value=JSON.stringify(cars,null,2);
  const list=document.getElementById('list');
  list.innerHTML='';
  cars.forEach(c=>{
    const d=document.createElement('div');
    d.innerHTML=`<strong>${c.brand} ${c.model}</strong>
    <button onclick="editCar(${c.id})">Edit</button>
    <button onclick="delCar(${c.id})">Delete</button>`;
    list.appendChild(d);
  });
}
function editCar(id){
  const c=cars.find(x=>x.id===id);
  brand.value=c.brand;model.value=c.model;price.value=c.price;
  year.value=c.year;km.value=c.kilometers;fuel.value=c.fuel;
  images.value=c.images.join(', ');desc.value=c.description;
  published.checked=c.published;editingId=id;
}
function saveCar(){
  const obj={
    id:editingId||Date.now(),
    brand:brand.value,model:model.value,price:parseInt(price.value),
    year:parseInt(year.value),kilometers:parseInt(km.value),
    fuel:fuel.value,description:desc.value,
    images:images.value.split(',').map(s=>s.trim()),
    published:published.checked
  };
  if(editingId){
    const i=cars.findIndex(x=>x.id===editingId);
    cars[i]=obj;editingId=null;
  }else cars.push(obj);
  refresh();
}
function delCar(id){cars=cars.filter(x=>x.id!==id);refresh();}
function downloadJSON(){
  const blob=new Blob([JSON.stringify(cars,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='cars.json';a.click();
}
loadJSON();
