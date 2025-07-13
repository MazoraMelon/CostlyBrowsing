let allowedDomainsDefault = [
    "google.com",
    "chatgpt.com",
    "developer.chrome.com"
];


async function getAllowedDomains() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['allowedDomains'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.allowedDomains || []);
            }
        });
    });
}

function addAllowedDomain(domain) {
    getAllowedDomains().then(existingDomains => {
        if (!existingDomains.includes(domain)) {
            existingDomains.push(domain);
            chrome.storage.local.set({allowedDomains: existingDomains}, () => {
                console.log(`Domain ${domain} added to allowed list.`);
            });
        } else {
            console.log(`Domain ${domain} is already in the allowed list.`);
        }
    }).catch(error => {
        console.error('Error retrieving allowed domains:', error);
    });
}


function extractDomain(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (error) {
        console.error('Invalid URL:', url);
        return null;
    }
}

function getCoins() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['coins'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.coins || 0);
            }
        });
    });
}

function makePurchase(coins) {
    getCoins().then(currentCoins => {
        if (currentCoins >= coins) {
            const newCoinCount = currentCoins - coins;
            chrome.storage.local.set({coins: newCoinCount}, () => {
                console.log(`Purchase successful. New coin count: ${newCoinCount}`);
            });
        } else {
            console.error('Not enough coins for this purchase.');
        }
    }).catch(error => {
        console.error('Error retrieving coin count:', error);
    });
}


chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.frameType === "sub_frame") {
        console.log("Subframe detected, not blocking.");
        return; // Don't allow for iframes / subframes to be blocked
    }

    getAllowedDomains().then(allowedDomains => {
        console.log("Allowed domains:", allowedDomains);

        const url = new URL(details.url);
        const domain = extractDomain(details.url);

        // Check if the domain ends with any of the allowed suffixes
        const isAllowed = allowedDomains.some(suffix => domain.endsWith(suffix));

        if (isAllowed) {
            console.log(`Allowed: ${domain}`);
            return;
        }

        if (url.protocol !== 'https:') {
            return;
        }

        chrome.tabs.update(details.tabId, {url: `PageNotAllowed.html?blockedDomain=${encodeURIComponent(domain)}`});
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'purchaseDomainAccess') {
        // !TODO Change the user amount of coins
        const domain = request.domain.toLowerCase();
        if (domain) {
            addAllowedDomain(domain);
            makePurchase(20)
            sendResponse({success: true});
        } else {
            sendResponse({success: false, error: 'Domain already allowed or invalid.'});
        }
    } else {
        sendResponse({success: false, error: 'Unknown action.'});
    }
    return true; // Keep the message channel open for sendResponse
})





// Daily Streak Rewards
