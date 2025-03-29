import { initProductManagement } from './productModule.js';
import { renderCartAnalytics } from './cartModule.js';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация управления товарами
    initProductManagement();

    // Аналитика корзины
    renderCartAnalytics();
});
