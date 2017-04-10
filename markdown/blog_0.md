### Instead callback of Promise
> As the ES6 came, we could solve the **callback hell** with the new functionality called ***Promise***.
> When we use javascript in browser or node.js, the tricky problem around us that ***callback hell***, it cause by javascript characteristic: that single thread and callback function.
> For example,when we want to get something from database, we use a callback function which will call when the database finish query, consider follow code:
 ```javascript
 const MongoClient = require('mongodb').MongoClient
 
 function ifError(err, fun) {
     if (err) {
         console.log(err)
     } else {
         fun()
     }
 }
 
 router.get(
     '/',
     (req, res) => {
         const url = 'mongodb://localhost:27017/myProject'
         MongoClient.connect(
             url,
             function (err, db) {
                 ifError(
                     err,
                     () => {
                         console.log("Connected successfully to server")
                         let collection = db.collection('documents')
                         collection.find({}).toArray(
                             function (err, docs) {
                                 ifError(
                                     err,
                                     () => {
                                         res.json(docs)
                                         db.close()
                                     })
                             })
                     })
             })
     }
 )
```
> In above example, we write a handler for respond all item in collection **documents** in mongodb ,however, we fail **callback hell** in this case.
---
> First, we create a function that accept a err,if err, we console it, else we call the fun as callback.
---
> Second, we connect database, the mongodb driver's **connect** function will accept a **url** that specify the url consist of host and port as well as which database we will connect,the second argument is a function which will call we connect operation finish, it accept two argument: **err** if err occur
and **db** which is a object wrap some method as connect operation result.
---
> ***Then***, **connect** method 's callback function, we get the collection **document**, and find all document in this collection.
---
> However,this code is hard to read, we callback in callback, finally, we get triangle shape code.
> let me clarify what we do. We execute some operation,if err occur, we log it, if not,we execute other operation,if the new operation throw some err, we log it as well, if not, execute some new operation...
> Can it bw possible that clever way to do this?
> Yes, the ES6 provide a new feature called **Promise**.
> A **Promise** is a constructed function that accept a function (we will alias it as execute function) which accept two argument: **resolve** function and **reject** function.
The **execute function** will execute some code block,maybe a asynchronous operation and call **resolve** function or **reject** function(always when err occur).
> Then **Promise** constructed function return a **Promise** object which wrap some methods,one of it is **then**.
> The **then** method will accept one or two function. If one, it will executed when the **Promise** call **resolve** function and always do some asynchronous operation and return the new **Promise**. If two, same as one,but the second function will call when the **Promise** call **reject**.
> With the **then** method, we could chain the asynchronous operation, it is hard to say, let us consider follow code:
```javascript
const MongoClient = require('mongodb').MongoClient
router.get(
    '/',
    (req, res) => {
        const url = 'mongodb://localhost:27017/myProject'
        new Promise(
            (resolve, reject) => {
                MongoClient.connect(url, function (err, db) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(db)
                    }
                })
            }
        )
            .then(
            (db) => db.collection("documents")
        )
            .then(
                collection=>collection.find().toArray()
            )
            .then(
                (docs)=>res.json(docs)
            )
            .catch(
                err=>console.log(err)
            )
    }
)
console.log("this log will emerge before the database find documents")
```
> Above code do same thing with last code, but more readable.
---
>First, we create a **Promise**,then do some asynchronous operation that connect database, if err occur, we call **reject** function, if not, call **resolve** function.
---
> Then, we chain this **Promise** with some **then** methods, if not err occur, it will call one by one with asynchronous that mean the code next it will ***not be block**.If err occur, the **err** message will pass to the chain end **catch** which will log the err message.
>That is all, thanks! If you wanna more deeply learn ES6 **Promise**,there was some nice blog maybe will help you:
> 1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
> 2. https://developers.google.com/web/fundamentals/getting-started/primers/promises


