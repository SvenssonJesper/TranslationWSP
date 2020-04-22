const express = require('express');
const app = express();
const port = 3000;
app.listen(port, () => console.log('Listening at port:', port));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";


/*API*/

app.get('/translate', function (req, res) {
    const kw = req.body.keyword;
    const lang = req.body.lang;
    //bad input
    if(lang === undefined || kw === undefined){
        res.status(400);
        res.send('Please provide a keyword and a language code');
        return;
    }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db('TranslationDB');
        
        let query = {keyword: kw};
        dbo.collection('translation').find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length === 0){
                db.close();
                return res.status(400).send('keyword ' + kw + ' does not exist in the database');
            }else{
                let i = containsLang(lang, result[0].translations);
                if(i !== -1){
                    db.close();
                    return res.send(result[0].translations[i].translation);
                }else{
                    db.close();
                    return res.status(400).send('language code ' + lang + ' does not exist for the keyword ' + kw + ' in the database');
                }
            }
        });
      });
  })

app.post('/translate', function (req, res) {
    
    const kw = req.body.keyword;
    const lang = req.body.lang;
    const tr = req.body.translation;
    //bad input
    if(lang === undefined || kw === undefined || tr === undefined){
        res.status(400).send('Please provide a keyword, a language code and a translation');
        return;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db('TranslationDB');
        
        let query = {keyword: kw};
        dbo.collection('translation').find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length === 0){
                //Adds new entry of kw with following lang code + translation
                let myobj = { keyword: kw, 
                            translations: [
                            {language: lang, translation: tr}
                            ]};
                dbo.collection('translation').insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    
                });
            }else{
                if(containsLang(lang, result[0].translations) !== -1){
                    //lang code exsits. refer to update route
                    db.close();
                    return res.status(400).send('Translation for the keyword with this language code already exist. Use PUT instead.');
                }else{
                    //Appends new lang code + translation to DB
                    dbo.collection('translation').updateOne(
                        { keyword: kw },
                        { $push: { translations: {language: lang, translation: tr} } }
                    )
                }  
            }
            db.close();
            return res.send('Inserted 1 new translation');
        });
      });
});

function containsLang(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].language === obj) {
            return i;
        }
    }

    return -1;
}

app.put('/translate', function (req, res) {
    
    const kw = req.body.keyword;
    const lang = req.body.lang;
    const tr = req.body.translation;
    //bad input
    if(lang === undefined || kw === undefined || tr === undefined){
        res.status(400).send('Please provide a keyword, a language code and a translation');
        return;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db('TranslationDB');
        
        let i = containsLang(lang, result[0].translations).toString();

        dbo.collection('translation').updateOne(
            { keyword: kw },
            { $set: { 'translations.0' : {language: lang, translation: tr} } }
        )
        db.close();
        return res.send('Updated 1 translation');
      });
});