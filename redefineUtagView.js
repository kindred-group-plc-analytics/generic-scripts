var old_view = utag.view;
utag.view = function() {
    old_view.apply(this, arguments);
    if (window.utag.kindred_queue && window.utag.kindred_queue.constructor === Array) {
        for (var i = 0; i < window.utag.kindred_queue.length; i++) {
            var f = window.utag.kindred_queue[i];
            if (typeof(f) == 'function') {
                f();
            }
        }
    }
};