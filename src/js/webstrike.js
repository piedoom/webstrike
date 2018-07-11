/// javascript is a horrible language! but this is important...
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

            var sitesBlocked = [];
            var currentStrikes = [];
            var currentTime = Date.now();

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

            chrome.storage.sync.set(dataStore);


            // actually block the requests
            chrome.webRequest.onBeforeRequest.addListener(function (details) {
                return { cancel: (sitesBlocked.length != 0) };
            },
                { urls: sitesBlocked },
                ["blocking"]);
        })

    );



