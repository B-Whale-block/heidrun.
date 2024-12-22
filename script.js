document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');
    
    // Modal for buy heidrun
    const buyButton = document.querySelector('.cta-button'); // Select Buy $HEIDRUN button
    const modal = document.getElementById('buyModal');
    const closeModal = document.querySelector('.close-modal');
    const payOptions = document.querySelectorAll('.pay-option'); // Tooltip

    // Navbar toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active'); 

            // Change the icon between ☰ and X
            if (navMenu.classList.contains('active')) {
                menuToggle.textContent = 'X'; 
            } else {
                menuToggle.textContent = '☰'; 
            }
        });

        // Close nav menu if clicked outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰'; 
            }
        });

        // Close the menu when a link is clicked (for mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active'); 
                menuToggle.textContent = '☰'; 
            });
        });
    }

    // Tooltip for pay options
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    payOptions.forEach(option => {
        if (isMobile) {
            let clickedOnce = false;

            option.addEventListener('click', (e) => {
                if (!clickedOnce) {
                    e.preventDefault(); // Prevent navigation
                    option.classList.add('clicked'); // Show tooltip
                    clickedOnce = true;

                    // Remove tooltip after 2 seconds if not clicked again
                    setTimeout(() => {
                        option.classList.remove('clicked');
                        clickedOnce = false;
                    }, 2000);
                } else {
                    // Navigate to the link on the second click
                    window.location.href = option.getAttribute('href');
                }
            });
        } else {
            // Desktop: Tooltip appears on hover (handled via CSS)
            option.addEventListener('mouseenter', () => {
                option.classList.add('hovered');
            });
            option.addEventListener('mouseleave', () => {
                option.classList.remove('hovered');
            });
        }
    });

    // Open the modal
    if (buyButton && modal) {
        buyButton.addEventListener('click', () => {
            modal.style.display = 'flex'; 
        });
    }

    // Close the modal
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none'; 
        });
    }

    // Close the modal when clicking outside
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none'; 
            }
        });
    }

    console.log('Website loaded and interactive!');
});
