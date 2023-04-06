const popUp = document.querySelector(".popUp");

sittingTable.addEventListener("click", function (event) {
  // CHECKING PREVIOUS BACKGROUND COLOR TO REMOVE WHEN ANOTHER TABLE SELECTED
  let prevTableId = sittingTable
    .querySelector(".active-table")
    ?.closest(".table-card");
  prevTableId?.classList.remove("active-table");

  // ADDING BACKGROUND COLOR TO SELECTED TABLE
  let tableId = sittingTable
    .querySelector(`#${event.target.id}`)
    ?.closest(".table-card");
  tableId.classList.add("active-table");

  // GETTING LAST-INDEX STRING FROM TABLE ID
  let bookingId = Number(tableId.id.slice(-1));

  popUp.innerHTML = `<table cellspacing="10"  class='bil-table' id='bill-table-${bookingId}'>
    <caption>
      <span>Table- <span id="booking-table-${bookingId}">${bookingId}</span> | Order details</span>
      <span class="close-icon"> <i class="fa-sharp fa-regular fa-circle-xmark"></i> </span>
    </caption>
    <thead>
      <tr>
        <th>S.no</th>
        <th>Item</th>
        <th>Price</th>
      </tr>
   </thead>
   <tbody>
         
   <tbody>
   <tfoot>
   <tr>
   <td  colspan="3">Total - <span id="overallAmount">0</span></td>
   <td  colspan="2"><button type="button">Bill</button></td>
   </tr>
   </tfoot>
   </table>`;

  //  CHECKING sessionStorage TO LOAD POPUP TABLE DATA DYNAMICALLY.
  JSON.parse(sessionStorage.getItem(bookingId))?.forEach((element, index) => {
    const menuRow = document.createElement("tr");
    menuRow.setAttribute("id", `orderItem-${element.id}`);
    menuRow.setAttribute("class", `orderItem`);
    menuRow.innerHTML = `
            <td id="item-${element.id}">${index + 1}</td>
            <td id="itemName-${element.id}">${element.name}</td>
            <td id="itemPrice-${element.id}">${element.totalItemPrice}</td>
            <td width="32%">
              <input type="number" name="itemQuantity" id="itemQuantity-${
                element.id
              }" min="1" value="${element.qty}"/>
            </td>
            <td>
              <i class="fa fa-trash" class='deleteOrder' id="deleteOrder-${
                element.id
              }" aria-hidden="true"></i>
            </td>`;

    document.querySelector("#overallAmount").textContent =
      Number(document.querySelector("#overallAmount").textContent) +
      element.totalItemPrice;
    document.querySelector("tbody").appendChild(menuRow);

    //********** UPDATE THE TOTALPRICE OF EACH ITEM BASED ON QYT INCREMENT *******************//
    document
      .querySelector("#itemQuantity-" + element.id)
      ?.addEventListener("change", (e) => {
        document.getElementById(`itemPrice-${element.id}`).textContent =
          element.price * e.target.value;

        // UPLOADING INTO sessionStorage OF UPDATED DATA
        const updatedtable = JSON.parse(sessionStorage.getItem(bookingId));
        let indx = -1;
        updatedtable.find((ele, index) => {
          if (Number(ele.id) === Number(element.id)) indx = index;
        });

        // STORING PREV TOTAL PRICE AND QTY OF EACH INDIVIDUAL ITEM
        let prevtotPriceOfEachItem = updatedtable[indx].totalItemPrice;
        let prevtotQtyOfEachItem = updatedtable[indx].qty;

        updatedtable[indx].totalItemPrice =
          updatedtable[indx].price * e.target.value;
        updatedtable[indx].qty = Number(e.target.value);
        sessionStorage.setItem(bookingId, JSON.stringify(updatedtable));

        // UPDATING OVER-ALL-AMOUNT TO PRESENT ON THE SCREEN OF POPUP-MESSAGE
        document.querySelector("#overallAmount").textContent =
          Number(document.querySelector("#overallAmount").textContent) +
          updatedtable[indx].totalItemPrice -
          Number(prevtotPriceOfEachItem);

        // UPDATING THE OVER-ALL-AMOUNT TO PRESENT ON THE SCREEN OF INDIVIDUAL TABLE SITTING
        document.querySelector(`#totalAmount-${bookingId}`).textContent =
          document.querySelector("#overallAmount").textContent;

        // UPDATING THE OVER-ALL-QTY TO PRESENT ON THE SCREEN OF INDIVIDUAL TABLE
        document.getElementById(`totalItems-${bookingId}`).textContent =
          Number(
            document.getElementById(`totalItems-${bookingId}`).textContent
          ) +
          Number(updatedtable[indx].qty) -
          Number(prevtotQtyOfEachItem);
      });

    //***** DELETE THE ORDER OF INDIVIDAUL ITEM FROM POPUP WHEN ICON CLICKED ****//
    const deleteOrder = document.getElementById(`deleteOrder-${element.id}`);

    deleteOrder.addEventListener("click", function () {
      //DATA IS DELETED FROM sessionStorage WHEN DELETE ICON CLICKED
      const IndiRow = JSON.parse(sessionStorage.getItem(bookingId));
      let indx = -1;
      IndiRow.find((row, index) => {
        if (Number(row.id) === element.id) {
          indx = index;
        }
      });

      let prevQty = IndiRow[indx].qty;
      let prevTot = IndiRow[indx].totalItemPrice;
      IndiRow.splice(indx, 1); //Remove an ele from the array based on index
      sessionStorage.setItem(bookingId, JSON.stringify(IndiRow));

      // ROW IS REMOVED FROM THE POPUP SCREEN
      document
        .querySelector("tbody")
        .removeChild(deleteOrder.closest(".orderItem"));

      //UPDATED THE SNO. IN POPUP SCREEN
      IndiRow.forEach((row, index) => {
        document.querySelector(`#item-${row.id}`).textContent = index + 1;
      });

      // UPDATING OVER-ALL-AMOUNT TO PRESENT ON THE SCREEN OF POPUP-MESSAGE
      document.querySelector("#overallAmount").textContent =
        Number(document.querySelector("#overallAmount").textContent) -
        Number(prevTot);

      // UPDATING THE OVER-ALL-AMOUNT TO PRESENT ON THE SCREEN OF INDIVIDUAL TABLE SITTING
      document.querySelector(`#totalAmount-${bookingId}`).textContent =
        document.querySelector("#overallAmount").textContent;

      // UPDATING THE OVER-ALL-QTY TO PRESENT ON THE SCREEN OF INDIVIDUAL TABLE
      document.getElementById(`totalItems-${bookingId}`).textContent =
        Number(document.getElementById(`totalItems-${bookingId}`).textContent) -
        Number(prevQty);
    });
  });

  // MAKING BACKGROUND HTML CONTENT UN-ACCESS WHEN POPUP TABLE DISPALYED
  document.getElementById("background-div").classList.add("background-div");

  // MAKING ANIMATION FOR POPUP TABLE
  popUp.classList.add("active");

  // CLOSING THE POPUP WHEN PRESSED ICON
  const closeIcon = document.querySelector(".fa-circle-xmark");
  closeIcon.addEventListener("click", () => {
    popUp.classList.remove("active");

    tableId.classList.remove("active-table");

    document
      .getElementById("background-div")
      .classList.remove("background-div");

    // REMOVING TABLE ELEMENT FROM HTML FILE AFTER ANIMATION EFFECT
    setTimeout(() => {
      popUp.innerHTML = "";
    }, 300);
  });
});
