(function () {
    chrome.storage.sync.get(['strikes', 'currentStrikes', 'sitesBlocked'], function (items) {
        var currentTime = Date.now();
        items.futureStrikes = [];
        items.strikes.forEach(function (strike) {
            if (currentTime <= Date.parse(strike.times.start)) {
                items.futureStrikes.push(strike);
            }
        });

        console.dir(items);

        var futureStrikesEl = document.querySelector("#futureStrikes");
        futureStrikesEl.appendChild(buildFutureStrike(items.futureStrikes), futureStrikesEl);

        var currentStrikesEl = document.querySelector("#currentStrikes");
        currentStrikesEl.appendChild(buildCurrentStrike(items.currentStrikes), currentStrikesEl);
    });

    function buildCurrentStrike(data) {
        var container = document.createElement('DIV');
        data.forEach(function (strike) {
            var el = document.createElement('DIV');
            var strikeNameEl = document.createElement('P');
            var strikeStartEl = document.createElement('P');
            el.appendChild(strikeNameEl);
            el.appendChild(strikeStartEl);

            strikeNameEl.appendChild(document.createTextNode(strike.name));
            strikeStartEl.appendChild(document.createTextNode(strike.times.start.toLocaleString()));
            container.appendChild(el);
        })
        return container;
    }

    function buildFutureStrike(data) {
        var container = document.createElement('DIV');
        data.forEach(function (strike) {
            var el = document.createElement('DIV');
            var strikeNameEl = document.createElement('P');
            var strikeStartEl = document.createElement('P');
            el.appendChild(strikeNameEl);
            el.appendChild(strikeStartEl);

            strikeNameEl.appendChild(document.createTextNode(strike.name));
            strikeStartEl.appendChild(document.createTextNode(strike.times.start.toLocaleString()));
            container.appendChild(el);
        })
        return container;
    }
})();

