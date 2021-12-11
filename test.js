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
    current_url = window.location.href
    source = new URL(location.href).searchParams.get("utm_source")    
    campaign = new URL(location.href).searchParams.get("utm_campaign")

    if (!source) source = "direct"

    data = {
        "source": source,
        "campaign": campaign
    }

    return data
}

function sendData() {
    let track_id = getTrackingId()
    let source_details = getSourceDetails()

    data = {
        "tracking_id": track_id,
        "source": source_details['source'],
        "campaign": source_details['campaign']
    }

    return data
}

console.log(sendData())