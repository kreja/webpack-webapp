define(function(require, exports, module) {
    module.exports = {
        insert: function(){
            $('<p>来自 util</p>').insertAfter('.content');
        }
    };
});
