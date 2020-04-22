# TranslationWSP
Translation Web Service Test Protocol

# How to run:
1. Run `npm install`
2. Run `nodemon index.js` or `node index.js` (running with `node` comand will not restart server when the code is updated)

----
# Api
----
**Translate**
  Returns String data of translated keyword if available

* **URL**
  localhost:`port`/translation
  
  (default `port` is 3000)

* **Method:**
  `GET`
  
* **Data Params**

   **Required:**
 
   `keyword=[String]`,
   `lang=[String]`
----
**Translate**
  Adds translated keyword to the database

* **URL**
  localhost:`port`/translation
  
  (default `port` is 3000)

* **Method:**
  `POST`
  
* **Data Params**

   **Required:**
 
   `keyword=[String]`,
   `lang=[String]`,
   `translation=[String]`
