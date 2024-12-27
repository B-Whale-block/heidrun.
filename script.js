document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded and interactive!');

    // ========================
    // 1. Navigation Controls
    // ========================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

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

    // ========================
    // 2. Modal Controls
    // ========================
    const buyButton = document.querySelector('.cta-button');
    const modal = document.getElementById('buyModal');
    const closeModal = document.querySelector('.close-modal');

    function openBuyModal() {
        console.log('Opening Buy modal...');
        modal.style.display = 'flex';
    }

    function closeBuyModal() {
        console.log('Closing Buy modal...');
        modal.style.display = 'none';
    }

    if (buyButton && modal) {
        buyButton.addEventListener('click', openBuyModal);

        closeModal?.addEventListener('click', closeBuyModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeBuyModal();
        });
    }

    // ========================
    // 3. Wallet Connection
    // ========================
    const connectWalletButton = document.querySelector('.connect-wallet');
    const walletInfo = document.getElementById('wallet-info');
    const heidrunBalanceElement = document.getElementById('heidrun-balance');

    async function connectWallet() {
        try {
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect();
                const walletAddress = response.publicKey.toString();
                console.log('Connected wallet:', walletAddress);

                walletInfo.style.display = 'flex';
                updateBuyButtonToDisconnect();
                await fetchBalances(walletAddress);
            } else {
                alert('Phantom Wallet not installed. Please install it from https://phantom.app');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    function updateBuyButtonToDisconnect() {
        buyButton.textContent = 'Disconnect';
        buyButton.removeEventListener('click', openBuyModal);
        buyButton.addEventListener('click', disconnectWallet);
    }

    function disconnectWallet() {
        console.log('Disconnecting wallet...');
        walletInfo.style.display = 'none';
        buyButton.textContent = 'Buy $HEIDRUN';
        buyButton.removeEventListener('click', disconnectWallet);
        buyButton.addEventListener('click', openBuyModal);
    }

    async function fetchBalances(walletAddress) {
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

        try {
            const solBalance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
            const solBalanceFormatted = (solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);

            const tokenAccounts = await connection.getTokenAccountsByOwner(
                new solanaWeb3.PublicKey(walletAddress),
                { mint: new solanaWeb3.PublicKey('DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM') }
            );

            let heidrunBalance = 0;
            if (tokenAccounts.value.length > 0) {
                heidrunBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
            }

            heidrunBalanceElement.textContent = `$HEIDRUN: ${heidrunBalance}`;
            console.log(`SOL Balance: ${solBalanceFormatted} SOL`);
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
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
