async function fetchChartData() {
    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/fuwuqtctdsgtpw4ypxmsvnhw5txno65rohxztak5xkf4');
        const data = await response.json();

        if (data && data.pairs && data.pairs.length > 0) {
            const tokenInfo = data.pairs[0];

            // Update chart summary
            const summaryElement = document.getElementById('chart-summary');
            summaryElement.innerHTML = `
                <strong>Price:</strong> ${tokenInfo.priceUsd} USD <br>
                <strong>24h Change:</strong> ${tokenInfo.priceChange.h24}% <br>
                <strong>Liquidity:</strong> ${tokenInfo.liquidity.usd} USD <br>
                <strong>Volume:</strong> ${tokenInfo.volume.h24} USD
            `;

            // Draw the chart
            drawChart(tokenInfo.priceUsd);
        } else {
            showFallback();
        }
    } catch (error) {
        console.error("Error fetching chart data:", error);
        showFallback();
    }
}

function drawChart(price) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    ctx.clearRect(0, 0, 600, 400);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(50, 200 - price * 10, 50, price * 10); // Placeholder chart
}

// Fallback logic
function showFallback() {
    // Hide the canvas
    const chartCanvas = document.getElementById('chartCanvas');
    chartCanvas.style.display = 'none';

    // Show the video, message, and button
    const fallbackVideo = document.getElementById('chart-video');
    const fallbackMessage = document.getElementById('fallback-message');
    const fallbackButton = document.getElementById('fallback-button');
    fallbackVideo.style.display = 'block';
    fallbackMessage.style.display = 'block';
    fallbackButton.style.display = 'inline-block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchChartData);
