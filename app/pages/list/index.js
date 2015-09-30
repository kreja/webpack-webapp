define(function(require, exports, module) {
    var util = require('../../mods/util.js');

    util.insert();

    $('<p>插入の list</p>').insertAfter('.content');
});
