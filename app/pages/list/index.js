require('../list.html.jade');
require('./index.scss');
var tmpl = require('./tmpls/index.tmpl.jade');
var util = require('../../mods/util.js');

util.insert();

$('.tmpl-content').html(tmpl({
    name: 'template'
}));
