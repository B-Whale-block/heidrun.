// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded and interactive!');
    console.log(typeof solanaWeb3 !== 'undefined' ? 'Solana Web3 is loaded' : 'Solana Web3 is not loaded');
    

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
    // 2. Modal Controls + Sticky Wallet Info Button
    // ========================
    const buyButton = document.querySelector('.cta-button'); // Buy button
    const modal = document.getElementById('buyModal'); // Buy Options Modal
    const walletInfoModal = document.getElementById('walletInfoModal'); // Wallet Info Modal
    const closeModal = document.querySelector('.close-modal'); // Close button for Buy Modal
    const walletCloseModal = document.querySelector('.wallet-modal .close-modal'); // Close button for Wallet Info Modal
    const buyOptions = document.querySelectorAll('.pay-option'); // All Buy options
    const walletInfoButton = document.getElementById('walletInfoButton'); // Sticky Wallet Info button
    const walletCloseModalButton = document.getElementById('walletCloseModal');

    walletCloseModalButton?.addEventListener('click', () => {
        walletInfoModal.style.display = 'none';
    });
    
    let walletConnected = false; // Tracks wallet connection state

        // Function to close all modals
        function closeAllModals() {
            modal.style.display = 'none';
            walletInfoModal.style.display = 'none';
        }

        // Function to update Buy Button behavior
        function updateBuyButton() {
        if (walletConnected) {
            buyButton.textContent = 'Wallet Info'; // Change button text
        } else {
            buyButton.textContent = 'Buy $HEIDRUN'; // Reset button text
        }
    }

    // Function to toggle Sticky Wallet Info Button visibility
    function updateStickyWalletButton() {
        const isSmallScreen = window.innerWidth <= 768;
        if (walletConnected && isSmallScreen) {
            walletInfoButton.classList.add('visible');
            walletInfoButton.classList.remove('hidden');
        } else {
            walletInfoButton.classList.add('hidden');
            walletInfoButton.classList.remove('visible');
        }
    }

    // Buy Button Click Behavior
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            if (walletConnected) {
                closeAllModals();
                walletInfoModal.style.display = 'flex';
            } else {
                closeAllModals();
                modal.style.display = 'flex';
            }
        });
    }

    // Close Buy Modal
    closeModal?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close Wallet Info Modal
    walletCloseModal?.addEventListener('click', () => {
        walletInfoModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === walletInfoModal) walletInfoModal.style.display = 'none';
    });

    // Close Buy Modal when a buy option is clicked
    buyOptions.forEach(option => {
        option.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Wallet Info Button Click Behavior (Sticky Button)
    walletInfoButton?.addEventListener('click', () => {
        if (walletConnected) {
            walletInfoModal.style.display = 'flex';
        }
    });

    // Update Sticky Wallet Info Button on Resize
    window.addEventListener('resize', updateStickyWalletButton);

    // Call Sticky Button Update on Load
    updateStickyWalletButton();

    // ========================
    // 3. Wallet Connection
    // ========================
    const connectWalletButton = document.querySelector('.connect-wallet'); // Wallet connect option
    const disconnectWalletButton = document.getElementById('disconnectWalletButton'); // Disconnect button

    async function connectWallet() {
        try {
            console.log('Attempting to connect wallet...');
            
            // Check if Phantom Wallet is available
            if (window.solana && window.solana.isPhantom) {
                console.log('Phantom wallet detected.');
                
                // Connect to Phantom Wallet
                const response = await window.solana.connect();
                const walletAddress = response.publicKey.toString();
                console.log('Connected wallet address:', walletAddress);
                
                // Update UI state
                walletConnected = true;
                updateBuyButton();
                updateStickyWalletButton();
    
                // Fetch wallet balances
                await fetchBalances(walletAddress);
            } else {
                console.error('Phantom wallet not found. Ensure it is installed.');
            }
        } catch (error) {
            console.error('Error during wallet connection:', error);
        }
    }
    
    async function fetchBalances(walletAddress) {
        try {
            console.log('Fetching balances for wallet:', walletAddress);
    
            const RPC_URL = 'https://rpc.ankr.com/solana'; // Public RPC endpoint
            const connection = new solanaWeb3.Connection(RPC_URL);
            console.log('Using RPC endpoint:', RPC_URL);
    
            // Fetch SOL balance
            const solBalance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
            const solFormatted = (solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
            console.log('SOL Balance:', solFormatted);
    
            // Handle zero SOL balance
            if (solFormatted === '0.0000') {
                console.warn('Wallet has zero SOL balance.');
            }
    
            // Fetch HEIDRUN token balance
            let heidrunBalance = 0; // Default balance
            const tokenAccounts = await connection.getTokenAccountsByOwner(
                new solanaWeb3.PublicKey(walletAddress),
                { mint: new solanaWeb3.PublicKey('DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM') }
            );
    
            console.log('Token Accounts Response:', tokenAccounts);
    
            if (tokenAccounts?.value?.length > 0) {
                // Safely access the token balance
                heidrunBalance = tokenAccounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
                console.log('HEIDRUN Balance:', heidrunBalance);
            } else {
                console.warn('No HEIDRUN tokens found in the wallet.');
            }
    
            // Update UI
            document.getElementById('heidrunBalance').textContent = heidrunBalance.toFixed(4);
            document.getElementById('solBalance').textContent = solFormatted;
    
        } catch (error) {
            console.error('Error fetching balances:', error.message);
            if (error.message.includes('StructError')) {
                console.warn('It seems the wallet has no associated token accounts or tokens.');
            }
        }
    }    
            
    function disconnectWallet() {
        walletConnected = false;

        // Reset UI
        buyButton.textContent = 'Buy $HEIDRUN';
        closeAllModals();
        updateStickyWalletButton();
        console.log('Wallet disconnected.');
    }

    // Event Listeners
    connectWalletButton?.addEventListener('click', connectWallet);
    disconnectWalletButton?.addEventListener('click', disconnectWallet);

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
