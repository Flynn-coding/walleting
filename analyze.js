document.getElementById("analyzeButton").addEventListener("click", async () => {
    const walletAddress = document.getElementById("walletAddress").value;
    if (!walletAddress) return alert("Please enter a wallet address");

    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzA2ODUzMDk5NzAsImVtYWlsIjoicmVpZGZseUBzdHVkZW50LmNhcmV5LndhLmVkdS5hdSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTczMDY4NTMwOX0.FgnChbjBQyjF5q-DEkAYVvQNbQkAPyDnW0vDy-V7Ez0";
    const url = `https://public-api.solscan.io/account/transactions?address=${walletAddress}&limit=10`;

    try {
        let response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}`
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
