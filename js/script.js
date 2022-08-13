"use strict";

// Global Variables
const addCategoryCont = document.querySelector(".add-category-cont");
const addCategoryForm = document.getElementById("add-category-form");
const categoryNameInput = document.getElementById("category-name");
const formsContainer = document.getElementById("forms-container");
const categoryCont = document.getElementById("category-cont");
const closeForm = document.querySelectorAll(".close-form");
const confirmDeleteCont = document.querySelector(".confirm-delete-cont");
const bookmarkFormCont = this.document.querySelector(".bookmark-form-cont");
const bookmarkNameInput = document.getElementById("bookmark-name");
const bookmarkUrlInput = document.getElementById("bookmark-url");
const addBookmarkForm = document.getElementById("add-bookmark-form");

let categories = {};
let setCategory = "";

// Helper function to Show Add Category and Add Bookmark, focus on input.
function showAddForms(form, formInput) {
  formsContainer.classList.add("show-cont");
  form.hidden = false;
  formInput.focus();
}

// Set Local storage for categories object and update DOM
function setLocalStorage() {
  localStorage.setItem("Categories", JSON.stringify(categories));
  constructCategory();
}

// Store Bookmarks data in local storage.
function storeBookmark(event, category) {
  event.preventDefault();
  // Capture add-bookmark url input value. Set it as key and value for bookmark object.
  categories = JSON.parse(localStorage.getItem("Categories"));
  categories[category][bookmarkUrlInput.value] = {
    name: bookmarkNameInput.value,
    url: bookmarkUrlInput.value,
  };

  setLocalStorage();
  addBookmarkForm.reset();
  bookmarkNameInput.focus();
}

// Store Category data in local storage.
function storeCategory(event) {
  event.preventDefault();
  // Capture add-category input value. Set it as key and value for categories object.
  const categoryName = categoryNameInput.value;
  categories[categoryName]
    ? alert("Category Name Already exits!")
    : (categories[categoryName] = {});

  setLocalStorage();
  addCategoryForm.reset();
  categoryNameInput.focus();
}

// Helper function to Hide containers
function hide() {
  formsContainer.classList.remove("show-cont");
  addCategoryCont.hidden = true;
  bookmarkFormCont.hidden = true;
  confirmDeleteCont.hidden = true;
}

// ------------------------------------------------------------------>
// Construct and fetch Categories. Add them to the DOM.
function constructCategory() {
  // Reset all content in Bookmark Container.
  categoryCont.textContent = "";
  // Check if localStorage has any data.
  localStorage.getItem("Categories")
    ? (categories = JSON.parse(localStorage.getItem("Categories")))
    : (categories = {});

  //Build and add Categories to the DOM.
  Object.keys(categories).forEach((category) => {
    // Category Section
    const categorySection = document.createElement("section");
    categorySection.setAttribute("id", "category-section");
    // Category Delete Icon.
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-minus-circle", "delete");
    deleteIcon.setAttribute("title", "Delete Category");
    deleteIcon.setAttribute("onclick", `showConfirmDelete("${category}")`);
    // Category title - H1.
    const categoryTitle = document.createElement("h2");
    categoryTitle.classList.add("category-title");
    categoryTitle.textContent = category;
    // Category Content - Div
    const categoryContent = document.createElement("div");
    categoryContent.classList.add("category-content", "custom-scroll");

    // Add Bookmark button
    const addBookmarkBtn = document.createElement("button");
    addBookmarkBtn.classList.add("add-bookmark-btn");
    addBookmarkBtn.addEventListener("click", () => {
      showAddForms(bookmarkFormCont, bookmarkNameInput);
      setCategory = category;
      return setCategory;
    });
    addBookmarkBtn.textContent = "Add Bookmark";
    //Append Elements
    constructBookmark(categoryContent, category);
    categorySection.append(
      deleteIcon,
      categoryTitle,
      categoryContent,
      addBookmarkBtn
    );
    categoryCont.appendChild(categorySection);
  });
}

// Show Delete Category container.
let deleteThisCategory = "";

function showConfirmDelete(category) {
  formsContainer.classList.add("show-cont");
  confirmDeleteCont.hidden = false;
  document.querySelector(
    ".confirm-delete-header h3"
  ).textContent = `Delete ${category} Category`;
  // Enable close form
  hideCont(2);
  // Store category value. It will help to delete Category.
  return (deleteThisCategory = category);
}

// Delete Category
const confirm = (bool) => {
  // If bool true delete, otherwise close confirm container.
  bool ? (deleteCategory(deleteThisCategory), hide()) : hide();
};

function deleteCategory(category) {
  if (categories[category]) {
    delete categories[category];
  }
  // Update object in localStorage and update DOM
  setLocalStorage();
}

// ------------------------------------------------------------------>
// Construct and fetch Bookmarks. Append to its category container.
function constructBookmark(categoryContent, category) {
  // Get data from localStorage
  let data = JSON.parse(localStorage.getItem("Categories"));

  Object.keys(data[category]).forEach((bookmark) => {
    const { name, url } = data[category][bookmark];
    // Bookmark Container
    const bookmarkCont = document.createElement("div");
    bookmarkCont.classList.add("bookmark");
    // Bookmark Delete Icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-minus-circle");
    deleteIcon.setAttribute("title", "Delete Bookmark");
    deleteIcon.addEventListener("click", () => {
      deleteBookmark(category, bookmark);
    });
    // Bookmark Favicon Image
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Bookmark link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append
    bookmarkCont.append(deleteIcon, favicon, link);
    categoryContent.appendChild(bookmarkCont);
  });
}
// Delete Bookmark
function deleteBookmark(category, bookmark) {
  delete categories[category][bookmark];

  // Update Local storage and update DOM
  setLocalStorage();
}

// Event Listeners ----------------------------------------------->

// Show Add Category
document.querySelector(".add-category-btn").addEventListener("click", () => {
  showAddForms(addCategoryCont, categoryNameInput);
});

// Close Form Containers Dinamically.
function hideCont(index) {
  closeForm[index].addEventListener("click", () => {
    hide();
  });
}

// Store Categories and Bookmarks dinamically.
addCategoryForm.addEventListener("submit", storeCategory);
addBookmarkForm.addEventListener("submit", (event) => {
  storeBookmark(event, setCategory);
});

// On Load
constructCategory();
hideCont(0);
hideCont(1);
