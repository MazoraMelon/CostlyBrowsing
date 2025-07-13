document.getElementById("earnButton").addEventListener("click", function () {
    chrome.tabs.update({url: 'EarnCoins.html'});
    // Hide the popup after clicking the button
    window.close();
})

const coins = document.getElementById("coinCount");

// Get the coins from chrome storage
chrome.storage.local.get(['coins'], function (result) {
    let currentCoins = result.coins || 0;
    coins.innerText = `${currentCoins}`;
});