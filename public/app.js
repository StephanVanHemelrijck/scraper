"use strict";

window.onload = async () => {
  const $ = await scrapeData();

  renderCategories($.categories);
  // Render default category items
  renderCategoryItems($.categories[0]);
  assignEventListenersToCategories($);
};

function assignEventListenersToCategories($) {
  // Add event listeners
  const categories = document.querySelectorAll(".category");
  categories.forEach((c) => {
    c.addEventListener("click", () => {
      // Remove active class from all categories
      categories.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked category
      c.classList.add("active");

      // Get category name
      const categoryName = c.textContent;

      // Get category from categories
      const category = $.categories.find((c) => c.name === categoryName);

      // Render category items
      renderCategoryItems(category);
    });
  });
}

async function scrapeData() {
  const response = await fetch("/scrape");
  return await response.json();
}

function renderCategories(categories) {
  const categoriesContainer = document.querySelector(".categories");
  categories.forEach((category, index) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");
    categoryElement.textContent = category.name;
    categoriesContainer.appendChild(categoryElement);
    // set first category to active
    if (index === 0) categoryElement.classList.add("active");
  });
}

function renderCategoryItems(category) {
  // render only items from selected category
  // render items in a grid
  // render item image
  // render item name
  // render item brand
  // render item color amount
  // render item price

  const itemsContainer = document.querySelector(".category-items-container");
  itemsContainer.innerHTML = "";

  category.items.forEach((item, index) => {
    if (index > 7) return;

    const itemElement = document.createElement("div");
    itemElement.classList.add("item");

    const itemImage = document.createElement("img");
    itemImage.classList.add("item-image");
    itemImage.src = item.image;
    itemElement.appendChild(itemImage);

    const itemName = document.createElement("div");
    itemName.classList.add("item-name");
    itemName.textContent = item.name;
    itemElement.appendChild(itemName);

    const itemBrand = document.createElement("div");
    itemBrand.classList.add("item-brand");
    itemBrand.textContent = item.brand;
    itemElement.appendChild(itemBrand);

    const itemColorAmount = document.createElement("div");
    itemColorAmount.classList.add("item-color-amount");
    itemColorAmount.textContent = item.color_amount;
    itemElement.appendChild(itemColorAmount);

    const itemPrice = document.createElement("div");
    itemPrice.classList.add("item-price");
    itemPrice.textContent = item.price;
    itemElement.appendChild(itemPrice);

    itemsContainer.appendChild(itemElement);
  });
}
