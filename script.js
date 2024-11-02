let lastFetchedAddress = '';
let lastFetchedData = [];

document.getElementById('track-button').addEventListener('click', async () => {
    const walletAddress = document.getElementById('wallet-input').value.trim();
    const resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = 'Loading...';

    // Use cached data if the same address is fetched
    if (walletAddress === lastFetchedAddress) {
        displayResults(lastFetchedData);
        return;
    }

    const apiUrl = `https://api.solscan.io/account/tokens?account=${walletAddress}`;

    try {
        // Show loading indicator
        resultsDiv.innerHTML = '<p>Loading transactions...</p>';

        // Fetch wallet transactions
        const response = await fetch(apiUrl);

        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the API returned success
        if (data.success && data.data) {
            const transactions = data.data;
            const recommendations = analyzeSolanaTransactions(transactions);

            // Cache the results
            lastFetchedAddress = walletAddress;
            lastFetchedData = recommendations;

            displayResults(recommendations);
        } else {
            throw new Error('No valid transactions found for this wallet address.');
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Error fetching transactions: ${error.message}. Please check the wallet address and try again.</p>`;
    }
});

// Analyze Solana transactions
function analyzeSolanaTransactions(transactions) {
    return transactions.map(tx => {
        const { tokenAmount, tokenMint, timestamp, from, to } = tx; // Ensure these fields exist in your API response

        // Convert timestamp to a Date object
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleString(); // Format the date

        // Create a detailed transaction recommendation
        return `Transaction of <strong>${tokenAmount}</strong> tokens to <strong>${to}</strong> from <strong>${from}</strong> on <strong>${formattedDate}</strong> (Token Mint: <strong>${tokenMint}</strong>)`;
    });
}

// Function to display results
function displayResults(recommendations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = recommendations.length > 0 
        ? recommendations.join('<br><br>') 
        : '<p>No transactions found.</p>';
}
