// simpleTable - an easy way to explore js objects in the DOM

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

const setCaption=(tableName)=>{

}
const getColumnNumber = (element) => {
  return Array.from(element.parentNode.children).indexOf(element);
};



const toggleDisplay = (rowCollection) => {
  rowCollection.forEach((element) => {
    let displayToggle = element.style.display === "none" ? "" : "none";
    element.style.setProperty("display", displayToggle);
  });
};

const expand = (e) => {
  let currentRow = e.target.parentNode.parentNode;
  let currentTable = e.target.closest('table');
  let toggleRows = currentTable.querySelectorAll("tr." + currentRow.dataset.name);
  //    try to toggle display of current object's rows
  if (toggleRows.length > 0) {
    let rows = toggleDisplay(toggleRows);
  } else {
    //otherwise make rows for current object.
    let baseRow = e.target.parentNode.parentNode;
    let baseColumn = getColumnNumber(e.target.parentNode);
    makeSubRows(e.target.myObject, baseRow, baseColumn, baseRow.dataset.name);
    console.log(
      " Making new rows after ",
      baseRow,
      "starting at column ",
      baseColumn
    );
  }
};

const formatCellValue = (key, value) => {
  let rowCell = document.createElement("td");

  if (typeof value === "number") {

    let input = createNumberInput(key, value);
    rowCell.appendChild(input);

  } else if (typeof value === "object") {

    let openButton = document.createElement("button");
    openButton.textContent = key;
    openButton.myObject = value;
    rowCell.appendChild(openButton);
    openButton.addEventListener("click", expand);

  } else if (typeof value === "string") {
    let input = createTextInput(key, value);
    rowCell.appendChild(input);

  } else if (typeof value === "function") {
    let readable = value.toString().replace(/;/g, ';<br>');
    rowCell.innerHTML= readable;
    rowCell.style["width"] = "120px";

  } else if (value === true || value === false) {
    let select = createBooleanSelect(value);
    rowCell.appendChild(select);
    select.style["width"] = "60px";
  }
  return rowCell;
};

const createTableRow = (key, value, columnPosition = 0, baseId) => {
  var row = document.createElement("tr");
  let propertyNameCell = document.createElement("td");
  let inputId = baseId ? `${baseId}_${key}` : key;
  let rowCell = formatCellValue(inputId, value);

  row.dataset.name = inputId; // dataset.name used by 'expand' listener.
  if (baseId) {
    row.classList.add(baseId);
  }

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

const makeSubRows = (object, currentRow, keyColumn, parentName) => {
  let keys = Object.keys(object);
  let newClass = parentName;
  const nextSibling = currentRow.nextSibling;
  console.log("MakingSubRows column#", keyColumn);
  keys.forEach((key) => {
    let value = object[key];
    let newRow = createTableRow(key, value, keyColumn, parentName);
    let table = currentRow.parentNode;
    newRow.class = newClass;
    table.insertBefore(newRow, nextSibling);
  });
};

// make simpleTable a factory object with some methods!
const simpleTable = (targetObject) => {
  //Initializing creates Table.
  var table = document.createElement("table");
  let keys = Object.keys(targetObject);
  
  if (targetObject.name){
    let caption=table.createCaption();
    caption.innerHTML = targetObject.name; 
    table.id=targetObject.name;
  }

  document.body.appendChild(table);
  keys.forEach((key) => {
    let value = targetObject[key];
    var row = createTableRow(key, value, 0, targetObject.name);
    table.appendChild(row);
  });
  // return a simpleTable object that can be interacted with.
  return {
    table,        // the html object.
    targetObject, // the targetObject
  }
};

export { simpleTable };
