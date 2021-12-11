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

function sendData(clickEvent) {
    let track_id = getTrackingId()
    let source_details = getSourceDetails()

    // Date and Time
    var date = new Date().toISOString().slice(0, 10);
    var time = new Date().toLocaleTimeString();
    var page_url = window.location.href

    data = {
        "tracking_id": track_id,
        "source": source_details['source'],
        "campaign": source_details['campaign'],
        "medium": source_details['medium'],
        "content": source_details['content'],
        "keyword": source_details['keyword'],
        "date": date,
        "time": time,
        "page_url": page_url,
        "click_event": clickEvent
    }

    console.log("data", data)

    return data
}

// Click Events
document.addEventListener("click", e => {
class_list = e.target.classList
if( class_list.contains("product-form__submit"))
    {
       console.log(sendData(e.target.innerText))
    }
})