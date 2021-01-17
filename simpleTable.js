// simpleTable - an easy way to explore js objects in the DOM
var primaryObject;

function createElement(element, options) {
     // fast element creation with attributes, but potentially dangerous! no check if valid DOM element properties!
     let domObject = Object.assign(document.createElement(element), options);
     return domObject;
}

const determineStep = (number) => {
     let step;
     if (Number.isInteger(number)) {
          return 1;
     } else if (Number.isInteger(10 * number)) {
          return 0.1;
     } else if (Number.isInteger(100 * number)) {
          return 0.01;
     }
};

const createNumberInput = (id, number) => {
     let input = createElement("input", {
          type: "number",
          id: id,
          step: determineStep(number),
          defaultValue: number,
     });
     return input;
};

const createTextInput = (id, text) => {
     let input = createElement("input", {
          type: "text",
          id: id,
          defaultValue: text,
     });
     return input;
};
const createBooleanSelect = (value) => {
     let select = createElement("select"),
          yes = createElement("option", { value: true, textContent: "true" }),
          no = createElement("option", { value: false, textContent: "false" });
     if (value) {
          yes.selected = "selected";
     } else {
          no.selected = "selected";
     }
     select.appendChild(yes);
     select.appendChild(no);
     return select;
};

const setCaption = (tableName) => {};
const getColumnNumber = (element) => {
     return Array.from(element.parentNode.children).indexOf(element);
};

const toggleDisplay = (rowCollection) => {
     let toggleDirection=rowCollection[0].style.display === "none" ? "" : "none";
     rowCollection.forEach((element) => {
      //   element.style.display = toggleDirection;
          //let displayToggle = element.style.display === "none" ? "" : "none";
          element.style.setProperty("display", toggleDirection);
     });
};

const expand = (e) => {
     let currentTable = e.target.closest("table");
     let addressArray=e.target.dataset.address.split('_');
     let queryName=addressArray.reduce((accum, peice)=>accum + "." + peice,'tr' );
     console.log(addressArray,"address", queryName)
     let toggleRows = currentTable.querySelectorAll(  queryName );
     if (toggleRows.length > 0) { 
          // following filter keeps from effecting 'child' objects... maybe this should be hidden behind a flag?
     let newToggleRows=Array.prototype.filter.call(toggleRows, element=>element.classList.length==toggleRows.item(0).classList.length)

     console.log("toggleRows", newToggleRows, currentTable)
          let rows = toggleDisplay(newToggleRows);
     } else {
          //otherwise make rows for current object.
          let baseRow = e.target.parentNode.parentNode;
          let baseColumn = getColumnNumber(e.target.parentNode);
          let [primaryName, ...currentAddress] = addressArray;
          
          let currentObject = currentAddress.reduce(
               (accum, key) => accum[key],primaryObject
          );

          console.log(currentAddress, currentObject);
          makeSubRows(currentObject, baseRow, baseColumn, [primaryName, ...currentAddress]);
          console.log(
               " Making new rows after ",
               baseRow,
               "starting at column ",
               baseColumn
          );
     }
};

const formatCellValue = (key, value, address) => {
     let rowCell = document.createElement("td");
     if (typeof value === "number") {
          let input = createNumberInput(key, value);
          rowCell.appendChild(input);
     } else if (typeof value === "object") {
          let openButton = document.createElement("button");
          openButton.textContent = key;
          openButton.dataset.address = address;

          rowCell.appendChild(openButton);
          openButton.addEventListener("click", expand);
     } else if (typeof value === "string") {
          let input = createTextInput(key, value);
          rowCell.appendChild(input);
     } else if (typeof value === "function") {
          let readable = value.toString().replace(/;/g, ";<br>");
          rowCell.innerHTML = readable;
          rowCell.style["width"] = "120px";
     } else if (value === true || value === false) {
          let select = createBooleanSelect(value);
          rowCell.appendChild(select);
          select.style["width"] = "60px";
     }
     return rowCell;
};

const createTableRow = (key, value, columnPosition = 0, classNames) => {
     var row = document.createElement("tr");
     let propertyNameCell = document.createElement("td");
     console.log("classNames", classNames)

     let baseAddress=classNames.reduce((accum,entry)=>accum+"_"+entry);
    console.log(baseAddress, "baseAddress")

     let rowCell = formatCellValue(key, value, baseAddress+"_"+key);

     row.classList.add(...classNames);

     for (let i = 0; i < columnPosition; i++) {
          let td = document.createElement("td");
          row.appendChild(td);
     }
     propertyNameCell.textContent = key;
     propertyNameCell.classList = "key"; // applies class for styling...

     row.appendChild(propertyNameCell);
     row.appendChild(rowCell);
     return row;
};

const makeSubRows = (object, currentRow, keyColumn, classNames) => {
     console.log(object);
     let keys = Object.keys(object);
     let newClass = classNames;
     const nextSibling = currentRow.nextSibling;
  //   console.log("MakingSubRows column#", keyColumn);
     keys.forEach((key) => {
          let value = object[key];
          let newRow = createTableRow(key, value, keyColumn, classNames);
          let table = currentRow.parentNode;
          newRow.class = newClass;
          table.insertBefore(newRow, nextSibling);
     });
};

// make simpleTable a factory object with some methods!
const simpleTable = (targetObject) => {
     primaryObject = targetObject; // use a Global variable (module scoped actually...) to make available to 'expand' function
     let name=targetObject.name ? targetObject.name : 'targetObject'
     //Initializing creates Table.
     var table = document.createElement("table");
     let keys = Object.keys(targetObject);

     if (targetObject.name) {
          let caption = table.createCaption();
          caption.innerHTML = targetObject.name;
          table.id = targetObject.name;
     }
     console.log(name);
     document.body.appendChild(table);
     keys.forEach((key) => {
          let value = targetObject[key];
          var row = createTableRow(key, value, 0, [name]);
          table.appendChild(row);
     });
     // return a simpleTable object that can be interacted with.
     return {
          table, // the html object.
          targetObject, // the targetObject
     };
};

export { simpleTable };
