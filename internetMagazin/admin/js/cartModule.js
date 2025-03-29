export const renderCartAnalytics = () => {
    const cartDataContainer = document.getElementById('cart-data');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartDataContainer.innerHTML = '<h3>Данные корзины:</h3>';
    const cartSummary = cart.reduce((summary, item) => {
        const { name, quantity, price } = item;
        const totalPrice = quantity * price;
        summary += `<p>${name}: ${quantity} шт. - €${totalPrice.toFixed(2)}</p>`;
        return summary;
    }, '');

    cartDataContainer.innerHTML += cartSummary || '<p>Корзина пуста.</p>';
};
