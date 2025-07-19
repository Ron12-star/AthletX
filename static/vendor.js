document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("productModal");
  const closeModal = document.querySelector(".close");
  const addProductBtn = document.querySelector(".add-product");
  const productForm = document.getElementById("productForm");
  const productIdInput = document.getElementById("productId");

  // Open modal when clicking "Add New Product"
  addProductBtn.addEventListener("click", () => {
    productForm.reset();
    productIdInput.value = "";
    modal.style.display = "block";
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  //add from my pc
  document
    .getElementById("productForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const form = document.getElementById("productForm");
      const formData = new FormData(form);

      try {
        const response = await fetch("http://localhost:7777/vendor-dashboard/add", {
          method: "POST",
          body: formData,
          credentials: "include", // ✅ if using session
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          alert("Product added!");
          form.reset();
        } else {
          alert(result.error || "Something went wrong");
        }
      } catch (err) {
        console.error("Error submitting form", err);
      }
    });
  // Handle Add / Update Product
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
      image: document.getElementById("image").value,
      name: document.getElementById("name").value,
      details: document.getElementById("details").value,
      quantity: Number(document.getElementById("quantity").value),
      price: Number(document.getElementById("price").value),
      sales: Number(document.getElementById("sales").value),
      discount: Number(document.getElementById("discount").value) || 0,
      category: document.getElementById("category").value,
      subcategory: document.getElementById("subcategory").value || "",
      bestseller: document.getElementById("bestseller").checked,
    };

    const productId = productIdInput.value;

    try {
      if (productId) {
        // Update Product
        await fetch(`/vendor-dashboard/update/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        // Add Product
        await fetch("/vendor-dashboard/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }
      modal.style.display = "none";
      location.reload();
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  });
});

// Delete Product Function
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await fetch(`/vendor-dashboard/delete/${id}`, { method: "DELETE" });
      location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}

// Edit Product Function
function editProduct(id) {
  const product = document.querySelector(
    `button[onclick="editProduct('${id}')"]`
  ).parentElement;

  document.getElementById("image").value = product.querySelector("img").src;
  document.getElementById("name").value = product.querySelector("h3").innerText;
  document.getElementById("details").value =
    product.querySelectorAll("p")[0].innerText;
  document.getElementById("quantity").value = parseInt(
    product.querySelectorAll("p")[1].innerText.split(": ")[1]
  );
  document.getElementById("price").value = parseFloat(
    product.querySelectorAll("p")[2].innerText.split("$")[1]
  );
  document.getElementById("sales").value = parseInt(
    product.querySelectorAll("p")[3].innerText.split(": ")[1]
  );
  document.getElementById("discount").value = parseFloat(
    product.querySelectorAll("p")[4].innerText.split("%")[0]
  );
  document.getElementById("category").value =
    product.getAttribute("data-category");
  document.getElementById("subcategory").value =
    product.getAttribute("data-subcategory") || "";
  document.getElementById("productId").value = id;
  document.getElementById("productModal").style.display = "block";
}
