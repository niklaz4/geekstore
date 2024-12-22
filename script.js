const products = [
    // Produtos
    {
        id: 1,
        name: 'Action Figure Goku Ultra Instinct',
        price: 299.99,
        description: 'Action Figure Goku Ultra Instinct Dragon Ball Super',
        image: 'galeria/figure_dragon_ball_super_son_goku_ultra_instinct_z_battle_32102_1_d866616f5dd00930c28384a81c772453.jpg',
        category: 'products'
    },
    {
        id: 2,
        name: 'Funko Pop Spider-Man',
        price: 149.99,
        description: 'Funko Pop Marvel Spider-Man No Way Home',
        image: 'galeria/funko-pop--marvel-peter-parker-spider-man-2-pack-exclusivo-cc-800-wcj4zr45om.jpg',
        category: 'products'
    },
    {
        id: 3,
        name: 'Estatueta Naruto Sage Mode',
        price: 399.99,
        description: 'Estatueta Naruto Modo Sábio Premium',
        image: 'galeria/naruto-sage--5--swn0iwtlqo.jpg',
        category: 'products'
    },
    // Acessórios
    {
        id: 4,
        name: 'Caneca Personalizada Star Wars',
        price: 49.99,
        description: 'Caneca térmica Baby Yoda 500ml',
        image: 'galeria/7908011762104-caneca-tom-350ml-star-wars-baby-yoda-01-94m51dsvfo.jpg',
        category: 'accessories'
    },
    {
        id: 5,
        name: 'Mousepad RGB Gamer',
        price: 89.99,
        description: 'Mousepad Gamer RGB XL 80x30cm',
        image: 'galeria/D_NQ_NP_951543-MLB50597408676_072022-O.jpg',
        category: 'accessories'
    },
    {
        id: 6,
        name: 'Case iPhone Harry Potter',
        price: 39.99,
        description: 'Case para iPhone tema Hogwarts',
        image: 'galeria/61C5CVi1VlL._AC_UF1000,1000_QL80_.jpg',
        category: 'accessories'
    },
    // Moda
    {
        id: 7,
        name: 'Camiseta Attack on Titan',
        price: 79.99,
        description: 'Camiseta Tropa de Exploração',
        image: 'galeria/camiseta_unissex_tropa_de_exploracao_attack_on_titan_shingeki_no_kyojin_14_anime_manga_preta_cd_94085_1_00ff3284d79fc76c9ee9ce48fc91a768.jpg',
        category: 'fashion',
        sizes: ['P', 'M', 'G', 'GG']
    },
    {
        id: 8,
        name: 'Moletom Demon Slayer',
        price: 159.99,
        description: 'Moletom Kimetsu no Yaiba Corp',
        image: 'galeria/41P06jMTv7L._AC_.jpg',
        category: 'fashion',
        sizes: ['P', 'M', 'G', 'GG']
    },
    {
        id: 9,
        name: 'Boné Pokemon',
        price: 59.99,
        description: 'Boné Pikachu Edição Especial',
        image: 'galeria/ca61b81efa32ae4675c9cb42c26aa5a9.jpg',
        category: 'fashion',
        sizes: ['P', 'M', 'G']
    }
];

let cart = [];

let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartDropdown();
    setupSearchFunctionality();
    setupMenuDropdowns();
    setupSmoothScroll();
    setupFavoritesPanel();
});

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function loadProducts() {
    document.getElementById('productsContainer').innerHTML = '';
    document.getElementById('accessoriesContainer').innerHTML = '';
    document.getElementById('fashionContainer').innerHTML = '';

    const productsByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});

    Object.entries(productsByCategory).forEach(([category, items]) => {
        const container = document.getElementById(`${category}Container`);
        if (container) {
            items.forEach(product => {
                container.appendChild(createProductCard(product));
            });
        }
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col';
    
    const isFashion = product.category === 'fashion';
    
    col.innerHTML = `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <button class="favorite-btn" data-id="${product.id}">
                <i class="fas fa-heart ${favorites.includes(product.id) ? 'active' : ''}"></i>
            </button>
            <h5>${product.name}</h5>
            <p>${product.description}</p>
            <div class="price">R$ ${product.price.toFixed(2)}</div>
            ${isFashion ? createSizeSelector(product.sizes) : ''}
            <button class="add-to-cart-btn" data-id="${product.id}">
                Adicionar ao Carrinho
            </button>
        </div>
    `;

    const favoriteBtn = col.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => toggleFavorite(product.id));

    const addToCartBtn = col.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(product));

    return col;
}

function setupMenuDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.addEventListener('mouseenter', () => {
            menu.style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            menu.style.display = 'none';
        });
    });
}

function createSizeSelector(sizes) {
    return `
        <div class="size-selector">
            <label>Tamanho:</label>
            ${sizes.map(size => `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="size" value="${size}">
                    <label class="form-check-label">${size}</label>
                </div>
            `).join('')}
        </div>
    `;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartDropdown();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDropdown();
}

function addToCart(product) {
    const selectedSize = product.category === 'fashion' 
        ? document.querySelector(`input[name="size"][data-product="${product.id}"]:checked`)?.value 
        : null;
    
    if (product.category === 'fashion' && !selectedSize) {
        alert('Por favor, selecione um tamanho!');
        return;
    }

    const existingItem = cart.find(item => 
        item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            size: selectedSize,
            quantity: 1
        });
    }

    updateCartDropdown();
    showNotification('Produto adicionado ao carrinho!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    
    if (cart.length === 0) {
        cartDropdown.innerHTML = '<p class="text-center">Carrinho vazio</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartDropdown.innerHTML = `
        ${cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h6>${item.name}</h6>
                    <p>R$ ${item.price.toFixed(2)}</p>
                    ${item.size ? `<small>Tamanho: ${item.size}</small>` : ''}
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
        <div class="cart-total">
            <strong>Total: R$ ${total.toFixed(2)}</strong>
        </div>
        <button onclick="checkout()" class="checkout-btn">Finalizar Compra</button>
    `;
}

function setupFavoritesPanel() {

    updateFavoritesPanel();

}

function updateFavoritesPanel() {
    const favoritesDropdown = document.getElementById('favoritesDropdown');
    if (!favoritesDropdown) return;

    const favoritedProducts = products.filter(product => 
        favorites.includes(product.id)
    );

    if (favoritedProducts.length === 0) {
        favoritesDropdown.innerHTML = '<p class="text-center">Nenhum favorito ainda</p>';
        return;
    }

    favoritesDropdown.innerHTML = `
        ${favoritedProducts.map(product => `
            <div class="favorite-item">
                <img src="${product.image}" alt="${product.name}" class="favorite-item-image">
                <div class="favorite-item-details">
                    <h6>${product.name}</h6>
                    <p>R$ ${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${JSON.stringify(product)})" class="add-to-cart-btn">
                        Adicionar ao Carrinho
                    </button>
                </div>
                <button onclick="toggleFavorite(${product.id})" class="remove-favorite-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('')}
    `;
}

function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index === -1) {
        favorites.push(productId);
        showNotification('Produto adicionado aos favoritos!');
    } else {
        favorites.splice(index, 1);
        showNotification('Produto removido dos favoritos!');
    }
    
    // Atualizar UI
    const btn = document.querySelector(`.favorite-btn[data-id="${productId}"] i`);
    btn.classList.toggle('active');
    updateFavoritesPanel();
}

function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        products.forEach(product => {
            const cards = document.querySelectorAll(`[data-id="${product.id}"]`);
            cards.forEach(card => {
                const productCard = card.closest('.col');
                if (productCard) {
                    const isVisible = 
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm);
                    
                    productCard.style.display = isVisible ? '' : 'none';
                }
            });
        });
    });
}

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    alert('Redirecionando para o checkout...');
}

document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});