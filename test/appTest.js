const assert = require('chia').assert;

const indexOfLang = require('../index').indexOfLang;

descripe('App', function(){
    it('indexOfLang should return correct index', function(){
        let result = indexOfLang('se', ['en', 'se', 'fr']);
        assert.equal(result, 1);
    });
});