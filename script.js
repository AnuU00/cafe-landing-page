const menuData = [
    // Coffee
    { id: 'c1', name: 'Ceylon Latte', price: 850, category: 'coffee', image: 'assets/images/ceylon-latte.png', description: 'Rich espresso with steamed milk and a touch of local spice.' },
    { id: 'c3', name: 'Cardamom Cappuccino', price: 900, category: 'coffee', image: 'assets/images/cardamom-cappuccino.jpg', description: 'Classic cappuccino infused with aromatic cardamom.' },

    // Snacks
    { id: 's1', name: 'Chicken Sub', price: 950, category: 'snacks', image: 'assets/images/chicken-sub.jpg', description: 'Grilled chicken, fresh veggies, and house sauce.' },
    { id: 's2', name: 'Cheese Toastie', price: 650, category: 'snacks', image: 'assets/images/cheese-toastie.jpg', description: 'Melted cheddar and mozzarella on toasted bread.' },
    { id: 's3', name: 'Spicy Fish Bun', price: 150, category: 'snacks', image: 'assets/images/fish-bun.jpg', description: 'Traditional Sri Lankan fish bun.' },
    { id: 's4', name: 'Vegetable Roti', price: 120, category: 'snacks', image: 'assets/images/veg-roti.jpg', description: 'Flatbread stuffed with spicy vegetable filling.' }
];

let cart = [];

// Cart Functions
const addToCart = (itemId) => {
    const item = menuData.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
};

const removeFromCart = (itemId) => {
    cart = cart.filter(i => i.id !== itemId);
    updateCartUI();
};

const updateItemQuantity = (itemId, change) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartUI();
    }
};

const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuGrid = document.getElementById('menu-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.querySelector('.cart-count');
    
    // Form Elements
    const whatsappBtn = document.getElementById('whatsapp-order-btn');
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    const asapCheckbox = document.getElementById('pickup-asap');
    const datetimeGroup = document.getElementById('datetime-group');
    const dateInput = document.getElementById('pickup-date');
    const timeInput = document.getElementById('pickup-time');
    const notesInput = document.getElementById('order-notes');

    // Modal Elements
    const modal = document.getElementById('confirmation-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalFallbackBtn = document.getElementById('modal-fallback-btn');
    const fallbackArea = document.getElementById('fallback-area');
    const fallbackMessage = document.getElementById('fallback-message');
    const copyBtn = document.getElementById('copy-btn');
    const confirmPhone = document.getElementById('confirm-phone');

    // Mobile Menu Toggle (Existing)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Render Menu
    const renderMenu = () => {
        if (!menuGrid) return;
        menuGrid.innerHTML = menuData.map(item => `
            <div class="menu-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-card-content">
                    <div class="menu-card-header">
                        <h4>${item.name}</h4>
                        <span class="price">Rs. ${item.price}</span>
                    </div>
                    <p>${item.description}</p>
                    <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    };

    // Update Cart UI
    window.updateCartUI = () => {
        // Update Count
        const count = getCartCount();
        cartCountEl.textContent = count;

        // Render Items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty.</div>';
            whatsappBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="updateItemQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateItemQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
            validateForm(); // Re-validate form as cart is not empty
        }

        // Update Totals
        const subtotal = getCartTotal();
        const tax = Math.round(subtotal * 0.05); // 5% Tax
        const total = subtotal + tax;

        cartSubtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
        cartTaxEl.textContent = `Rs. ${tax.toLocaleString()}`;
        cartTotalEl.textContent = `Rs. ${total.toLocaleString()}`;
    };

    // Cart Drawer Toggle
    const openCart = () => {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
        document.body.style.overflow = '';
    };

    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Form Validation
    const validateForm = () => {
        const isCartEmpty = cart.length === 0;
        const isNameValid = nameInput.value.trim().length > 0;
        const isPhoneValid = phoneInput.value.trim().length >= 9;
        const isAsap = asapCheckbox.checked;
        const isDateValid = isAsap || (dateInput.value !== '' && timeInput.value !== '');
        
        if (!isCartEmpty && isNameValid && isPhoneValid && isDateValid) {
            whatsappBtn.disabled = false;
        } else {
            whatsappBtn.disabled = true;
        }
    };

    // Event Listeners for Form
    [nameInput, phoneInput, dateInput, timeInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    asapCheckbox.addEventListener('change', () => {
        if (asapCheckbox.checked) {
            datetimeGroup.style.display = 'none';
        } else {
            datetimeGroup.style.display = 'block';
            // Set min date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
        validateForm();
    });

    // WhatsApp Order Logic
    whatsappBtn.addEventListener('click', () => {
        const customerName = nameInput.value.trim();
        const customerPhone = phoneInput.value.trim();
        const notes = notesInput.value.trim();
        const isAsap = asapCheckbox.checked;
        
        // Normalize Phone
        let phone = customerPhone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '94' + phone.substring(1);
        if (!phone.startsWith('94')) phone = '94' + phone;

        // Generate Order ID
        const now = new Date();
        const orderId = `CB-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`;

        // Build Message
        let itemLines = cart.map(item => 
            `• ${item.quantity} × ${item.name} — Rs. ${item.price} — Rs. ${item.price * item.quantity}`
        ).join('\n');

        const subtotal = getCartTotal();
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;

        const pickupTime = isAsap ? 'ASAP' : `${dateInput.value} @ ${timeInput.value}`;

        const message = `New Pickup Order — Ceylon Brew Café

Customer: ${customerName}
Phone: ${customerPhone}

Order items:
${itemLines}

Subtotal: Rs. ${subtotal.toLocaleString()}
Tax: Rs. ${tax.toLocaleString()}
Total: Rs. ${total.toLocaleString()}

Pickup: ${pickupTime}
Special notes: ${notes || 'None'}

Order ID: ${orderId}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/94771234567?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Show Confirmation Modal
        confirmPhone.textContent = customerPhone;
        fallbackMessage.value = message;
        modal.classList.add('active');
        closeCart();
    });

    // Modal Logic
    const closeModalFunc = () => {
        modal.classList.remove('active');
        fallbackArea.style.display = 'none';
        // Clear cart after successful order attempt? 
        // User might want to resend, so maybe don't clear immediately or ask.
        // For MVP, let's keep it.
    };

    closeModal.addEventListener('click', closeModalFunc);
    modalOkBtn.addEventListener('click', closeModalFunc);
    
    modalFallbackBtn.addEventListener('click', () => {
        fallbackArea.style.display = 'block';
    });

    copyBtn.addEventListener('click', () => {
        fallbackMessage.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Text';
        }, 2000);
    });

    // Initial Render
    renderMenu();
    updateCartUI();
});

// Lightbox Functionality
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
