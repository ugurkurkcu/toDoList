const mainSection = document.querySelector("#section-center");
const form = document.querySelector("#form");
const alert = document.querySelector(".alert");
const todos = document.querySelector("#todos");
const submitBtn = document.querySelector(".submit-btn");
const listContainer = document.querySelector(".list-container");
const list = document.querySelector("#list");
const clearBtn = document.querySelector(".clear-btn");

// Duzenleme Secenekleri
let editElement; // duzenleme yapilan oge
let editFlag = false; // duzenleme modunda olup olmadigini belirtir
let editID = ""; // benzersiz id

// Form gonderildiginde addItem fonksiyonunu cagir
form.addEventListener("submit", addItem);

// Listeyitemizle
clearBtn.addEventListener("click", clearAll);

// Sayfa yuklendiginde setup i cagirir
window.addEventListener("DOMContentLoaded", setupItems);
//! FUNCTIONS
function addItem(e) {
  e.preventDefault();
  const value = todos.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.classList.add("list-items");
    element.setAttributeNode(attr);

    // console.log(element);

    element.innerHTML = `
        <p class="item">${value}</p>
        <div class="btn-container">
          <button class="edit-btn" type="button">
            <i class="fa-solid fa-sliders"></i>
          </button>
          <button class="delete-btn" type="button">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

    `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
    //alert
    displayAlert("Added Successfully", "success", 1500);

    clearBtn.classList.add("show");

    //localStorage
    addToLocalStorage(id, value);

    //clear text in the input
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;

    displayAlert("Edited Successfully", "success", 1500);
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please Enter A Text !!!", "danger", 2500);
  }
}

//clear text in the input
function setBackToDefault() {
  todos.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}
//alert fonction

function displayAlert(text, action, time) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  mainSection.classList.add(`section-shadow-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
    mainSection.classList.remove(`section-shadow-${action}`);
  }, time);
}

//delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //   console.log(element)
  const id = element.dataset.id; // localStorage icin
  list.removeChild(element);

  if (list.children.length == 0) {
    clearBtn.classList.remove("show");
  }
  displayAlert("Removed Successfully", "danger", 1500);

  removeFromLocalStorage(id);
}

//edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  let itemsArray = getFromLocalStorage();

  todos.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id; // duzenlenen elementin id si

  submitBtn.textContent = "Edit";

  const id = itemsArray.forEach((e) => {
    if (editElement.innerHTML == e.value) {
      return e.id;
    }
  });

  editLocalStorage(id, todos.value);
}

//clear all items
function clearAll() {
  const items = document.querySelectorAll(".list-items");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
    clearBtn.classList.remove("show");
    setBackToDefault();

    displayAlert("There Is Nothing ToDo", "clear", 3000);
  }

  clearLocalStorage();
}

//add to localStorage
function addToLocalStorage(id, value) {
  const listItems = { id, value };
  let items = getFromLocalStorage();
  items.push(listItems);

  localStorage.setItem("list", JSON.stringify(items));
}

//get from localStorage
function getFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//setup localStorage items
function setupItems() {
  let items = getFromLocalStorage();
  items.forEach((e) => {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = e.id;
    element.classList.add("list-items");
    element.setAttributeNode(attr);

    // console.log(element);

    element.innerHTML = `
          <p class="item">${e.value}</p>
          <div class="btn-container">
            <button class="edit-btn" type="button">
              <i class="fa-solid fa-sliders"></i>
            </button>
            <button class="delete-btn" type="button">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
      `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
  });
}

//edit localStorage items
function editLocalStorage(id, value) {
  const itemsArray = getFromLocalStorage();

  itemsArray.forEach((e) => {
    if (e.id == id) {
      e.value = value;
    }
  });
  localStorage.setItem("list", JSON.stringify(itemsArray));
}

//remove from localStorage
function removeFromLocalStorage(id) {
  let items = getFromLocalStorage();

  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
const clearLocalStorage = () => {
  localStorage.clear();
};
