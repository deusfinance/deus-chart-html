"use strict"

const self = module.exports = {

    /**
     * @param {query.exchange} String Nasdaq or DEUS-Swap etc
     * @param {query.type} String
     * @param {query.symbol} String
     * @param {query.resolution} String
     * @param {query.from} String
     * @param {query.to} String
     * @output {url} String
     */
    buildUrlFromQuery: (query) => {
        return (query.type == "Stock")
            ? self.buildFinnhubURL(query)
            : self.buildDatabaseURL(query);
    },

    buildFinnhubURL: ({ symbol, resolution, from, to } = query) => {

        // Finnhub API accepts the fields, whilst Tradingview works with the keys.
        const interval = {
        		"1": "1",
        		"1m": "1",
        		"5": "5",
        		"5m": "5",
        		"15": "15",
        		"15m": "15",
        		"30": "30",
        		"30m": "30",
        		"60": "60",
        		"60m": "60",
        		"D": "D",
        		"1D": "D",
        		"W": "W",
        		"1W": "W",
        		"M": "M",
        		"1M": "M"
        }[resolution]
        return `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${interval}&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`
    },

    buildDatabaseURL: ({ symbol, pair, resolution, from, to } = query) => {
        const interval = {
            "1": "1m",
            "1m": "1m",
            "5": "5m",
            "5m": "5m",
            "15": "15m",
            "15m": "15m",
            "30": "30m",
            "30m": "30m",
            "60": "1h",
            "60m": "1h",
            "D": "1d",
            "1D": "1d",
            "W": "1W",
            "1W": "1W",
            "M": "1M",
            "1M": "1M"
        }[resolution]

        // return `http://127.0.0.1:3000/candles?symbol=${symbol + pair}&interval=${interval}&from=${from}&to=${to}`
        return `${process.env.DEUS_CANDLES_URL}/candles?symbol=${symbol + pair}&interval=${interval}&from=${from}&to=${to}`

    }
}
