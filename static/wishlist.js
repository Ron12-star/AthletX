document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript loaded!");
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productid;

      try {
        const response = await fetch("/Wishlist/add-to-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        const data = await response.json();
        alert(data.message);
        if (data.success) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error moving item to cart", error);
      }
    });
  });





document.querySelectorAll(".remove-from-wishlist").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const productId = event.target.dataset.productid;
    console.log("Product ID to remove:", productId); // Debugging
    try {
      const response = await fetch(`/Wishlist/remove/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      alert(data.message);
      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing item from wishlist", error);
    }
  });
});
});