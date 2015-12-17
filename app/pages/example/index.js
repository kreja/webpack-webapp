require('./index.scss');

var util = require('../../mods/util.js');
var tpl = require('./index.ejs');

util.insert();

var html = tpl({name: 'jack'});
$('body').append(html);
