// Define Report Suites and brand name
var SUFFIX_DEV = 'dev';
var SUFFIX_PROD = 'prod';

// Report Suites
var SPA_BRANDS_REPORT_SUITE = 'unibetlondonsinglepagebrands';
var UNIBET_REPORT_SUITE = 'unibetlondonunibetweb';
var VLAD_REPORT_SUITE = 'unibetlondonvlad';
var HIGHROLLER_REPORT_SUITE = 'unibetlondonstorspelare';
var BINGO_REPORT_SUITE = 'unibetlondonbingoweb';
var BOHEMIA_REPORT_SUITE = 'unibetlondonbohemiacasinoweb';

var domainDetails = window.location.hostname.toLowerCase().split('.');
var subDomain = domainDetails[0];
var domain = domainDetails[1];

var brandDetails = {
    'unibet': {
        'reportSuite': UNIBET_REPORT_SUITE,
        'brand': 'unibet'
    },
    'mariacasino': {
        'reportSuite': SPA_BRANDS_REPORT_SUITE,
        'brand': 'maria'
    },
    'igame': {
        'reportSuite': SPA_BRANDS_REPORT_SUITE,
        'brand': 'igame'
    },
    'storspiller': {
        'reportSuite': HIGHROLLER_REPORT_SUITE,
        'brand': 'highroller'
    },
    'storspelare': {
        'reportSuite': HIGHROLLER_REPORT_SUITE,
        'brand': 'highroller'
    },
    'bingo': {
        'reportSuite': BINGO_REPORT_SUITE,
        'brand': 'bingo'
    },
    'vladcazino': {
        'reportSuite': VLAD_REPORT_SUITE,
        'brand': 'vlad'
    },
    'kolikkopelit': {
        'reportSuite': SPA_BRANDS_REPORT_SUITE,
        'brand': 'kolikkopelit'
    },
    'casinohuone': {
        'reportSuite': SPA_BRANDS_REPORT_SUITE,
        'brand': 'huone'
    }
}

var reportSuite = brandDetails[domain].reportSuite;
if (subDomain.toLowerCase() == 'welcome') {
    reportsuite += SUFFIX_PROD;
} else {
    reportSuite += SUFFIX_DEV;
}
var brand = brandDetails[domain].brand;

b.adb_report_suite = reportSuite.toLowerCase();
b.adb_site_brand = brand.toLowerCase();