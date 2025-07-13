const domainName = new URLSearchParams(window.location.search).get('blockedDomain');
console.log("The domain is: " + domainName);

const domainTitle = document.getElementById('domainPreview');
if (domainTitle) {
    domainTitle.textContent = domainName;
}

const button = document.getElementById('unlockButton');
if (button) {
    button.addEventListener('click', function () {
        if (domainName) {
            getCoinCount().then(count => {
                if (parseInt(count, 10) > 20) { // Ensure user has more than 20 coins
                    chrome.runtime.sendMessage({
                        action: 'purchaseDomainAccess',
                        domain: domainName
                    }, function (response) {
                        if (response.success) {
                            console.log(`Domain ${domainName} added to allowed list.`);
                            // Go back to the previous page
                            window.history.back();
                        } else {
                            console.error('Failed to add domain:', response.error);
                        }
                    });
                } else {
                    console.error('Insufficient coins to unlock domain.');
                    alert('You do not have enough coins to unlock this domain.');
                }
            }).catch(error => {
                console.error('Error retrieving coin count:', error);
            });
        } else {
            console.error('No domain name provided.');
        }
    });
}

const earnMoreCoinsButton = document.getElementById('earnMoreCoinsButton');
if (earnMoreCoinsButton) {
    earnMoreCoinsButton.addEventListener('click', function () {
        // Redirect to the page where users can earn more coins
        window.open('EarnCoins.html', '_blank');
    });
}

function getCoinCount() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['coins'], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                // Show 0 if coins is 0, otherwise show "---" if undefined
                resolve(result.coins !== undefined ? result.coins : "---");
            }
        });
    });
}

getCoinCount()
    .then(count => {
        document.getElementById("coinCount").textContent = count;
    })
    .catch(console.error);
;