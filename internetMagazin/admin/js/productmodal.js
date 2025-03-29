let products = JSON.parse(localStorage.getItem('products')) || [];
let currentEditId = null;

// Функция для рендера списка товаров
const renderProductList = () => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product) => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - €${product.price} (${product.category || 'Без категории'})`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редактировать';
        editBtn.addEventListener('click', () => startEditProduct(product.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', () => deleteProduct(product.id));

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
};

// Добавление товара
export const addProduct = () => {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;

    const newProduct = { id: Date.now(), name, price, category };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductList();
    document.getElementById('product-form').reset();
};

// Удаление товара
export const deleteProduct = (id) => {
    products = products.filter((product) => product.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductList();
};

// Начало редактирования товара
export const startEditProduct = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
        currentEditId = id;
        document.getElementById('editName').value = product.name;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editCategory').value = product.category;
        document.getElementById('edit-form').style.display = 'block';
    }
};

// Сохранение изменений
export const saveEditProduct = () => {
    const updatedProduct = {
        id: currentEditId,
        name: document.getElementById('editName').value,
        price: parseFloat(document.getElementById('editPrice').value),
        category: document.getElementById('editCategory').value,
    };

    products = products.map((product) =>
        product.id === currentEditId ? updatedProduct : product
    );

    localStorage.setItem('products', JSON.stringify(products));
    currentEditId = null;
    document.getElementById('edit-form').style.display = 'none';
    renderProductList();
};

// Инициализация управления товарами
export const initProductManagement = () => {
    const productForm = document.getElementById('product-form');
    const editForm = document.getElementById('edit-form');
    const cancelEdit = document.getElementById('cancelEdit');

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addProduct();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEditProduct();
    });

    cancelEdit.addEventListener('click', () => {
        currentEditId = null;
        editForm.style.display = 'none';
    });

    renderProductList();
};
