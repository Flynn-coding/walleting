document.getElementById("analyzeButton").addEventListener("click", async () => {
    const walletAddress = document.getElementById("walletAddress").value;
    if (!walletAddress) return alert("Please enter a wallet address");

    const apiKey = "YOUR_API_KEY"; // Add API key here if needed.
    const url = `https://public-api.solscan.io/account/transactions?address=${walletAddress}&limit=10`;

    try {
        let response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": apiKey ? `Bearer ${apiKey}` : ""
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        let data = await response.json();
        
        let transactionInfo = document.getElementById("transactionInfo");
        transactionInfo.innerHTML = ''; // Clear previous data

        if (data.length === 0) {
            transactionInfo.innerHTML = `<div>No transactions found for this wallet address.</div>`;
            return;
        }

        // Display transaction details
        data.forEach(tx => {
            let txInfo = `
                <div class="transaction">
                    <strong>Transaction ID:</strong> ${tx.txHash} <br>
                    <strong>Time:</strong> ${new Date(tx.blockTime * 1000).toLocaleString()} <br>
                    <strong>Type:</strong> ${tx.type} <br>
                    <strong>Fee:</strong> ${tx.fee / Math.pow(10, 9)} SOL
                </div>
                <hr>
            `;
            transactionInfo.innerHTML += txInfo;
        });
    } catch (error) {
        console.error("Error fetching transaction data:", error);
        document.getElementById("transactionInfo").textContent = "Error fetching data. Please try again.";
    }
});
