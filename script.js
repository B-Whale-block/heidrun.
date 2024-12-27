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
    const buyButton = document.querySelector('.cta-button'); // Buy button
    const modal = document.getElementById('buyModal'); // Buy Options Modal
    const closeModal = document.querySelector('.close-modal'); // Close button for Buy Modal
    const walletInfoModal = document.getElementById('walletInfoModal'); // Wallet Info Modal
    const walletCloseModal = document.querySelector('.wallet-modal .close-modal'); // Close button for Wallet Info Modal
    const buyOptions = document.querySelectorAll('.pay-option'); // All Buy options

    // Function to close all modals
    function closeAllModals() {
        modal.style.display = 'none';
        walletInfoModal.style.display = 'none';
    }

    // Buy Modal Controls
    if (buyButton && modal) {
        buyButton.addEventListener('click', () => {
            if (buyButton.textContent === 'Wallet Info') {
                // Open Wallet Info Modal if wallet is connected
                walletInfoModal.style.display = 'flex';
            } else {
                // Open Buy Modal if wallet is not connected
                closeAllModals();
                modal.style.display = 'flex';
            }
        });

        // Close Buy Modal
        closeModal?.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close Buy Modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Close Buy Modal when any option is clicked
        buyOptions.forEach(option => {
            option.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
    }

    // Wallet Info Modal Controls
    if (walletInfoModal) {
        walletCloseModal?.addEventListener('click', () => {
            walletInfoModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === walletInfoModal) walletInfoModal.style.display = 'none';
        });
    }


    // ========================
// 3. Wallet Connection
// ========================
const connectWalletButton = document.querySelector('.connect-wallet'); // Wallet connect option
const walletInfoButton = document.getElementById('walletInfoButton'); // Sticky Wallet Info button
const disconnectWalletButton = document.getElementById('disconnectWalletButton'); // Disconnect button
const heidrunBalanceElement = document.getElementById('heidrunBalance');
const solBalanceElement = document.getElementById('solBalance');

let walletConnected = false; // Tracks wallet state

async function connectWallet() {
    try {
        if (window.solana && window.solana.isPhantom) {
            const response = await window.solana.connect();
            const walletAddress = response.publicKey.toString();
            console.log('Connected wallet:', walletAddress);

            walletConnected = true;

            // Update Buy Button to Wallet Info
            buyButton.textContent = 'Wallet Info';

            // Fetch and update wallet balances
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
        const solBalance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
        const solFormatted = (solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);

        const tokenAccounts = await connection.getTokenAccountsByOwner(
            new solanaWeb3.PublicKey(walletAddress),
            { mint: new solanaWeb3.PublicKey('DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM') }
        );

        let heidrunBalance = 0;
        if (tokenAccounts.value.length > 0) {
            heidrunBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
        }

        heidrunBalanceElement.textContent = heidrunBalance.toFixed(4);
        solBalanceElement.textContent = solFormatted;

        console.log(`SOL Balance: ${solFormatted}, HEIDRUN Balance: ${heidrunBalance}`);
    } catch (error) {
        console.error('Error fetching balances:', error);
    }
}

function disconnectWallet() {
    walletConnected = false;

    // Reset UI
    buyButton.textContent = 'Buy $HEIDRUN';
    closeAllModals();
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
