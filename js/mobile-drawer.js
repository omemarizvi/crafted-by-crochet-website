// Mobile Drawer Functionality - Shared across all pages
class MobileDrawer {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileDrawer();
    }

    initMobileDrawer() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileDrawer = document.getElementById('mobileDrawer');
        const drawerClose = document.getElementById('drawerClose');
        const drawerOverlay = document.getElementById('drawerOverlay');

        // Open drawer
        if (mobileMenuBtn && mobileDrawer) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileDrawer.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }

        // Close drawer
        const closeDrawer = () => {
            if (mobileDrawer) {
                mobileDrawer.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        };

        if (drawerClose) {
            drawerClose.addEventListener('click', closeDrawer);
        }

        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', closeDrawer);
        }

        // Close drawer on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
                closeDrawer();
            }
        });
    }
}

// Initialize mobile drawer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileDrawer();
});

