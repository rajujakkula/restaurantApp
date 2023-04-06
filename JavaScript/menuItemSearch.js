const searchMenu = document.getElementById("menuItems");
searchMenu.addEventListener("input", search);

async function search() {
  let val = searchMenu.value.toLowerCase();
  const res = await fetch("./JSON/menuSet.json");
  const data = await res.json();
  let orederedItem = data.filter((item) =>
    item.itemName.toLowerCase().includes(val.toLowerCase())
  );

  displayTable(orederedItem);
}

// MENU ITEMS SEARCHING
function displayTable(orderData) {
  if (orderData) {
    menuItems.innerHTML = "";

    orderData.forEach((ele) => {
      const { id, itemName, itemPrice } = ele;
      let div = document.createElement("div");
      div.setAttribute("class", `table-card  flex-column`);
      div.setAttribute("id", `table-card-${id}`);
      div.setAttribute("draggable", "true");
      div.setAttribute("ondragstart", "dragStart(event)");
      div.innerHTML = `<p class="item-name" id="itemId-${id}">${itemName}</p>
      <p class="item-price" id="itemRate-${id}">${itemPrice}</p>`;
      menuItems.appendChild(div);
    });
  }
}
