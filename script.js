document.getElementById('track-button').addEventListener('click', async () => {
    const walletAddress = document.getElementById('wallet-input').value.trim();
    const resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = 'Loading...';

    const apiUrl = `https://api.solscan.io/account/tokens?account=${walletAddress}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
            const transactions = data.data;
            const recommendations = analyzeSolanaTransactions(transactions);
            resultsDiv.innerHTML = recommendations.length > 0 ? recommendations.join('<br>') : 'No transactions found.';
        } else {
            resultsDiv.innerHTML = 'Error fetching Solana transactions. Please check the address.';
        }
    } catch (error) {
        resultsDiv.innerHTML = 'Error fetching transactions. Please try again.';
    }
});

// Analyze Solana transactions
function analyzeSolanaTransactions(transactions) {
    let recommendations = [];

    transactions.forEach(tx => {
        const { tokenAmount, tokenMint, timestamp, from, to } = tx; // Assuming these fields exist; check the API for the correct fields

        const date = new Date(timestamp * 1000); // Convert timestamp to date
        const formattedDate = date.toLocaleString(); // Format date

        recommendations.push(
            `Transaction of ${tokenAmount} tokens to ${to} from ${from} on ${formattedDate} (Token Mint: ${tokenMint})`
        );
    });

    return recommendations;
}
