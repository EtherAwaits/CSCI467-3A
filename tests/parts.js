(async () => {
  const res = await fetch("http://localhost:3000/api/parts");
  const data = await res.json();
  console.log(data);
})();
