// ===== GESTION DU THÈME =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeToggle = document.getElementById('theme-toggle');

    // Appliquer le thème
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Gestion du bouton de changement de thème
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            this.innerHTML = isDark ?
                '<i class="fas fa-sun"></i>' :
                '<i class="fas fa-moon"></i>';
        });
    }
}

// ===== GESTION DU PANIER =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems > 0 ? totalItems : '';
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, variations = {}, quantity = 1) {
    const existingItem = cart.find(item =>
        item.id === productId &&
        JSON.stringify(item.variations) === JSON.stringify(variations)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            variations,
            quantity
        });
    }

    saveCart();
    showNotification(`${quantity} produit(s) ajouté(s) au panier`);
}

function removeCartItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== CHATBOT =====
function initChatbot() {
    if (document.getElementById('chatbot-container')) return;

    // Créer l'interface du chatbot
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot-container';
    chatContainer.innerHTML = `
    <div id="chat-header">
      <h3>Assistant Virtuel</h3>
      <button id="close-chat"><i class="fas fa-times"></i></button>
    </div>
    <div id="chat-messages"></div>
    <div id="chat-input">
      <input type="text" id="user-input" placeholder="Écrivez votre message...">
      <button id="send-btn"><i class="fas fa-paper-plane"></i></button>
    </div>
  `;
    document.body.appendChild(chatContainer);

    // Bouton d'ouverture du chatbot
    const chatIcon = document.createElement('div');
    chatIcon.id = 'chat-icon';
    chatIcon.innerHTML = '<i class="fas fa-comments"></i>';
    document.body.appendChild(chatIcon);

    // Éléments du chatbot
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const closeBtn = document.getElementById('close-chat');

    // Événements
    chatIcon.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Fonction pour ouvrir/fermer le chat
    function toggleChat() {
        chatContainer.classList.toggle('open');
        chatIcon.classList.toggle('hidden');
    }

    // Fonction pour envoyer un message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';

            // Réponse automatique après un court délai
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage('bot', response);
            }, 1000);
        }
    }

    // Ajouter un message au chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Générer une réponse du bot
    function getBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
            return 'Bonjour ! Comment puis-je vous aider ?';
        }

        if (lowerCaseMessage.includes('commande') || lowerCaseMessage.includes('suivi')) {
            return 'Pour suivre votre commande, veuillez vous rendre dans la section "Mes commandes" de votre compte.';
        }

        if (lowerCaseMessage.includes('retour') || lowerCaseMessage.includes('remboursement')) {
            return 'Nous acceptons les retours sous 30 jours. Veuillez consulter notre politique de retours.';
        }

        if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('service client')) {
            return 'Vous pouvez contacter notre service client par email à support@marketplace.com ou par téléphone au +243 000 000 000.';
        }

        if (lowerCaseMessage.includes('merci')) {
            return 'Je vous en prie !';
        }

        return "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?";
    }

    // Ajouter un message de bienvenue
    setTimeout(() => {
        addMessage('bot', 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?');
    }, 1000);
}

// ===== PAGE D'ACCUEIL =====
function initHomePage() {
    if (!document.getElementById('product-container')) return;

    // Charger et afficher les produits
    loadProducts();

    // Gestion des filtres
    const categoryFilter = document.getElementById('category');
    const priceFilter = document.getElementById('price');
    const sortFilter = document.getElementById('sort');

    if (categoryFilter) categoryFilter.addEventListener('change', loadProducts);
    if (priceFilter) priceFilter.addEventListener('change', loadProducts);
    if (sortFilter) sortFilter.addEventListener('change', loadProducts);
}

function loadProducts() {
    // Simuler des données de produits
    const products = [
        { id: 1, name: "T-shirt Classique", price: 19.99, category: "mode", image: "https://via.placeholder.com/300" },
        { id: 2, name: "Casque Sans Fil", price: 89.99, category: "electronique", image: "https://via.placeholder.com/300" },
        { id: 3, name: "Livre Best-seller", price: 14.99, category: "maison", image: "https://via.placeholder.com/300" },
        { id: 4, name: "Montre Élégante", price: 129.99, category: "mode", image: "https://via.placeholder.com/300" },
        { id: 5, name: "Smartphone", price: 499.99, category: "electronique", image: "https://via.placeholder.com/300" },
        { id: 6, name: "Vase Décoratif", price: 24.99, category: "maison", image: "https://via.placeholder.com/300" }
    ];

    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = '';

    const categoryFilter = document.getElementById('category') ? .value;
    const priceFilter = document.getElementById('price') ? .value;
    const sortFilter = document.getElementById('sort') ? .value;

    let filteredProducts = [...products];

    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }

    if (priceFilter && priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        if (priceFilter.endsWith('+')) {
            filteredProducts = filteredProducts.filter(p => p.price >= min);
        } else {
            filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
        }
    }

    if (sortFilter) {
        switch (sortFilter) {
            case 'newest':
                filteredProducts.reverse();
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
        }
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">${product.price.toFixed(2)}€</div>
        <button class="add-to-cart-btn" data-id="${product.id}">
          <i class="fas fa-cart-plus"></i> Ajouter au panier
        </button>
      </div>
    `;
        container.appendChild(productCard);
    });

    // Ajouter les événements pour les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
}

// ===== PAGE PANIER =====
function initCartPage() {
    if (!document.getElementById('cart-items-container')) return;

    renderCartItems();
    updateCartSummary();

    // Événements pour modifier la quantité
    document.querySelectorAll('.quantity-select').forEach(select => {
        select.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            updateCartItemQuantity(index, parseInt(this.value));
        });
    });

    // Événements pour supprimer un article
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeCartItem(index);
            renderCartItems();
            updateCartSummary();
        });
    });
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `
      <div class="empty-cart">
        <h3>Votre panier est vide</h3>
        <p>Les articles que vous avez ajoutés à votre panier apparaîtront ici.</p>
        <a href="Index.html" class="btn-continue">Parcourir les produits</a>
      </div>
    `;
        return;
    }

    cart.forEach((item, index) => {
                // Simuler les données du produit
                const product = {
                    id: item.id,
                    name: `Produit ${item.id}`,
                    price: item.id * 10 + 9.99,
                    image: "https://via.placeholder.com/100"
                };

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${product.name}</h4>
        <div class="cart-item-price">${product.price.toFixed(2)}€</div>
        <div class="cart-item-quantity">
          <select class="quantity-select" data-index="${index}">
            ${Array.from({length: 10}, (_, i) => 
              ` < option value = "${i+1}"
                $ { item.quantity === i + 1 ? 'selected' : '' } > $ { i + 1 } < /option>`
            ).join('')
        } <
        /select> < /
        div > <
        /div> <
    div class = "cart-item-subtotal" > $ {
        (product.price * item.quantity).toFixed(2)
    }€ < /div> <
    button class = "remove-item"
    data - index = "${index}" >
        <
        i class = "fas fa-trash" > < /i> < /
        button >
        `;
    container.appendChild(cartItem);
  });
}

