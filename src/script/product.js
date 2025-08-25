const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll("header nav a");
const mobileNavLinks = document.querySelectorAll("#mobile-menu a");
const searchInput = document.getElementById("search");
const productContainer = document.getElementById("product-container");
const detailModal = document.getElementById("detail-modal");
const detailContent = document.getElementById("detail-content");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeModal = document.getElementById("closeModal");

const isAdmin = true;

const addProductBtnDesktop = document.getElementById("add-product-btn-desktop");
const addProductLinkMobile = document.getElementById("add-product-link-mobile");

if (isAdmin) {
  addProductBtnDesktop.classList.remove("hidden");
  addProductLinkMobile.classList.remove("hidden");
}

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("-translate-x-full");
  mobileMenu.setAttribute("aria-hidden", "false");
  overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  mobileMenu.classList.add("-translate-x-full");
  mobileMenu.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
}

function handleNavLinkClick(e) {
  const allLinks = document.querySelectorAll("nav a");
  allLinks.forEach((item) => item.classList.remove("active-link"));
  this.classList.add("active-link");
  closeMenu();
}

navLinks.forEach((link) => {
  link.addEventListener("click", handleNavLinkClick);
});
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", handleNavLinkClick);
});

const currentPath = window.location.pathname;
const allLinks = document.querySelectorAll("nav a");
allLinks.forEach((link) => {
  if (link.getAttribute("href") === "#" + currentPath.substring(1)) {
    link.classList.add("active-link");
  }
});

const allProducts = [];
const BASE_URL = "https://fakestoreapi.com";

const getProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    productContainer.innerHTML = `<p class="text-red-500 col-span-full text-center">⚠️ ${error.message}</p>`;
    return [];
  }
};

const renderProducts = (products) => {
  if (products.length === 0) {
    productContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">No products found.</p>`;
    return;
  }

  const cards = products
    .map((product) => {
      const imgUrl =
        product.image && product.image.startsWith("http")
          ? product.image
          : "https://via.placeholder.com/300x200?text=No+Image";
      return `
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

          `;
    })
    .join("");

  productContainer.innerHTML = cards;

  document.querySelectorAll(".detail-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      showProductDetails(productId);
    });
  });
};

const showProductDetails = (id) => {
  const product = allProducts.find((p) => p.id == id);
  if (!product) {
    return;
  }

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
};

const filterProducts = (searchTerm) => {
  const filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  renderProducts(filteredProducts);
};

(async () => {
  const products = await getProducts();
  allProducts.push(...products);
  renderProducts(allProducts.slice(0, 20));

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    filterProducts(searchTerm);
  });
})();

closeModalBtn.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});
closeModal.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});
window.addEventListener("click", (e) => {
  if (e.target === detailModal) {
    detailModal.classList.add("hidden");
  }
});
