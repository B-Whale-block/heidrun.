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
    const walletInfoButton = document.getElementById('walletInfoButton'); // Sticky Wallet Info button
    const walletInfoModal = document.getElementById('walletInfoModal'); // Modal reference
    const confirmSwapButton = document.getElementById('confirmSwapButton');
    const disconnectWalletButton = document.getElementById('disconnectWalletButton');
    const heidrunBalanceElement = document.getElementById('heidrunBalance');
    const solBalanceElement = document.getElementById('solBalance');

    let walletConnected = false; // Tracks wallet state

    function updateWalletInfoVisibility() {
        const isSmallScreen = window.innerWidth <= 768;
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
    
                // Update button and visibility
                buyButton.textContent = 'Wallet Info';
                updateWalletInfoVisibility();
    
                // Fetch and display balances
                await fetchBalances(walletAddress);
            } else {
                alert('Phantom Wallet not installed. Please install it from https://phantom.app');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    async function fetchBalances(walletAddress) {
        try {
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
    
            // Fetch SOL balance
            const solBalance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
            const solFormatted = (solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
    
            // Fetch HEIDRUN token balance
            const tokenAccounts = await connection.getTokenAccountsByOwner(
                new solanaWeb3.PublicKey(walletAddress),
                { mint: new solanaWeb3.PublicKey('DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM') }
            );
    
            let heidrunBalance = 0;
            if (tokenAccounts.value.length > 0) {
                heidrunBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
            }
    
            // Update UI
            heidrunBalanceElement.textContent = heidrunBalance.toFixed(4);
            solBalanceElement.textContent = solFormatted;
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    }

    function disconnectWallet() {
        walletConnected = false;
    
        // Reset UI
        walletInfoModal.style.display = 'none';
        buyButton.textContent = 'Buy $HEIDRUN';
        updateWalletInfoVisibility();
    
        console.log('Wallet disconnected.');
    }

    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', connectWallet);
    }
    
    if (walletInfoButton) {
        walletInfoButton.addEventListener('click', () => {
            walletInfoModal.style.display = 'flex';
        });
    }
    
    if (disconnectWalletButton) {
        disconnectWalletButton.addEventListener('click', disconnectWallet);
    }

    window.addEventListener('click', (e) => {
        if (e.target === walletInfoModal) {
            walletInfoModal.style.display = 'none';
        }
    });

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
