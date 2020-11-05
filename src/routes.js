"use strict"

// Packages
const fetch = require('node-fetch');
const path = require('path')
const router = require('express').Router({ mergeParams: true});

// Dependencies
const Worker = new (require("./worker"));
const Queue = new (require("./queue"));

router.use(async (req, res, next) => {

    // TODO: IP Rate limiter and stuff here
    next()
})

router.get("/", (req, res) => {
    res.render("index.html", {
        symbols: JSON.stringify(Worker.getSymbols())
    })
})

// TODO: make this less clumsy
// TODO: use local version of candlesticks to bypass the event of a throtted queue.
router.get("/candles", (req, res) => {

    const urlParameters = req.query
    const query = Object.keys(urlParameters)
        .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
        .join('&');

    const url = `https://finnhub.io/api/v1/stock/candle?${query}&token=${process.env.FINNHUB_API_KEY}`

    // Queue takes care of the Finnhub API rate limit 
    Queue.add(() => {
        fetch(url)
            .then(res => res.json())
            .then(json => res.send(json))
        .catch(err => {
          console.log(err);
        })
    })

})

module.exports = router
