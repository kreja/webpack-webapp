define(function(require, exports, module) {
    module.exports = {
        insert: function(){
            $('<p>from util</p>').insertAfter('.content');
        }
    };
});
