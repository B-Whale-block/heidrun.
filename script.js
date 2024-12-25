document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

    // Modal for buy Heidrun
    const buyButton = document.querySelector('.cta-button');
    const modal = document.getElementById('buyModal');
    const closeModal = document.querySelector('.close-modal');
    const payOptions = document.querySelectorAll('.pay-option');

    // Roadmap
    const timeline = document.querySelector('.roadmap-timeline');
    const phases = document.querySelectorAll('.roadmap-phase');

    // Copy Contract Address
    const copyButton = document.querySelector('.copy-btn');
    const contractAddress = document.getElementById('contract-address');
    const copyFeedback = document.querySelector('.copy-feedback');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(contractAddress.textContent)
            .then(() => {
                // Show feedback
                copyFeedback.classList.add('active');

                // Hide feedback after 2 seconds
                setTimeout(() => {
                    copyFeedback.classList.remove('active');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    // Add click functionality to the copy button
    if (copyButton) {
        copyButton.addEventListener('click', copyToClipboard);
    }

    // Make the contract address itself clickable
    if (contractAddress) {
        contractAddress.addEventListener('click', copyToClipboard);
        contractAddress.style.cursor = 'pointer'; // Visual cue
    }

    // Navbar toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.textContent = navMenu.classList.contains('active') ? 'X' : '☰';
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }

    //Snowfall
    const numFlakes = 20; // Reduce number of snowflakes
    const snowflakeContainer = document.createDocumentFragment();
    const snowflakeChars = ['❄', '❅', '❆'];

    for (let i = 0; i < numFlakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];

        // Randomize position, speed, and size
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (10 + Math.random() * 10) + 's'; // Slower fall duration
        snowflake.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem'; // Smaller snowflakes
        snowflake.style.animationDelay = Math.random() * 5 + 's'; // Staggered start times

        snowflakeContainer.appendChild(snowflake);
    }

    document.body.appendChild(snowflakeContainer);

        const message = document.getElementById('christmas-message');
        setTimeout(() => {
            message.remove();
        }, 3000); // Remove message after animation (6 seconds)
     

    // Tooltip for pay options
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    payOptions.forEach(option => {
        if (isMobile) {
            let clickedOnce = false;
            option.addEventListener('click', (e) => {
                if (!clickedOnce) {
                    e.preventDefault();
                    option.classList.add('clicked');
                    clickedOnce = true;
                    setTimeout(() => {
                        option.classList.remove('clicked');
                        clickedOnce = false;
                    }, 2000);
                } else {
                    window.location.href = option.getAttribute('href');
                }
            });
        }
    });

    // Open/Close Modal
    if (buyButton && modal) {
        buyButton.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        closeModal?.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    // Dynamic Roadmap Line Adjustment
    if (timeline && phases.length > 0) {
        const firstPhase = phases[0];
        const lastPhase = phases[phases.length - 1];
        const startTop = firstPhase.offsetTop + firstPhase.offsetHeight / 2;
        const endBottom = lastPhase.offsetTop + lastPhase.offsetHeight / 2;

        timeline.style.setProperty('--line-top', `${startTop}px`);
        timeline.style.setProperty('--line-height', `${endBottom - startTop}px`);
    }

    console.log('Website loaded and interactive!');
});
