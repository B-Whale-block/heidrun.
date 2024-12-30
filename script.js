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

    async function connectWallet(isAutoReconnect = false) {
        try {
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect({ onlyIfTrusted: isAutoReconnect });
                const walletAddress = response.publicKey.toString();
    
                walletConnected = true;
                updateBuyButton();
                updateStickyWalletButton();
                if (!isAutoReconnect) showToast(`Wallet connected: ${walletAddress}`, 'success'); // Use toast for manual connect
    
                // Save connection status to localStorage
                localStorage.setItem('walletConnected', 'true');
    
                // Fetch balances after successfully connecting the wallet
                await fetchBalances(walletAddress);
            } else {
                showToast('Phantom Wallet is not installed.', 'error'); // Notify using toast
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }
    
    // Auto-reconnect on page load
    if (localStorage.getItem('walletConnected') === 'true') {
        connectWallet(true);
    }
    
    async function fetchBalances(walletAddress) {
        try {
            console.log("Fetching balances...");
            const connection = new solanaWeb3.Connection(
                "https://mainnet.helius-rpc.com/?api-key=fbe4fef4-c4f0-4fc7-ae16-3e04c2bf94a9",
                'confirmed'
            );
            console.log("Connected to RPC:", connection.rpcEndpoint);
    
            const publicKey = new solanaWeb3.PublicKey(walletAddress);
    
            // Fetch SOL balance
            try {
                const solBalance = await connection.getBalance(publicKey);
                const solFormatted = (solBalance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
                document.getElementById('solBalance').textContent = solFormatted.toLocaleString();
                console.log("Formatted SOL Balance:", solFormatted);
            } catch (error) {
                console.error("SOL Balance Fetch Error:", error);
                document.getElementById('solBalance').textContent = 'Error';
            }
    
            // Fetch $HEIDRUN token balance
            try {
                const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
                    programId: new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program ID
                });
    
                let heidrunBalance = 0;
                const heidrunMint = 'DdyoGjgQVT8UV8o7DoyVrBt5AfjrdZr32cfBMvbbPNHM';
    
                const tokenAccountInfoPromises = tokenAccounts.value.map(account =>
                    connection.getParsedAccountInfo(account.pubkey)
                );
    
                const accountInfos = await Promise.all(tokenAccountInfoPromises);
    
                for (const accountInfo of accountInfos) {
                    const data = accountInfo.value?.data?.parsed?.info;
                    if (data && data.mint === heidrunMint) {
                        heidrunBalance = data.tokenAmount.uiAmount || 0;
                        break;
                    }
                }
    
                document.getElementById('heidrunBalance').textContent = heidrunBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                console.log("Parsed $HEIDRUN Balance:", heidrunBalance);
            } catch (error) {
                console.error("$HEIDRUN Balance Fetch Error:", error);
                document.getElementById('heidrunBalance').textContent = 'Error';
            }
        } catch (error) {
            console.error("Error in fetchBalances function:", error);
            document.getElementById('solBalance').textContent = 'Error';
            document.getElementById('heidrunBalance').textContent = 'Error';
        }
    }
    
    function disconnectWallet() {
        walletConnected = false;
    
        // Reset UI
        buyButton.textContent = 'Buy $HEIDRUN';
        closeAllModals();
        updateStickyWalletButton();
        alert('Wallet disconnected.'); // Confirmation message
    
        // Remove connection status from localStorage
        localStorage.removeItem('walletConnected');
        console.log('Wallet disconnected.');
    }
    
    function checkWalletConnection() {
        const wasConnected = localStorage.getItem('walletConnected') === 'true';
        if (wasConnected && window.solana?.isPhantom) {
            connectWallet(true); // Attempt auto-reconnect
        }
    }
    
    // Event Listeners
    connectWalletButton?.addEventListener('click', () => connectWallet(false));
    disconnectWalletButton?.addEventListener('click', disconnectWallet);
    
    // Check wallet connection on page load
    checkWalletConnection();

    //==========================================
    // Wallet Connection/Disconnection animation
    //==========================================
    let toastTimeout; // Reference to manage overlapping toasts

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        clearTimeout(toastTimeout); // Clear existing timeout
        existingToast.remove(); // Remove the current toast
    }

    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add Close Button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => toast.remove());
    toast.appendChild(closeButton);

    toastContainer.appendChild(toast);

    // Automatically Remove Toast After 8 Seconds
    toastTimeout = setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0'; // Smooth fade out
            setTimeout(() => toast.remove(), 500); // Remove after fade-out
        }
    }, 8000); // 8 seconds duration
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Usage Example
function walletConnectedToast() {
    showToast('Wallet connected successfully!', 'success');
}

function walletDisconnectedToast() {
    showToast('Wallet disconnected.', 'error');
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
