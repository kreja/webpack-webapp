define(function(require, exports, module) {
    var util = require('../../mods/util.js');

    util.insert();

    $('<p>插入的 test，支持 CMD！</p>').insertAfter('.content');
});
