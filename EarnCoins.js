const addCoin = document.getElementById('addCoin');

// Every second spawn in an "addCoin" element and delete it after 1 second

// Get the initial amount of coins
let initialCoins = 0;
function getCoins() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['coins'], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.coins !== undefined ? result.coins : 0);
            }
        });
    });
}

getCoins().then(coins => {
    initialCoins = coins;
}).catch(error => {
    initialCoins = 0;
});



setInterval(() => {
    if (addCoin) {
        const coin = addCoin.cloneNode(true);
        coin.style.left = Math.random() * 100 + '%';
        coin.style.top = Math.random() * 100 + '%';
        document.body.appendChild(coin);
        coin.style.display = 'flex';

        // Increment the coin count in storage
        chrome.storage.local.get(['coins'], function (result) {
            let currentCoins = result.coins || 0;
            currentCoins++;
            chrome.storage.local.set({ coins: currentCoins }, function () {
                console.log('Coins updated:', currentCoins);
                document.getElementById("coinCount").innerText = `${currentCoins}`;
            });
        });


        setTimeout(() => {
            coin.remove();
        }, 3000);
    }
}, 1000);