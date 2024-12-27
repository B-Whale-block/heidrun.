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
    const walletInfo = document.getElementById('wallet-info'); // Placeholder for wallet balances
    const heidrunBalanceElement = document.getElementById('heidrun-balance');

    async function connectWallet() {
        try {
            if (window.solana && window.solana.isPhantom) {
                console.log('Phantom Wallet detected.');
    
                // Request wallet connection
                const response = await window.solana.connect();
                const walletAddress = response.publicKey.toString();
                console.log('Connected wallet:', walletAddress);
    
                // Show wallet info and toggle button to Disconnect
                walletInfo.style.display = 'flex';
                buyButton.textContent = 'Disconnect';
                buyButton.removeEventListener('click', openBuyModal); // Remove Buy modal functionality
                buyButton.addEventListener('click', disconnectWallet); // Add disconnect functionality
    
                // Fetch and display balances
                await fetchBalances(walletAddress);
            } else {
                console.error('Phantom Wallet not found.');
                alert('Phantom Wallet not installed. Please install it from https://phantom.app');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }
    
    async function fetchBalances(walletAddress) {
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
    
        try {
            // Fetch SOL balance
            const solBalance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
            const solBalanceFormatted = (solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
    
            // Fetch Heidrun balance
            const tokenAccounts = await connection.getTokenAccountsByOwner(
                new solanaWeb3.PublicKey(walletAddress),
                { mint: new solanaWeb3.PublicKey('DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM') }
            );
    
            let heidrunBalance = 0;
            if (tokenAccounts.value.length > 0) {
                heidrunBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
            }
    
            // Update UI
            heidrunBalanceElement.textContent = `$HEIDRUN: ${heidrunBalance}`;
            console.log(`SOL Balance: ${solBalanceFormatted} SOL`);
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    }
    
    function disconnectWallet() {
        walletInfo.style.display = 'none';
        buyButton.textContent = 'Buy $HEIDRUN';
        buyButton.removeEventListener('click', disconnectWallet); // Remove disconnect functionality
        buyButton.addEventListener('click', openBuyModal); // Restore Buy modal functionality
        console.log('Wallet disconnected.');
    }
    
    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', connectWallet);
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
