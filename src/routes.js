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

router.get("/", async (req, res) => {
    res.render("index.html", {
        symbols: JSON.stringify(await Worker.getSymbols())
    })
})

// TODO: use local version of candlesticks to bypass the event of a throtted queue.
router.get("/candles", (req, res) => {

    const url = Helpers.buildUrlFromQuery(req.query)

    // Return when API is down, isApiDown() is run by a cronjob so this is not foolproof when request is made before the next health check.
    if (req.query.exchange == "DEUS Swap" && Worker.getIsApiDown()) return res.send(JSON.stringify({isApiDown: true}))

    // Queue takes care of the Finnhub API rate limit
    // TODO: remove database candlesticks from Queue
    Queue.add(() => {
        fetch(url)
            .then(resDB => {
                // In case the database API is down and wasn't catched by Worker.isApiDown()
                return (resDB.status != 200)
                    ? JSON.stringify({isApiDown: true})
                    : resDB.json();
            })
            .then(json => res.send(json))
        .catch(err => {
            console.error(err);
        })
    })

})

module.exports = router
