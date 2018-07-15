/// javascript is a horrible language! but this is important...
const delayInMinutes = 1;
const periodInMinutes = 1;

var sitesBlocked = [];
var currentStrikes = [];
var currentTime = Date.now();

chrome.alarms.create("fetcher", {
  delayInMinutes,
  periodInMinutes
});

function siteBlocker() {
    if (sitesBlocked.length != 0) {
        let options = {
            "type": "basic",
            "iconUrl": chrome.extension.getURL("../../icon128.png"),
            "message": "There is currently a strike going on at this website.",
            "title": "BLOCKED"
        }
        var blocked = "blocked";
        chrome.notifications.getAll((all) => {
            if (all.length > 0) {
                chrome.notifications.clear(blocked);
            }
            chrome.notifications.create(blocked, options);
            chrome.alarms.create(
                "notification", {
                delayInMinutes
            });
        });
    };
    return { cancel: (sitesBlocked.length != 0) };
}

function listenerHandler() {
    fetch("../../strikes.json")
        .then(response => response.json()
            .then(data => ({
                data: data,
                status: response.status
            })
            )
            .then(res => {
                // loop through each site entry and add some regex stuff
                // horrible code ahead!
                res.data.forEach(function (strike) {
                    var newData = [];
                    strike.sites.forEach(function (site) {
                        newData.push("*://" + site + "/*");
                        newData.push("*://www." + site + "/*");
                    })
                    strike.sites = newData;
                });

                // see if our current time lies within the strike time
                res.data.forEach(function (strike) {
                    if (currentTime >= Date.parse(strike.times.start) && currentTime <= Date.parse(strike.times.end)) {
                        currentStrikes.push(strike);
                        strike.sites.forEach(function (site) {
                            sitesBlocked.push(site);
                        })
                    };
                });

                var dataStore = {
                    strikes: res.data,
                    currentStrikes: currentStrikes,
                    sitesBlocked: sitesBlocked
                }

                chrome.storage.local.set(dataStore);

                if (chrome.webRequest.onBeforeRequest.hasListener(siteBlocker)) {
                    chrome.webRequest.onBeforeRequest.removeListener(siteBlocker);
                }

                chrome.webRequest.onBeforeRequest.addListener(siteBlocker,
                    { urls: sitesBlocked },
                    ["blocking"]);
            }))
}

function handleAlarms(alarmInfo) {
    if (alarmInfo.name === "notification") {
        chrome.notifications.clear("blocked");
    } else {
        listenerHandler();
                // actually block the requests
    }
}

listenerHandler();
chrome.alarms.onAlarm.addListener(handleAlarms);
