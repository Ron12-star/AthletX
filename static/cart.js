document.addEventListener("click", async (event) => {
    const target = event.target;

    // Remove Item
    if (target.classList.contains("remove-btn")) {
        const productId = target.dataset.productid;

        try {
          const response = await fetch(`/add-to-cart/${productId}`, {
    method: "DELETE"
});

            const data = await response.json();

            if (data.success) {
                target.closest(".cart-item").remove();

                if (data.totalPrice !== undefined) {
                    document.getElementById("total-price").innerText =
                        parseFloat(data.totalPrice).toFixed(2);
                } else {
                    updateTotalPrice();
                }

            } else {
                alert("Failed to remove item.");
            }

        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

    // Increase
    if (target.innerText.trim() === "+") {
        updateQuantity(target, 1);
    }

    // Decrease
    if (target.innerText.trim() === "-") {
        updateQuantity(target, -1);
    }
});

async function updateQuantity(button, change) {

    const productId = button.dataset.productid;
    const quantityElement = document.getElementById(`quantity-${productId}`);
    const itemTotalElement = document.getElementById(`total-item-price-${productId}`);

    if (!quantityElement) return;

    const oldQuantity = parseInt(quantityElement.innerText);
    const newQuantity = Math.max(1, oldQuantity + change);

    try {
        const response = await fetch("/add-to-cart/update-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: newQuantity }),
        });

        const data = await response.json();

        if (data.success) {

            quantityElement.innerText = newQuantity;

            const price = parseFloat(itemTotalElement.dataset.price);
            const discount = parseFloat(itemTotalElement.dataset.discount);

            const itemTotal = newQuantity * price * (1 - discount / 100);

            itemTotalElement.innerText = `Total: $${itemTotal.toFixed(2)}`;

            document.getElementById("total-price").innerText =
                parseFloat(data.totalPrice).toFixed(2);

        } else {
            alert("Failed to update quantity.");
        }

    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}

function updateTotalPrice() {
    let total = 0;

    document.querySelectorAll(".cart-item").forEach(item => {

        const totalElement = item.querySelector("[id^='total-item-price-']");
        if (!totalElement) return;

        const price = parseFloat(totalElement.dataset.price);
        const discount = parseFloat(totalElement.dataset.discount);

        const quantityId = totalElement.id.replace("total-item-price-", "quantity-");
        const quantityElement = document.getElementById(quantityId);

        const quantity = parseInt(quantityElement.innerText);

        total += quantity * price * (1 - discount / 100);
    });

    document.getElementById("total-price").innerText = total.toFixed(2);
}

document.querySelector(".checkout-btn").addEventListener("click", () => {
    window.location.href = "/checkout";
});