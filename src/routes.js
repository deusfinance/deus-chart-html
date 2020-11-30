"use strict"

// Packages
const fetch = require('node-fetch');
const path = require('path')
const router = require('express').Router({ mergeParams: true});

// Dependencies
const Worker = new (require("./worker"));
const Queue = new (require("./queue"));
const Helpers = require("./helpers");

router.use(async (req, res, next) => {

    // TODO: IP Rate limiter and stuff here
    next()
})

router.get("/", (req, res) => {
    res.render("index.html", {
        symbols: JSON.stringify(Worker.getSymbols())
    })
})

// TODO: use local version of candlesticks to bypass the event of a throtted queue.
router.get("/candles", (req, res) => {

    const url = Helpers.buildUrlFromQuery(req.query)

    // Queue takes care of the Finnhub API rate limit
    // TODO: remove database candlesticks from Queue
    Queue.add(() => {
        fetch(url)
            .then(res => {
                // In case the database is down.
                return (res.status != 200)
                    ? []
                    : res.json();
            })
            .then(json => res.send(json))
        .catch(err => {
            console.error(err);
        })
    })

})

module.exports = router
