const express = require('express')
const mongoose = require("mongoose")

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.set("view engine", "ejs")
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})
const Article = new mongoose.model("article", articleSchema)

app.route("/articles")
.get(function(err, res) {
    Article.find({}, function(err, articles) {
        if(!err) {
            res.send(articles)
        } else {
            res.send(err)
        }
    })
})
.post(function(req, res) {
    const article = Article({
        title: req.body.title,
        content: req.body.content
    })
    Article.create(article, function(err) {
        if(err) {
            res.send(err)
        } else {
            res.send("Success")
        }
    })
})
.delete(function(req, res) {
    Article.deleteMany({}, function(err) {
        if(err) {
            res.send(err)
        } else {
            res.send("Success")
        }
    })
})

app.route("/articles/:articleTitle")
.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, article) {
        if(article) {
            res.send(article)
        } else {
            res.send("No articles with that title")
        }
    })
})
.put(function(req, res) {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {
            if(err) {
                res.send(err)
            } else {
                res.send("Success")
            }
        }
    )
})
.patch(function(req, res) {
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if(!err) {
                res.send("Success")
            } else {
                res.send(err)
            }
        }
    )
})
.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if(err) {
            res.send(err)
        } else {
            res.send("Success")
        }
    })
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Server started at port 3000')
})