document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed.");

  // Remove discount wrapper when close button is clicked
  const closeButton = document.getElementById("closeButton");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const discountElement = document.getElementById("discount");
      if (discountElement) {
        discountElement.remove();
      }
    });
  } else {
    console.warn("Close button not found.");
  }

  // Add to Cart functionality
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-productid");
      addToCart(productId);
    });
  });

  // Add to Wishlist functionality
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-productid");
      addToWishlist(productId);
    });
  });

  // Initialize product sliders
  setupProductSlider("lowDiscountContainer");
  // Initialize both carousels
  setupCarouselSlider(".carousel-container");
});

// Add to Cart Function
async function addToCart(productId) {
  try {
    const sessionResponse = await fetch("/session-status");
    const sessionData = await sessionResponse.json();

    if (!sessionData.loggedIn) {
      alert("Please log in first!");
      window.location.href = "/login";
      return;
    }

    const response = await fetch("/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    alert(data.success ? "Product added to cart!" : "Error adding to cart.");
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

// Add to Wishlist Function
async function addToWishlist(productId) {
  try {
    const sessionResponse = await fetch("/session-status");
    const sessionData = await sessionResponse.json();

    if (!sessionData.loggedIn) {
      alert("Please log in first!");
      window.location.href = "/login";
      return;
    }

    const response = await fetch("/Wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    alert(
      data.success ? "Product added to Wishlist!" : `Error: ${data.message}`
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
}

// Setup Scrollable Product Sliders
function setupSlider(containerId) {
  const container = document.querySelector(`#${containerId} .product-slider`);
  if (!container) {
    console.warn(`Slider container not found for ${containerId}`);
    return;
  }

  const scrollLeftBtn = document.querySelector(
    `.scroll-left[data-target="${containerId}"]`
  );
  const scrollRightBtn = document.querySelector(
    `.scroll-right[data-target="${containerId}"]`
  );

  if (!scrollLeftBtn || !scrollRightBtn) {
    console.warn(`Scroll buttons missing for ${containerId}`);
    return;
  }

  let scrollAmount = 0;
  const cardWidth = 240;
  const visibleCards = 4;
  const totalCards = container.children.length;
  const maxScroll = (totalCards - visibleCards) * cardWidth;

  scrollLeftBtn.addEventListener("click", function () {
    if (scrollAmount > 0) {
      scrollAmount -= cardWidth;
      container.style.transform = `translateX(-${scrollAmount}px)`;
    }
  });

  scrollRightBtn.addEventListener("click", function () {
    if (scrollAmount < maxScroll) {
      scrollAmount += cardWidth;
      container.style.transform = `translateX(-${scrollAmount}px)`;
    }
  });
}

// Scroll Function for Product Containers
function scroll(direction, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.scrollBy({
    left: direction === "left" ? -300 : 300,
    behavior: "smooth",
  });
}

// Toggle Product View (Expand/Collapse)
function toggleView(containerId, buttonId) {
  const wrapper = document.getElementById(containerId);
  const slider = wrapper.querySelector(".product-slider");
  const button = document.getElementById(buttonId);

  if (!wrapper || !slider || !button) return;

  wrapper.classList.toggle("expanded");
  slider.style.flexWrap = wrapper.classList.contains("expanded")
    ? "wrap"
    : "nowrap";
  button.innerText = wrapper.classList.contains("expanded")
    ? "Collapse View"
    : "Show All Products";
}

// Function for carousel sliders
function setupCarouselSlider(selector) {
  document.querySelectorAll(selector).forEach((carouselContainer) => {
    const carousel = carouselContainer.querySelector(".carousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".slide");
    const prevBtn = carouselContainer.querySelector(".scroll-left");
    const nextBtn = carouselContainer.querySelector(".scroll-right");

    let currentIndex = 0;
    const totalSlides = slides.length;

    function moveSlide(direction) {
      currentIndex =
        direction === "next"
          ? (currentIndex + 1) % totalSlides
          : (currentIndex - 1 + totalSlides) % totalSlides;

      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      carousel.style.transition = "transform 0.5s ease-in-out";
    }

    if (prevBtn) prevBtn.addEventListener("click", () => moveSlide("prev"));
    if (nextBtn) nextBtn.addEventListener("click", () => moveSlide("next"));

    setInterval(() => moveSlide("next"), 5000);
  });
}

// Function for product sliders (high & low discount)
function setupProductSlider(containerId) {
  const container = document.querySelector(`#${containerId} .product-slider`);
  const wrapper = document.querySelector(`#${containerId} .scroll-wrapper`);
  
  if (!container || !wrapper) return;

  const scrollLeftBtn = document.querySelector(
      `.scroll-btn.scroll-left[data-target="product_list"]`
  );
  const scrollRightBtn = document.querySelector(
      `.scroll-btn.scroll-right[data-target="product_list"]`
  );

  if (!scrollLeftBtn || !scrollRightBtn) return;

  let scrollAmount = 0;
  const cardWidth = container.querySelector(".product-card")?.offsetWidth || 250;
  const totalCards = container.children.length;
  const visibleCards = Math.floor(wrapper.offsetWidth / cardWidth);
  const maxScroll = Math.max(0, (totalCards - visibleCards) * cardWidth);

  scrollLeftBtn.addEventListener("click", function () {
      scrollAmount = Math.max(0, scrollAmount - cardWidth);
      container.style.transform = `translateX(-${scrollAmount}px)`;
  });

  scrollRightBtn.addEventListener("click", function () {
      scrollAmount = Math.min(maxScroll, scrollAmount + cardWidth);
      container.style.transform = `translateX(-${scrollAmount}px)`;
  });
}

