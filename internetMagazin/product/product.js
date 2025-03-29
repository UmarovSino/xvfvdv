document.addEventListener("DOMContentLoaded", () => {
    // Элементы DOM
    const cartCounter = document.querySelector(".cart-counter");
    const cartItemsContainer = document.querySelector(".cart-items");
    const orderSummary = document.querySelector(".order-summary span");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    const closeModal = document.querySelector(".close-modal");
    const cartBtn = document.querySelector(".cart-btn");
    const productList = document.querySelectorAll("article");
    const priceRange = document.getElementById("priceRange");
    const priceDisplay = document.getElementById("priceDisplay");
    const selectProduct = document.querySelector(".selectproduct");
    const searchInput = document.querySelector(".search");

    let cart = [];

    // Инициализация корзины
    const initializeCart = () => {
        productList.forEach(product => {
            const cartIcon = createCartIcon();
            product.appendChild(cartIcon);
            setupProductHover(product, cartIcon);
            setupProductClick(product);
        });
    };

    // Создание иконки корзины
    const createCartIcon = () => {
        const cartIcon = document.createElement("i");
        cartIcon.className = "fa-solid fa-cart-plus cart-hover-icon";
        Object.assign(cartIcon.style, {
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "24px",
            color: "#fff",
            backgroundColor: "#000",
            borderRadius: "50%",
            padding: "8px",
            display: "none",
            cursor: "pointer"
        });
        return cartIcon;
    };

    // Настройка эффекта наведения
    const setupProductHover = (product, cartIcon) => {
        product.style.position = "relative";

        product.addEventListener("mouseover", () => {
            product.style.cssText = `
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                transform: scale(1.05);
                transition: transform 0.3s, box-shadow 0.3s;
            `;
            cartIcon.style.display = "block";
        });

        product.addEventListener("mouseout", () => {
            product.style.cssText = "box-shadow: none; transform: scale(1);";
            cartIcon.style.display = "none";
        });
    };

    // Обработка кликов по товару
    const setupProductClick = (product) => {
        const handler = (event) => {
            event.stopPropagation();
            const productData = {
                id: product.querySelector("h2").textContent,
                name: product.querySelector("h2").textContent,
                price: parseFloat(product.dataset.price),
                image: product.querySelector("img").src
            };
            addToCart(productData);
        };

        product.addEventListener("click", handler);
        product.querySelector(".cart-hover-icon").addEventListener("click", handler);
    };

    // Логика корзины
    const addToCart = (productData) => {
        const existingProduct = cart.find(item => item.id === productData.id);
        existingProduct ? existingProduct.quantity++ : cart.push({ ...productData, quantity: 1 });
        updateCartUI();
    };

    const updateCartUI = () => {
        cartCounter.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        renderCartItems();
        updateOrderSummary();
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = "";
        cart.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="63">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="quantity-controls">
                        <button class="decrement" data-id="${item.id}">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increment" data-id="${item.id}">+</button>
                    </div>
                    <p>€${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;

            cartItem.querySelector(".increment").addEventListener("click", () => incrementQuantity(item.id));
            cartItem.querySelector(".decrement").addEventListener("click", () => decrementQuantity(item.id));
            cartItem.querySelector(".remove-item").addEventListener("click", () => removeFromCart(item.id));

            cartItemsContainer.appendChild(cartItem);
        });
    };

    const updateOrderSummary = () => {
        orderSummary.textContent = `€${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`;
    };

    const incrementQuantity = (id) => {
        cart.find(item => item.id === id).quantity++;
        updateCartUI();
    };

    const decrementQuantity = (id) => {
        const item = cart.find(item => item.id === id);
        item.quantity > 1 ? item.quantity-- : removeFromCart(id);
        updateCartUI();
    };

    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };



    // Фильтрация товаров
    const initializeFilters = () => {
        loadFiltersFromStorage();

        priceRange.addEventListener("input", () => {
            priceDisplay.textContent = priceRange.value;
            filterProducts();
            saveFiltersToStorage();
        });

        selectProduct.addEventListener("change", () => {
            filterProducts();
            saveFiltersToStorage();
        });

        searchInput.addEventListener("input", () => {
            filterProducts();
            saveFiltersToStorage();
        });
    };

    const filterProducts = () => {
        const maxPrice = parseFloat(priceRange.value);
        const selectedBrand = selectProduct.value.toLowerCase();
        const searchText = searchInput.value.toLowerCase();

        productList.forEach(product => {
            const productPrice = parseFloat(product.dataset.price);
            const productBrand = product.dataset.brand.toLowerCase();
            const productName = product.querySelector("h2").textContent.toLowerCase();

            const shouldShow = productPrice <= maxPrice &&
                (selectedBrand === "all" || productBrand === selectedBrand) &&
                productName.includes(searchText);

            product.style.display = shouldShow ? "block" : "none";
        });
    };

    // Работа с localStorage
    const loadFiltersFromStorage = () => {
        priceRange.value = localStorage.getItem("priceRange") || priceRange.value;
        priceDisplay.textContent = priceRange.value;
        selectProduct.value = localStorage.getItem("selectedBrand") || "all";
        searchInput.value = localStorage.getItem("searchText") || "";
        filterProducts();
    };

    const saveFiltersToStorage = () => {
        localStorage.setItem("priceRange", priceRange.value);
        localStorage.setItem("selectedBrand", selectProduct.value);
        localStorage.setItem("searchText", searchInput.value);
    };

    // Управление модальным окном
    const toggleModal = () => {
        modalBackdrop.style.display = modalBackdrop.style.display === "block" ? "none" : "block";
    };

    cartBtn.addEventListener("click", toggleModal);
    closeModal.addEventListener("click", toggleModal);
    modalBackdrop.addEventListener("click", (event) => {
        if (event.target === modalBackdrop) toggleModal();
    });


    // Инициализация приложения
    initializeCart();
    initializeFilters();
});

