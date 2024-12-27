// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded and interactive!');

    // ========================
    // 1. Navigation Controls
    // ========================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

    if (menuToggle && navMenu) {
        // Toggle the navigation menu
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.textContent = navMenu.classList.contains('active') ? 'X' : '☰';
        });

        // Close the menu when clicking outside or on a link
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

    // ========================
    // 2. Modal Controls
    // ========================
    const buyButton = document.querySelector('.cta-button');
    const modal = document.getElementById('buyModal');
    const closeModal = document.querySelector('.close-modal');

    if (buyButton && modal) {
        // Open the Buy modal
        buyButton.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // Close the modal
        closeModal?.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    // ========================
    // 3. Wallet Connection
    // ========================
    const connectWalletButton = document.querySelector('.connect-wallet');
    const walletInfoButton = document.getElementById('walletInfoButton'); // New button reference
    let walletConnected = false; // Tracks wallet state

    function updateWalletInfoVisibility() {
        const isSmallScreen = window.innerWidth <= 768;
        console.log('Screen size:', window.innerWidth, 'Wallet Connected:', walletConnected);
        if (walletConnected && isSmallScreen) {
            walletInfoButton.classList.add('visible');
            walletInfoButton.classList.remove('hidden');
        } else {
            walletInfoButton.classList.add('hidden');
            walletInfoButton.classList.remove('visible');
        }
    }

    window.addEventListener('resize', updateWalletInfoVisibility);

    async function connectWallet() {
        try {
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect();
                const walletAddress = response.publicKey.toString();
                console.log('Connected wallet:', walletAddress);

                walletConnected = true;
                buyButton.textContent = 'Wallet Info'; // Update main button text
                updateWalletInfoVisibility(); // Show sticky button on small screens
            } else {
                alert('Phantom Wallet not installed. Please install it from https://phantom.app');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', connectWallet);
    }

    if (walletInfoButton) {
        walletInfoButton.addEventListener('click', () => {
            alert('Wallet Info Clicked!'); // Example: Replace with desired functionality
        });
    }

    // ========================
    // 4. Play Alpha Button
    // ========================
    const playAlphaButton = document.getElementById('playAlphaButton');

    if (playAlphaButton) {
        playAlphaButton.addEventListener('click', () => {
            window.open('https://heidrun.xyz/heidrunrush/index.html', '_blank');
        });
    }

    // ========================
    // 5. Copy Contract Address
    // ========================
    const copyButton = document.querySelector('.copy-btn');
    const contractAddress = document.getElementById('contract-address');
    const copyFeedback = document.querySelector('.copy-feedback');

    function copyToClipboard() {
        navigator.clipboard.writeText(contractAddress.textContent)
            .then(() => {
                // Show feedback
                copyFeedback.classList.add('active');
                setTimeout(() => {
                    copyFeedback.classList.remove('active');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    if (copyButton && contractAddress) {
        // Add click functionality to copy button and address
        copyButton.addEventListener('click', copyToClipboard);
        contractAddress.addEventListener('click', copyToClipboard);
        contractAddress.style.cursor = 'pointer'; // Visual cue
    }

    // ========================
    // 6. Dynamic Roadmap Line Adjustment
    // ========================
    const timeline = document.querySelector('.roadmap-timeline');
    const phases = document.querySelectorAll('.roadmap-phase');

    if (timeline && phases.length > 0) {
        const firstPhase = phases[0];
        const lastPhase = phases[phases.length - 1];
        const startTop = firstPhase.offsetTop + firstPhase.offsetHeight / 2;
        const endBottom = lastPhase.offsetTop + lastPhase.offsetHeight / 2;

        timeline.style.setProperty('--line-top', `${startTop}px`);
        timeline.style.setProperty('--line-height', `${endBottom - startTop}px`);
    }
});
