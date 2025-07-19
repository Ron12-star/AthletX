// document.getElementById("category-search").addEventListener("input", function() {
//   let searchValue = this.value.toLowerCase();
//   let items = document.querySelectorAll("#category-list li");

//   items.forEach(item => {
//       let text = item.textContent.toLowerCase();
//       item.style.display = text.includes(searchValue) ? "block" : "none";
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("subcategorySearch");
  const searchButton = document.getElementById("subcategorySearchBtn");
  const subcategoryList = document.getElementById("subcategoryList");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const minPriceSlider = document.getElementById("price-min");
  const maxPriceSlider = document.getElementById("price-max");
  const subcategoryCheckboxes = document.querySelectorAll(
    "input[name='subcategory']"
  );
  const productContainer = document.getElementById("all-products");

  function applyFilters() {
    let minPrice = minPriceInput.value;
    let maxPrice = maxPriceInput.value;

    // Get selected subcategories
    let selectedSubcategories = [];
    subcategoryCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedSubcategories.push(checkbox.value);
      }
    });

    // Construct query parameters
    const params = new URLSearchParams();
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    if (selectedSubcategories.length > 0) {
      params.append("subcategory", selectedSubcategories.join(","));
    }

    // ✅ Smooth opacity effect instead of page reload
    productContainer.style.opacity = "0.5";

    // Fetch filtered products via AJAX
    fetch(`${window.location.pathname}?${params.toString()}`, {
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((response) => response.json())
      .then((data) => {
        productContainer.innerHTML = "";

        if (data.products.length === 0) {
          productContainer.innerHTML = "<p>No products found.</p>";
        } else {
          data.products.forEach((product) => {
            const productCard = `
    <div class="product-card">
      <img src="/${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.details}</p>
      <p class="price">₹ ${product.price}</p>
      ${
        product.discount > 0
          ? `<span class="discount">${product.discount}% Off</span>`
          : ""
      }
      <button class="add-to-cart" data-productid="${
        product._id
      }">ADD TO CART</button>
    </div>
  `;
            productContainer.innerHTML += productCard;
          });
        }

        // ✅ Restore smooth transition
        productContainer.style.opacity = "1";
      })
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
      });
  }

  minPriceSlider.addEventListener("input", () => {
    minPriceInput.value = minPriceSlider.value;
    applyFilters();
  });
  maxPriceSlider.addEventListener("input", () => {
    maxPriceInput.value = maxPriceSlider.value;
    applyFilters();
  });
  minPriceInput.addEventListener("change", applyFilters);
  maxPriceInput.addEventListener("change", applyFilters);
  subcategoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  function filterSubcategories() {
    const searchTerm = searchInput.value.toLowerCase();
    const labels = subcategoryList.querySelectorAll("label");

    labels.forEach((label) => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(searchTerm) ? "block" : "none";
    });
  }

  // Event listeners
  searchInput.addEventListener("input", filterSubcategories);
  searchButton.addEventListener("click", filterSubcategories);
});

//add to cart function

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-productid");
      addToCart(productId);
    });
  });
});

async function addToCart(productId) {
  console.log("Attempting to add product to cart. Product ID:", productId);
  try {
    const sessionResponse = await fetch("/session-status");
    const sessionData = await sessionResponse.json();

    if (!sessionData.loggedIn) {
      alert("Please log in first222222222222227777777222222!");
      window.location.href = "/login"; // Redirect to login page
      return;
    }
    const response = await fetch("/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    if (data.success) {
      alert("Product added to cart1");
    } else {
      alert("Error adding to cart.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
