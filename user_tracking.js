(function() {
    // Get Cookies
    function getCookie(c_name) {
        let dc = document.cookie;
        let prefix = c_name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        }
        else
        {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
            end = dc.length;
            }
        }

        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    var trackingCookie = getCookie("tracking_id"); // Checking if the tracking cookie exists

    if (trackingCookie == null) {
        document.cookie = "tracking_id=" + "_" + Math.random().toString(36).slice(2);
    }
    else {
    }

    function getTrackingId() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; tracking_id=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        
        return tracking_id
    }

    // Fetching source data from url
    function getSourceDetails() {
        source = new URL(location.href).searchParams.get("utm_source")    
        campaign = new URL(location.href).searchParams.get("utm_campaign")
        medium = new URL(location.href).searchParams.get("utm_medium")
        content = new URL(location.href).searchParams.get("utm_content")
        keyword = new URL(location.href).searchParams.get("utm_term")

        if (!source) source = "direct"

        data = {
            "source": source,
            "campaign": campaign,
            "medium": medium,
            "content": content,
            "keyword": keyword
        }

        return data
    }

    function assignTags() {
        keywordsList = ["product", "cart", "collection", "contact", "checkout"]
        tagList = []
        for (let i=0; i < keywordsList.length; i++) {
            url = window.location.href;
            if( url.match(keywordsList[i]) ) {
                tagList.push(keywordsList[i])
            } else {
                tagList.push(null)
            }
        }
        tagName = tagList.filter(t => t)[0]
        if (typeof tagName === "undefined") {
            tagName = null
        }

        return tagName
    }

    var geoLocation = "";
    async function getLocationDetails() {
        const url = "https://api.ipgeolocation.io/ipgeo?apiKey=254a0a5bbce04fc49eb31a620fcb59d6";
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    // Calculate Page Duration
    var timer;
    var timerStart;
    var visitDuration = 0;

    function startVisitDuration(){
        visitDuration = parseInt(localStorage.getItem('visit_duration'));
        visitDuration = isNaN(visitDuration) ? 0 : visitDuration;
        return visitDuration;
    }

    startVisitDuration()
    function getVisitDuration(){
        timerStart = Date.now();
        timer = setInterval(function(){
            visitDuration = startVisitDuration()+(Date.now()-timerStart);
            localStorage.setItem('visit_duration',visitDuration);
            timerStart = parseInt(Date.now());
        },1000);
    }

    // Stop the timer when the window/tab is inactive
    var stopCountingWhenWindowIsInactive = true; 

    if( stopCountingWhenWindowIsInactive ){
        if( typeof document.hidden !== "undefined" ){
            var hidden = "hidden", 
            visibilityChange = "visibilitychange", 
            visibilityState = "visibilityState";
        }else if ( typeof document.msHidden !== "undefined" ){
            var hidden = "msHidden", 
            visibilityChange = "msvisibilitychange", 
            visibilityState = "msVisibilityState";
        }
        var documentIsHidden = document[hidden];

        document.addEventListener(visibilityChange, function() {
            if(documentIsHidden != document[hidden]) {
                if( document[hidden] ){
                    clearInterval(timer);
                }else{
                    getVisitDuration();
                }
                documentIsHidden = document[hidden];
            }
        });
    }

    async function trackUser() {
        getVisitDuration()
        let trackingID = getTrackingId()
        let sourceDetails = getSourceDetails()

        // Date and Time
        var date = new Date().toISOString().slice(0, 10);
        var time = new Date().toLocaleTimeString();
        var pageUrl = window.location.href;
        var tag = assignTags();
        var os = navigator.platform;
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        geoLocation = await getLocationDetails();
        var clickEvent = localStorage.getItem("click_event");
        if (location.reload) {
            localStorage.removeItem("click_event");
        }
        var shopName = location.hostname
        if (clickEvent != null) {
            clickEvent = "Clicked on " + clickEvent
        }
        else {
            clickEvent = "Refreshed Page"
        }
        var pageDuration = localStorage.getItem("visit_duration");
        localStorage.setItem('visit_duration', 0);

        data = {
            "shop_name": shopName,
            "user_data": {
                "tracking_id": trackingID,
                "source": sourceDetails['source'],
                "campaign": sourceDetails['campaign'],
                "medium": sourceDetails['medium'],
                "content": sourceDetails['content'],
                "keyword": sourceDetails['keyword'],
                "date": date,
                "time": time,
                "page_url": pageUrl,
                "click_event": clickEvent,
                "tag": tag,
                "os": os,
                "screen_resolution": screenWidth + " x " + screenHeight,
                "ip": geoLocation['ip'],
                "isp": geoLocation['isp'],
                "country": geoLocation['country_name'],
                "state": geoLocation['state_prov'],
                "city": geoLocation['city'],
                "page_duration": parseInt(pageDuration/1000)
            }
        }
        console.log("data", data)
        fetch("http://127.0.0.1:9000/shopifyV2_extras/user_tracking/", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data)
        }).then(res => {
            console.log("Request Response:", res);
        });

        return data
    }

    // Click Events
    document.addEventListener("click", e => {
    class_list = e.target.classList
    localStorage.setItem("click_event", e.target.innerText);
    })

    trackUser()
})();