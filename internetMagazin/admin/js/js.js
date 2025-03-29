document.addEventListener("DOMContentLoaded", () => {
    // ===== Элементы DOM =====
    const productForm = document.getElementById("product-form");
    const editForm = document.getElementById("edit-form");
    const cancelEdit = document.getElementById("cancelEdit");
    const productList = document.getElementById("productList");
    const cartDataContainer = document.getElementById("cart-data");
    const productNameInput = document.getElementById("productName");
    const productPriceInput = document.getElementById("productPrice");
    const productCategoryInput = document.getElementById("productCategory");
    const editNameInput = document.getElementById("editName");
    const editPriceInput = document.getElementById("editPrice");
    const editCategoryInput = document.getElementById("editCategory");

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let currentEditId = null;

    // ===== Функции для работы с товарами =====

    // Рендер списка товаров
    const renderProductList = () => {
        productList.innerHTML = "";
        products.forEach(product => {
            const li = document.createElement("li");
            li.textContent = `${product.name} - $${product.price} (${product.category || "Без категории"})`;

            const editBtn = document.createElement("button");
            editBtn.textContent = "edit";
            editBtn.addEventListener("click", () => startEditProduct(product.id));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "delete";
            deleteBtn.addEventListener("click", () => deleteProduct(product.id));

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            productList.appendChild(li);
        });
    };

    // Добавление товара
    const addProduct = () => {
        const name = productNameInput.value;
        const price = parseFloat(productPriceInput.value);
        const category = productCategoryInput.value;

        const newProduct = { id: Date.now(), name, price, category };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        renderProductList();
        productForm.reset();
    };

    // Удаление товара
    const deleteProduct = (id) => {
        products = products.filter(product => product.id !== id);
        localStorage.setItem("products", JSON.stringify(products));
        renderProductList();
    };

    // Начало редактирования товара
    const startEditProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            currentEditId = id;
            editNameInput.value = product.name;
            editPriceInput.value = product.price;
            editCategoryInput.value = product.category;
            editForm.style.display = "block";
        }
    };

    // Сохранение изменений товара
    const saveEditProduct = () => {
        const updatedProduct = {
            id: currentEditId,
            name: editNameInput.value,
            price: parseFloat(editPriceInput.value),
            category: editCategoryInput.value
        };

        products = products.map(product =>
            product.id === currentEditId ? updatedProduct : product
        );

        localStorage.setItem("products", JSON.stringify(products));
        currentEditId = null;
        editForm.style.display = "none";
        renderProductList();
    };





    // ===== События =====

    // Обработчик для формы добавления товаров
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addProduct();
    });

    // Обработчик для формы редактирования
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveEditProduct();
    });

    // Отмена редактирования
    cancelEdit.addEventListener("click", () => {
        currentEditId = null;
        editForm.style.display = "none";
    });

    // ===== Инициализация =====
    renderProductList();
    renderCartData();
});