function updateCartItemQuantity(index, quantity) {
  if (index >= 0 && index < cart.length) {
    cart[index].quantity = quantity;
    saveCart();
    updateCartSummary();
  }
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => {
    // Simuler le prix du produit
    const productPrice = item.id * 10 + 9.99;
    return sum + (productPrice * item.quantity);
  }, 0);
  
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;
  
  const subtotalEl = document.getElementById('subtotal-amount');
  const shippingEl = document.getElementById('shipping-amount');
  const totalEl = document.getElementById('total-amount');
  
  if (subtotalEl) subtotalEl.textContent = `
    $ { subtotal.toFixed(2) }€
    `;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'GRATUIT' : `
    $ { shipping.toFixed(2) }€
    `;
  if (totalEl) totalEl.textContent = `
    $ { total.toFixed(2) }€
    `;
}

// ===== PAGE PRODUIT =====
function initProductPage() {
  if (!document.getElementById('product-title')) return;
  
  // Récupérer l'ID du produit depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 1;
  
  // Simuler les données du produit
  const product = {
    id: productId,
    name: `
    Produit $ { productId }
    `,
    price: productId * 10 + 9.99,
    description: "Ceci est une description détaillée du produit. Il s'agit d'un article de haute qualité avec de nombreuses fonctionnalités intéressantes.",
    images: [
      "https://via.placeholder.com/500",
      "https://via.placeholder.com/500?text=Image+2",
      "https://via.placeholder.com/500?text=Image+3"
    ]
  };
  
  // Afficher les détails du produit
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-price').textContent = `
    $ { product.price.toFixed(2) }€
    `;
  document.getElementById('product-description-text').textContent = product.description;
  
  // Afficher les images
  const mainImage = document.getElementById('main-product-image');
  if (mainImage && product.images.length > 0) {
    mainImage.src = product.images[0];
  }
  
  const thumbnails = document.querySelector('.thumbnail-images');
  if (thumbnails) {
    thumbnails.innerHTML = '';
    product.images.forEach((img, index) => {
      const thumb = document.createElement('img');
      thumb.src = img;
      thumb.alt = `
    Miniature $ { index + 1 }
    `;
      thumb.onclick = () => changeMainImage(img);
      thumbnails.appendChild(thumb);
    });
  }
  
  // Gestion du bouton "Ajouter au panier"
  const addToCartBtn = document.querySelector('.add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(document.getElementById('quantity').value) || 1;
      const size = document.getElementById('size').value;
      const color = document.getElementById('color').value;
      
      addToCart(product.id, {size, color}, quantity);
    });
  }
}

function changeMainImage(src) {
  const mainImage = document.getElementById('main-product-image');
  if (mainImage) mainImage.src = src;
}

// ===== FORMULAIRES =====
function initForms() {
  // Formulaire d'inscription
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (password !== confirmPassword) {
        showNotification("Les mots de passe ne correspondent pas");
        return;
      }
      
      // Simuler l'inscription
      showNotification("Inscription réussie !");
      setTimeout(() => {
        window.location.href = "Index.html";
      }, 1500);
    });
  }
  
  // Formulaire de connexion
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simuler la connexion
      showNotification("Connexion réussie !");
      setTimeout(() => {
        window.location.href = "Index.html";
      }, 1500);
    });
  }
  
  // Formulaire d'ajout de produit
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simuler l'ajout de produit
      showNotification("Produit ajouté avec succès !");
      setTimeout(() => {
        window.location.href = "vendor-dashboard.html";
      }, 1500);
    });
  }
}

// ===== INITIALISATION DE L'APPLICATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser le thème
  initTheme();
  
  // Initialiser le panier
  updateCartCount();
  
  // Initialiser le chatbot
  initChatbot();
  
  // Initialiser les formulaires
  initForms();
  
  // Initialiser la page en fonction du contenu
  if (document.getElementById('product-container')) {
    initHomePage();
  } else if (document.getElementById('product-title')) {
    initProductPage();
  } else if (document.getElementById('cart-items-container')) {
    initCartPage();
  }
  
  // Navigation mobile
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      document.getElementById('nav-menu').classList.toggle('open');
    });
  }
});