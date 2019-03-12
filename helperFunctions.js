functions = {};

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Remove the subdomain. Works on domains with both 2 or 3 parts i.e. co.uk and com.
    domainName = document.location.hostname.split('.').splice(1).join('.');
    document.cookie = name + "=" + (value || "") + expires + "; path=/;domain=" + domainName;
}

var getCookie = function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

var getTrackingCode = function () {
    var url = window.location.href;
    var campaignTrackingCode = "";

    var getQueryString = function (field) {
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(url);
        return string ? string[1] : null;
    };

    var isReferrerPopunder = document.referrer.indexOf("/pop/") > -1 ? true : false;
    var isMktid = url.indexOf("mktid") > -1 ? true : false;
    var isCid = url.indexOf("cid") > -1 ? true : false;
    var isUtm = url.indexOf("utm_medium") > -1 ? true : false;

    if (isMktid) {
        campaignTrackingCode = getQueryString('mktid');
    } else if (isCid) {
        campaignTrackingCode = getQueryString('cid'); //based on the new cid created in DW	
    } else if (isUtm) {
        var medium = getQueryString('utm_medium');
        var source = getQueryString('utm_source') || "NONE";
        var content = getQueryString('utm_content') || "NONE";
        var campaign = getQueryString('utm_campaign') || "NONE";
        var term = getQueryString('utm_term') || "NONE";
        campaignTrackingCode = medium + ":" + source + ":" + content + ":" + campaign + ":" + term;
    }

    //We removed DTM and AA from popunders to save server calls. We still want to recognise where the traffic is coming from. Therefore we check if referrer was a popund and what traffic source it included. Then we pass it replacing the channel to popunder.
    if (isReferrerPopunder) {
        url = document.referrer;
        isMktid = url.indexOf("mktid") > -1 ? true : false;
        isCid = url.indexOf("cid") > -1 ? true : false;
        if (isMktid) {
            campaignTrackingCode = getQueryString('mktid').replace("1:", "popunder:");
        } else if (isCid) {
            campaignTrackingCode = getQueryString('cid').replace("1:", "popunder:");
        }
    }

    return campaignTrackingCode;
}

var getPageName = function (navigationState) {

    var sanitize_url = function (entry) {
        return entry.replace(/:/gi, '');
    }

    var pageName = '';
    if (navigationState) {
        pageName = navigationState;
    } else {
        pageName = window.location.pathname;
    }

    // Remove the initial slash "/".
    // Simplifies code downstream.
    if (pageName.indexOf('/') == 0)
        pageName = pageName.substring(1);

    // Format and sanitization of the page name component.
    // Regardless if it depends on the URL, navigation state
    var pageName = pageName.split('/').map(sanitize_url).join(':');
    if (pageName == '')
        pageName = 'home';

    if (typeof (decodeURI) == 'function')
        pageName = decodeURI(pageName);

    return pageName.toLowerCase();
}

var getLoginStatus = function () {
    var result = 'Not Logged-In';
    if (document.cookie.indexOf('DTMhasEverLoggedIn=1') > -1) {
        result = 'Recognized';
    }
    // In some cases the loggedInStatus variable is not populated.
    // Then we check if the userId is a number (in other words, the ID is populated).
    if (b.loggedInStatus == true || typeof (b.userId) == 'number' || storageManagement._getStorage(storageManagement.sessionStorage, 'user_id')) {
        result = 'Logged-In';
        setCookie('DTMhasEverLoggedIn', '1', 365)
        storageManagement._setStorage(storageManagement.localStorage, 'hasEverLoggedIn', '1');
        if (b.userId && b.userId !== '')
            storageManagement._setStorage(storageManagement.sessionStorage, 'user_id', b.userId);
    }
    return result;
}

var timeParting = function (h, z) {
    var s = this,
        od;
    od = new Date('1/1/2000');
    if (od.getDay() != 6 || od.getMonth() != 0) {
        return 'Data Not Available';
    } else {
        var H, M, D, U, ds, de, tm, da = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            d = new Date();
        z = z ? z : 0;
        z = parseFloat(z);
        if (s._tpDST) {
            var dso = s._tpDST[d.getFullYear()].split(/,/);
            ds = new Date(dso[0] + '/' + d.getFullYear());
            de = new Date(dso[1] + '/' + d.getFullYear());
            if (h == 'n' && d > ds && d < de) {
                z = z + 1;
            } else if (h == 's' && (d > de || d < ds)) {
                z = z + 1;
            }
        }
        d = d.getTime() + (d.getTimezoneOffset() * 60000);
        d = new Date(d + (3600000 * z));
        H = d.getHours();
        M = d.getMinutes();
        M = (M < 10) ? '0' + M : M;
        D = d.getDay();
        U = ' AM';
        if (H >= 12) {
            U = ' PM';
            H = H - 12;
        }
        if (H == 0) {
            H = 12;
        }
        D = da[D];
        tm = H + ':' + M + U;
        return (tm + '|' + D);
    }
};

