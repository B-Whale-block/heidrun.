document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.navbar');
    
    // Modal for buy heidrun
    const buyButton = document.querySelector('.cta-button'); // Select Buy $HEIDRUN button
    const modal = document.getElementById('buyModal');
    const closeModal = document.querySelector('.close-modal');
    const payOptions = document.querySelectorAll('.pay-option'); // Tooltip

    // Navbar toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close nav menu if clicked outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Tooltip for pay options
    if (payOptions && payOptions.length > 0) {
        payOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Check if tooltip is already visible
                const tooltip = option.querySelector('.tooltip');
                if (tooltip) {
                    // If visible, allow the link to proceed
                    return;
                }
    
                // Prevent immediate link action
                e.preventDefault();
    
                // Create tooltip dynamically
                const tooltipText = option.getAttribute('title');
                const tooltipElement = document.createElement('div'); // Fixed variable naming
                tooltipElement.className = 'tooltip';
                tooltipElement.textContent = tooltipText;
                option.appendChild(tooltipElement);
    
                // Remove tooltip after 2 seconds
                setTimeout(() => {
                    tooltipElement.remove();
                }, 2000);
            });
        });
    }

    // Open the modal
    if (buyButton && modal) {
        buyButton.addEventListener('click', () => {
            modal.style.display = 'flex'; // Show the modal
        });
    }

    // Close the modal
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none'; // Hide the modal
        });
    }

    // Close the modal when clicking outside
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none'; // Hide the modal
            }
        });
    }

    console.log('Website loaded and interactive!');
});