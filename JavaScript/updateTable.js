function dragStart(e) {
  e.dataTransfer.setData("menuName", e.target.firstChild.textContent);
  e.dataTransfer.setData("menuPrice", e.target.lastChild.textContent);
  e.dataTransfer.setData("menuId", e.target.id.slice(-1));
}

function allowDrop(e) {
  e.preventDefault();
}
// IT IS USED FOR sessionStorage
let tableOrders = [];

function drop(e) {
  e.preventDefault();

  const orderId = Number(e.dataTransfer.getData("menuId"));
  const orderPrice = Number(e.dataTransfer.getData("menuPrice"));
  const orderName = e.dataTransfer.getData("menuName").substr(0, 15);

  const child = e.target.id;
  const parent = document.getElementById(child)?.closest(".table-card");

  let str = child.slice(-1);

  let amount =
    Number(parent.querySelector("#totalAmount-" + str)?.textContent) +
    orderPrice;

  parent.querySelector("#totalAmount-" + str).innerHTML = amount;

  let quant =
    Number(parent.querySelector("#totalItems-" + str).textContent) + 1;

  parent.querySelector("#totalItems-" + str).innerHTML = quant;

  // Find the record to update
  const tableId = str;

  tableOrders = JSON.parse(sessionStorage.getItem(`${tableId}`)) || [];

  let indx = -1;
  tableOrders.find((res, index) => {
    if (res.id === orderId) indx = index;
  });

  if (indx !== -1) {
    const { price, qty } = tableOrders[indx];
    tableOrders[indx].qty++;
    tableOrders[indx].totalItemPrice = price * (qty + 1);
  } else {
    tableOrders.push({
      id: orderId,
      name: orderName,
      price: orderPrice,
      qty: 1,
      totalItemPrice: orderPrice,
    });
  }

  sessionStorage.setItem(`${tableId}`, `${JSON.stringify(tableOrders)}`);
  // console.log(JSON.parse(sessionStorage.getItem(tableId)));

  // fetch(`http://localhost:3000/tableSet/${tableId}`)
  //   .then((response) => response.json())
  //   .then((recordToUpdate) => {
  //     // Modify the record as needed
  //     recordToUpdate.totalItems = Number(recordToUpdate.totalItems) + 1;

  //     // Send a PUT request to update the record
  //     fetch(`http://localhost:3000/tableSet/${tableId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(recordToUpdate),
  //     })
  //       .then((response) => {
  //         console.log(`Record with ID ${tableId} updated successfully`);
  //       })
  //       .catch((error) => {
  //         console.error(`Error updating record with ID ${tableId}:`, error);
  //       });
  //   })
  //   .catch((error) => {
  //     console.error(`Error retrieving record with ID ${tableId}:`, error);
  //   });
}
