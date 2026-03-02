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

  // ================= FILTER FUNCTION =================
  function applyFilters() {
    let minPrice = minPriceInput.value;
    let maxPrice = maxPriceInput.value;

    let selectedSubcategories = [];
    subcategoryCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedSubcategories.push(checkbox.value);
      }
    });

    const params = new URLSearchParams();
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    if (selectedSubcategories.length > 0) {
      params.append("subcategory", selectedSubcategories.join(","));
    }

    productContainer.style.opacity = "0.5";

    fetch(`${window.location.pathname}?${params.toString()}`, {
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((response) => response.text())
      .then((html) => {
        productContainer.innerHTML = html;
        productContainer.style.opacity = "1";

        //IMPORTANT: reattach add to cart events after filtering
        attachAddToCartEvents();
      })
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
      });
  }

  // ================= PRICE EVENTS =================
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

  // ================= SUBCATEGORY SEARCH =================
  function filterSubcategories() {
    const searchTerm = searchInput.value.toLowerCase();
    const labels = subcategoryList.querySelectorAll("label");

    labels.forEach((label) => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(searchTerm) ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterSubcategories);
  searchButton?.addEventListener("click", filterSubcategories);

  // Attach cart events on page load
  attachAddToCartEvents();
});


// ================= ADD TO CART =================
function attachAddToCartEvents() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-productid");
      addToCart(productId);
    });
  });
}

async function addToCart(productId) {
  try {
    const sessionResponse = await fetch("/session-status");
    const sessionData = await sessionResponse.json();

    if (!sessionData.loggedIn) {
      alert("Please log in first!");
      window.location.href = "/login";
      return;
    }

    const response = await fetch(`/add-to-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Product added to cart!");
    } else {
      alert("Error adding to cart.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}