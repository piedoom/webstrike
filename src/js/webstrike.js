/// javascript is a horrible language! but this is important...
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    return { cancel: true };
},
    { urls: ["*://*/*"] },
    ["blocking"]);