var getNewRepeat = function getNewRepeat(login_status) {
    var adb_new_repeat;
    var e = new Date(),
        cval, sval, ct = e.getTime();
    var d = 30;
    var cn = 's_nr';
    e.setTime(ct + d * 24 * 60 * 60 * 1000);

    // cval = b['cp.' + cn] || '';
    cval = getCookie(cn) || '';
    if (!cval || cval.length == 0) {
        //s.c_w(cn, ct + '-New', e);
        setCookie(cn, ct + '-New', e);
        adb_new_repeat = 'New';
    } else {
        sval = cval.split('-');
        if (sval.constructor === Array && ct - sval[0] < 30 * 60 * 1000 && sval[1] == 'New') {
            //s.c_w(cn, ct + '-New', e);
            setCookie(cn, ct + '-New', e);
            adb_new_repeat = 'New';
        } else {
            //s.c_w(cn, ct + '-Repeat', e);
            setCookie(cn, ct + '-Repeat', e);
            adb_new_repeat = 'Repeat';
        }
    }

    if (login_status === "Recognized" || login_status === "Logged-In") {
        adb_new_repeat = 'Repeat';
    }
    return adb_new_repeat;
}

var getPageNameMaria = function (dataLayer) {
    var components = []
    if (dataLayer.siteStructure && dataLayer.siteStructure.section) {
        if (typeof (dataLayer.siteStructure.section) == 'string') {
            // Site Section contains only a single value
            components.push(dataLayer.siteStructure.section);
        } else if (typeof (dataLayer.siteStructure.section) == 'object') {
            // Site Section contains a dynamic array of objects.
            var items_num = dataLayer.siteStructure.section.length
            for (i = 0; i < items_num; i++) {
                components.push(dataLayer.siteStructure.section[i].name);
            }
        }
        return components.join(':');
    } else {
        // If for any reason the necessary objects are not in place, return the generic page name.
        var dl = dataLayer || {};
        return getPageName(dl.navigationState);
    }
}

var getPromotionName = function () {
    // Promotion name is extracted from the URL:
    var pathNameComponents = window.location.pathname.split('/')[2] || '';
    return decodeURI(pathNameComponents);
}

var storageManagement = {
    _storageNameSpace: 'webAnalitics',
    localStorage: 'localStorage',
    sessionStorage: 'sessionStorage',
    syncValue: function setValue(name, value) {
        this._setStorage('localStorage', name, value);
        this._setCookie(name, value, 365 * 2);
    },
    getAndSyncValue: function getValue(name) {
        var value = this._getCookie(name) || this._getStorage('localStorage', name);
        if (typeof (value) !== 'undefined')
            this.syncValue(name, value);
        return value;
    },
    _getCookie: getCookie,
    _setCookie: setCookie,
    _isStorageAvailable: function _isStorageAvailable() {
        var isAvailable = false;
        try {
            if (typeof (window.localStorage) !== 'undefined' && typeof (window.sessionStorage) !== 'undefined')
                isAvailable = true;
        } catch (error) { }
        return isAvailable;
    },
    _setStorage: function setStorage(storageType, name, value) {
        if (this._isStorageAvailable()) {
            var jsonData = this._getNameSpaceData(storageType);
            var item = { name: value };
            jsonData[name] = value;
            window[storageType].setItem(this._storageNameSpace, JSON.stringify(jsonData));
        }
    },
    _getStorage: function getStorage(storageType, name) {
        if (this._isStorageAvailable()) {
            var jsonData = this._getNameSpaceData(storageType);
            return jsonData[name];
        }
    },
    _getNameSpaceData: function getNameSpaceData(storageType) {
        var nameSpacedData = window[storageType].getItem(this._storageNameSpace);
        return JSON.parse(nameSpacedData) || {};
    }
};

// Register Functions
functions.getTrackingCode = getTrackingCode;
functions.getPageName = getPageName;
functions.getPageNameMaria = getPageNameMaria;
functions.getLoginStatus = getLoginStatus;
functions.timeParting = timeParting;
functions.getNewRepeat = getNewRepeat;
functions.getCookie = getCookie;
functions.setCookie = setCookie;
functions.getPromotionName = getPromotionName;
functions.storageManagement = storageManagement;

utag.helpers = {};
utag.helpers.functions = functions;