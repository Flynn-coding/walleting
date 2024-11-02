document.getElementById('track-button').addEventListener('click', async () => {
    const walletAddress = document.getElementById('wallet-input').value.trim();
    const resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = 'Loading...';

    // Check if the address is for Solana or Ethereum (basic validation)
    const isSolana = walletAddress.startsWith('0x') ? false : true; // Simplified check: adjust as needed
    const apiUrl = isSolana 
        ? `https://api.solscan.io/account/tokens?account=${walletAddress}`
        : `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=YourEtherscanAPIKey`; // Add your Etherscan API key here

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (isSolana) {
            if (data.success) {
                const transactions = data.data;
                const recommendations = analyzeSolanaTransactions(transactions);
                resultsDiv.innerHTML = recommendations.length > 0 ? recommendations.join('<br>') : 'No transactions found.';
            } else {
                resultsDiv.innerHTML = 'Error fetching Solana transactions. Please check the address.';
            }
        } else {
            if (data.status === "1") {
                const transactions = data.result;
                const recommendations = analyzeEthereumTransactions(transactions);
                resultsDiv.innerHTML = recommendations.length > 0 ? recommendations.join('<br>') : 'No transactions found.';
            } else {
                resultsDiv.innerHTML = 'Error fetching Ethereum transactions. Please check the address.';
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = 'Error fetching transactions. Please try again.';
    }
});

// Analyze Solana transactions
function analyzeSolanaTransactions(transactions) {
    let recommendations = [];

    transactions.forEach(tx => {
        // Analyzing token transactions on Solana
        const { tokenAmount, tokenMint } = tx; // Assuming these fields exist, check the API for the correct fields
        recommendations.push(`Transaction of ${tokenAmount} tokens to ${tokenMint}`);
    });

    return recommendations;
}

// Analyze Ethereum transactions
function analyzeEthereumTransactions(transactions) {
    let recommendations = [];

    transactions.forEach(tx => {
        // Analyzing Ethereum transactions
        const { to, from, value, gasPrice } = tx;
        const cryptoAmount = value / (10 ** 18); // Convert from Wei to Ether
        recommendations.push(`Transfer of ${cryptoAmount.toFixed(4)} ETH from ${from} to ${to} at gas price ${gasPrice}`);
    });

    return recommendations;
}
