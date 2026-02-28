let cars = JSON.parse(localStorage.getItem("cars")) || [];
if(cars.length === 0){
  cars = [
    {id:1,brand:"BMW",model:"M4",year:2022,fuel:"Βενζίνη",price:48000,kilometers:15000,image:"https://images.unsplash.com/photo-1617814076367-b759c7d7e738",description:"Άριστη κατάσταση, full extra.",published:true},
    {id:2,brand:"Mercedes",model:"C200",year:2021,fuel:"Πετρέλαιο",price:36500,kilometers:22000,image:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",description:"Συντηρημένο σε επίσημη αντιπροσωπεία.",published:true},
    {id:3,brand:"Audi",model:"A6",year:2020,fuel:"Βενζίνη",price:33000,kilometers:30000,image:"https://images.unsplash.com/photo-1618230243666-5a7b09cf3a41",description:"Όμορφο και ασφαλές αυτοκίνητο.",published:true}
  ];
  localStorage.setItem("cars", JSON.stringify(cars));
}