declare var requirejs, require;

//prevent caching
requirejs.config({
    // paths: {
    // "jquery": "https://code.jquery.com/jquery-3.3.1.min",
    // },
    urlArgs: function (id, url) {
        var rando = Math.floor(Math.random() * Math.floor(100000));
        var args = '';
        args = '?v=' + rando;
        return args;
    }
});
require(["index"]);
