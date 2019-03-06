var w = window;
var d = document;
var c = new Date(),
    d = "",
    f = "",
    e = "",
    g = "",
    h = "",
    l = "1.2";
if (c.setUTCDate && (l = "1.3",
        (0).toPrecision && (l = "1.5",
            c = [],
            c.forEach))) {
    l = "1.6";
    f = 0;
    d = {};
    try {
        f = new Iterator(d);
        if (f.next) l = "1.7";
        if (c.reduce) l = "1.8";
        if (l.trim) l = "1.8.1";
        if (Date.parse) l = "1.8.2";
        if (Object.create) l = "1.8.5";
    } catch (r) {}
}
d = screen.width + "x" + screen.height;
e = navigator.javaEnabled() ? "Y" : "N";
f = screen.pixelDepth ? screen.pixelDepth : screen.colorDepth;
g = w.innerWidth ? w.innerWidth : d.documentElement.offsetWidth;
h = w.innerHeight ? w.innerHeight : d.documentElement.offsetHeight;
b.adb_resolution = d;
b.adb_colorDepth = f;
b.adb_javascriptVersion = l;
b.adb_javaEnabled = e;
b.adb_browserWidth = g;
b.adb_browserHeight = h;