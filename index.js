const sittingTable = document.querySelector(".sittingTable");
const menuItems = document.querySelector(".menuAll");

function main() {
  //INITIAL TABLE LOADING
  console.log("logged");
  fetch("./JSON/tableSet.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((table) => {
        const { id, tableName, totalAmount, totalItems } = table;

        // sessinStorage CONTENT IF PRESENT, IT WILL DISPLAYED
        let browserStorage = JSON.parse(sessionStorage.getItem(String(id)));
        let sum = 0,
          itemQty = 0;
        browserStorage?.forEach((e) => {
          sum += e.totalItemPrice;
          itemQty += e.qty;
        });

        let div = document.createElement("div");
        div.setAttribute("class", `table-card  flex-column`);
        div.setAttribute("id", `table-card-${id}`);
        div.setAttribute("ondragover", "allowDrop(event)");
        div.setAttribute("ondrop", "drop(event)");

        div.innerHTML = `<p id=tableName-${id}> ${tableName}</p>
            <div class="flex-row" id='flex-row-${id}'>
              <p id='para-${id}' >Rs. <span id="totalAmount-${id}">${
          browserStorage ? sum : totalAmount
        }</span></p>
              <p id='middleline-${id}'> | </p>
              <p id='paraItem-${id}'>Total Items: <span id="totalItems-${id}">${
          browserStorage ? itemQty : totalItems
        }</span></p>
            </div>`;
        sittingTable.appendChild(div);
      });
    });

  //INITIAL LOADING OF MENU ITEMS AND PRICE
  fetch("./JSON/menuSet.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((table) => {
        const { id, itemName, itemPrice } = table;
        let div = document.createElement("div");

        div.setAttribute("class", `menuItem-details flex-column`);
        div.setAttribute("id", `menuItem-details-${id}`);
        div.setAttribute("draggable", "true");
        div.setAttribute("ondragstart", "dragStart(event)");

        div.innerHTML = `<p class="item-name" id="itemId-${id}">${itemName}</p>
          <p class="item-price" id="itemRate-${id}">${itemPrice}</p>`;
        menuItems.appendChild(div);
      });
    });
}

main();
