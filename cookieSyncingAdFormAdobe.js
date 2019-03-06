//has to be triggered on to make AAM audiences work in Optimizely
function sendCallToAudienceManager() {
    function getCookieValue(a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/;domain=" + document.location.hostname.split(document.location.hostname.split('.').shift())[1];
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://unibet.demdex.net/event', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var finalString = '';
            var result = this.response;
            result = JSON.parse(result);
            var allSegments = result.segments;
            for (var y = 0; y < allSegments.length; y++) {
                finalString += 'aam=' + allSegments[y] + ',';
            }
            finalString = finalString.slice(0, -1);
            setCookie('aamoptsegs', encodeURIComponent(finalString, 180));
            setCookie('aam-uuid', encodeURIComponent(result.uuid, 180));
        }
    };

    if (getCookieValue("AMCV_F431E3BC5593E3887F000101%40AdobeOrg") !== '') {
        xhr.send('d_mid=' + decodeURI(getCookieValue("AMCV_F431E3BC5593E3887F000101%40AdobeOrg")).split("|MCMID|")[1].split("|")[0] + '&d_orgid=F431E3BC5593E3887F000101@AdobeOrg&d_rtbd=json&d_cts=2&dcs_region=6');
    }
};

//in adform's case, we are happy to send an extra call when the cookie sync is ready
if (!b['cp.utag_main_adform'] && typeof (window.utag.adform_cookie_set_callback) == 'undefined') {
    window.utag.adform_cookie_set_callback = function () {
        //just call the collect tag and nothing else
        var copy_b = JSON.parse(JSON.stringify(b));
        copy_b.from_adform_callback = "true";
        utag[a](copy_b, null, [1]);
    };
}

//in adobe's case, we wish to wait for the cookie sync before sending anything - the load rule on the collect tag handles that
if (!b['cp.utag_main_adobe_mcid'] && !b['cp.utag_main_adobe_aa_vid'] && typeof (window.utag.adobe_cookie_set_callback) == 'undefined') {
    window.utag.adobe_cookie_set_callback = function () {
        var copy_b = JSON.parse(JSON.stringify(b));
        //mark call as coming specifically for adobe if we are also waiting on cookie sync for adform
        if (typeof (window.utag.adform_cookie_set_callback) == 'function') {
            copy_b.from_adobe_callback = "true";
        }
        //just call the collect tag and nothing else
        utag[a](copy_b, null, [1]);
        sendCallToAudienceManager();
    };
}