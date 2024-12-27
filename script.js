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

    //wallet connect
    const connectWalletButton = document.querySelector('.connect-wallet');
    const walletAddressElement = document.getElementById('wallet-address');
    const solBalanceElement = document.getElementById('sol-balance');
    const heidrunBalanceElement = document.getElementById('heidrun-balance');

    async function connectWallet() {
        try {
            // Check for Phantom Wallet
            if (window.solana && window.solana.isPhantom) {
                console.log('Phantom Wallet detected.');
            
                // Request wallet connection
                const response = await window.solana.connect();
                const publicKey = response.publicKey.toString();

                // Update wallet address in the header
                walletAddressElement.textContent = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;

                // Fetch and display balances
                await fetchBalances(publicKey);

            } else {
                // Handle when Phantom Wallet is not found
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
            solBalanceElement.textContent = `${(solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4)} SOL`;

            // Fetch Heidrun token balance
            const tokenAccounts = await connection.getTokenAccountsByOwner(
                new solanaWeb3.PublicKey(walletAddress),
                { mint: new solanaWeb3.PublicKey('DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM') }
            );

            if (tokenAccounts.value.length > 0) {
                const tokenBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                heidrunBalanceElement.textContent = `${tokenBalance} HEIDRUN`;
            } else {
                heidrunBalanceElement.textContent = '0 HEIDRUN';
            }
        } catch (error) {
            console.error('Error fetching balances:', error);
            solBalanceElement.textContent = 'Error';
            heidrunBalanceElement.textContent = 'Error';
        }
    }

// Add event listener for connect wallet button
connectWalletButton?.addEventListener('click', connectWallet);

// Play button control
const playAlphaButton = document.getElementById('playAlphaButton');
playAlphaButton.addEventListener('click', () => {
    window.open('https://heidrun.xyz/heidrunrush/index.html', '_blank');
});

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
