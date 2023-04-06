const searchTable = document.getElementById("tableNum");
searchTable.addEventListener("input", search);

async function search() {
  let val = searchTable.value.toLowerCase();
  const res = await fetch("./JSON/tableSet.json");
  const data = await res.json();
  let booked_table = data.filter((data) =>
    data.tableName.toLowerCase().includes(val.toLowerCase())
  );

  displayTables(booked_table);
}

// SEARCHING OPERATION ON THE TABLE
function displayTables(tableData) {
  if (tableData) {
    sittingTable.innerHTML = "";

    tableData.forEach((ele) => {
      const { id, tableName, totalAmount, totalItems } = ele;

      // sessionStorage CONTENT
      let browserStorage = JSON.parse(sessionStorage.getItem(String(id)));
      let sum = 0,
        itemQty = 0;
      browserStorage?.forEach((e) => {
        sum += e.totalItemPrice;
        itemQty += e.qty;
      });

      let div = document.createElement("div");
      div.setAttribute("class", `table-card flex-column`);
      div.setAttribute("id", `table-card-${id}`);
      div.setAttribute("ondragover", "allowDrop(event)");
      div.setAttribute("ondrop", "drop(event)");
      div.innerHTML = `<p id="para-${id}"> ${tableName}</p>
          <div class="flex-row" id='flex-row-${id}'>
            <span >Rs. <span id="totalAmount-${id}">${
        browserStorage ? sum : totalAmount
      }</span>
            <span id='middle-line-${id}'> | </span>
            <span >Total Items: <span id="totalItems-${id}">${
        browserStorage ? itemQty : totalItems
      }</span>
          </div>`;
      sittingTable.appendChild(div);
    });
  }
}
