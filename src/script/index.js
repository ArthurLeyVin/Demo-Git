const productContainer = document.getElementById("products-container");
const categoryGrid = document.getElementById("category-grid");
const detailModal = document.getElementById("detail-modal");
const detailContent = document.getElementById("detail-content");
const closeModalBtn = document.getElementById("close-modal-btn");
const tabButtons = document.querySelectorAll(".tab-btn");
const searchInput = document.querySelector(".hero input[type='text']");

let allProducts = [];
let filteredProducts = [];
let productsToShow = 4;

// Fetch all products once
const fetchProducts = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    allProducts = await res.json();
    filteredProducts = [...allProducts]; // default show all
    showProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    productContainer.innerHTML =
      "<p class='text-red-500'>Failed to load products.</p>";
  }
};

// Show products
const showProducts = (reset = true) => {
  if (reset) productsToShow = 4;
  const products = filteredProducts.slice(0, productsToShow);

  productContainer.innerHTML = products
    .map(
      (product) => `
    <div class="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden flex flex-col 
            transform transition duration-300 ease-in-out 
            hover:-translate-y-2 hover:shadow-2xl hover:bg-blue-50 cursor-pointer">
  <div class="h-56 bg-gray-100 flex items-center justify-center">
    <img src="${product.image}" alt="${product.title}" class="object-contain h-full w-full p-3">
  </div>
  <div class="p-5 flex flex-col flex-grow">
    <h3 class="text-lg font-semibold text-gray-800 line-clamp-1">${product.title}</h3>
    <p class="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">${product.description}</p>
    <div class="flex items-center justify-between mt-4">
      <span class="text-xl font-bold text-orange-500">$${product.price}</span>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded detail-btn" data-id="${product.id}">
        View Details
      </button>
    </div>
  </div>
</div>

  `
    )
    .join("");

  attachDetailEvents();

  // Add "Load More" button if more products exist
  const existingLoadMore = document.getElementById("load-more-btn");
  if (filteredProducts.length > productsToShow) {
    if (!existingLoadMore) {
      const loadMoreBtn = document.createElement("button");
      loadMoreBtn.id = "load-more-btn";
      loadMoreBtn.textContent = "Load More";
      loadMoreBtn.className =
        "mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition";
      loadMoreBtn.addEventListener("click", () => {
        productsToShow += 4;
        showProducts(false);
      });
      productContainer.parentNode.appendChild(loadMoreBtn);
    }
  } else if (existingLoadMore) {
    existingLoadMore.remove();
  }
};

// Attach detail modal events
const attachDetailEvents = () => {
  const detailButtons = document.querySelectorAll(".detail-btn");
  detailButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const product = await res.json();

      detailContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center justify-center bg-gray-100 p-4 rounded">
            <img src="${product.image}" alt="${product.title}" class="object-contain h-64 w-full">
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">${product.title}</h3>
            <p class="text-gray-600 mb-4">${product.description}</p>
            <p class="text-3xl font-bold text-orange-500 mb-6">$${product.price}</p>
            <button class="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded">
              Add to Cart 🛒
            </button>
          </div>
        </div>
      `;
      detailModal.classList.remove("hidden");
    });
  });
};

// Close modal
closeModalBtn.addEventListener("click", () =>
  detailModal.classList.add("hidden")
);
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) detailModal.classList.add("hidden");
});

// Filter products by category
categoryGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;

  const category = card.getAttribute("data-category");
  filteredProducts = allProducts.filter((p) => p.category === category);
  showProducts();

  // Remove active from tabs
  tabButtons.forEach((b) => b.classList.remove("active"));
});

// Tab buttons functionality
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const type = btn.id.replace("btn-", "");
    if (type === "new") {
      filteredProducts = [...allProducts];
    } else if (type === "top") {
      filteredProducts = [...allProducts].sort(
        (a, b) => b.rating.rate - a.rating.rate
      );
    } else if (type === "popular") {
      filteredProducts = [...allProducts].sort(
        (a, b) => b.rating.count - a.rating.count
      );
    }

    showProducts();
  });
});

// Search functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  filteredProducts = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );
  showProducts();
});

// Initial load
fetchProducts();
