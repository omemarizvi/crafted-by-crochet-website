// Contact Page Management
class ContactManager {
    constructor() {
        this.shoppingCart = null;
        this.init();
    }

    init() {
        // Wait for cart to be available
        if (window.shoppingCart) {
            this.shoppingCart = window.shoppingCart;
            this.updateCartDisplay();
            this.initEventListeners();
        } else {
            // Wait for cart to load
            setTimeout(() => this.init(), 100);
        }
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount && this.shoppingCart) {
            cartCount.textContent = this.shoppingCart.getTotalItems();
        }
    }

    initEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                if (window.cartModal) {
                    window.cartModal.open();
                }
            });
        }

        // Add smooth scrolling for anchor links
        this.initSmoothScrolling();
    }

    initSmoothScrolling() {
        // Smooth scrolling for any anchor links on the page
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize contact manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});
