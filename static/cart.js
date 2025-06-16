document.addEventListener("click", async (event) => {
    const target = event.target; // Ensure `target` is defined

    // 🛑 Remove Item from Cart
    if (target.classList.contains("remove-btn")) {
        const productId = target.dataset.productid;
        console.log("🛑 Remove button clicked for Product ID:", productId);

        try {
            const response = await fetch(`/add-to-cart/${productId}`, { method: "DELETE" });
            const data = await response.json();

            if (data.success) {
                alert("Item removed from cart!");
                target.closest(".cart-item").remove(); // Remove item from UI without reloading
                updateTotalPrice();
            } else {
                alert("Failed to remove item.");
            }
        } catch (error) {
            console.error("Error removing item from cart", error);
        }
    }

    // ➕ Increase Quantity
    if (target.classList.contains("increase-btn")) {
        updateQuantity(target, 1);
    }

    // ➖ Decrease Quantity
    if (target.classList.contains("decrease-btn")) {
        updateQuantity(target, -1);
    }
});

// ✅ Function to Update Quantity Instantly
async function updateQuantity(button, change) {
    if (!button) return; // Prevent error if button is undefined
    const productId = button.dataset.productid;

    if (!productId) {
        console.error("❌ Product ID is missing from the button dataset.");
        return;
    }

    const quantityElement = document.getElementById(`quantity-${productId}`);
    const itemTotalElement = document.getElementById(`total-item-price-${productId}`);

    // 🛑 Ensure the element exists before using `innerText`
    if (!quantityElement) {
        console.error(`❌ Element with ID 'quantity-${productId}' not found in the DOM.`);
        return;
    }

    let quantity = parseInt(quantityElement.innerText);
    if (isNaN(quantity)) {
        console.error(`❌ Invalid quantity value for product ${productId}.`);
        return;
    }

    const newQuantity = Math.max(1, quantity + change); // Prevent going below 1
    const oldQuantity = quantity;
    quantityElement.innerText = newQuantity; // Instantly update UI before request completes

    try {
        const response = await fetch("/add-to-cart/update-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: newQuantity }),
        });

        const data = await response.json();
        if (data.success) {
            updateTotalPrice(data.totalPrice); // Update total price from response
            if (itemTotalElement) {
                const price = parseFloat(itemTotalElement.dataset.price);
                const discount = parseFloat(itemTotalElement.dataset.discount);
                itemTotalElement.innerText = `Total: $${(newQuantity * price * (1 - discount / 100)).toFixed(2)}`;
            } else {
                console.error(`❌ Element with ID 'total-item-price-${productId}' not found.`);
            }
            updateTotalPrice();
        }
        else{
             
                alert("Failed to update quantity.");
                quantityElement.innerText = quantity; // Revert change on failure
        }
       
    } catch (error) {
        console.error("Error updating quantity", error);
        quantityElement.innerText = oldQuantity; // Revert back in case of error
    }
}

// ✅ Function to Update Total Price Instantly
function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll(".cart-item").forEach(item => {
        const quantityElement = item.querySelector(".quantity");
        const priceElement = item.querySelector("[data-price]");
        const discountElement = item.querySelector("[data-discount]");
        if (!quantityElement || !priceElement || !discountElement) {
            console.error("❌ Missing elements inside .cart-item", item);
            return;
        }
        const quantity = parseInt(quantityElement.innerText);
        const price = parseFloat(priceElement.dataset.price);
        const discount = parseFloat(discountElement.dataset.discount);

        const itemTotal = quantity * price * (1 - discount / 100);
        item.querySelector("p strong");
        const totalItemPriceElement = item.querySelector("p strong");
        if (totalItemPriceElement) {
            totalItemPriceElement.innerText = `Total: $${itemTotal.toFixed(2)}`;
        } else {
            console.error("❌ totalItemPriceElement not found inside .cart-item", item);
        }

        total += itemTotal;
    });

    // ✅ Ensure the total price element exists
    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        totalPriceElement.innerText = total.toFixed(2);
    } else {
        console.error("❌ Total price element not found in the DOM.");
    }
}



document.querySelector(".checkout-btn").addEventListener("click",()=>{
    window.location.href="/checkout"
})