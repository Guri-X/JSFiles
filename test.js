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

function createCookie() {
    var myCookie = getCookie("tracking_id");

    if (myCookie == null) {
        document.cookie = "tracking_id=" + "_" + Math.random().toString(36).slice(2);
    }
    else {
        pass
    }
}

createCookie()