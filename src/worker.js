const fetch = require('node-fetch');

module.exports = class Worker {
    constructor() {
        this.symbols = {}
        this.isApiDown = true // default, gets overrun by initApiHealthCheck, if down then this is 100% accurate, if up then overrun within ~1 seconds

        this.initSymbols()
        this.initApiHealthCheck()
    }

    // TODO: use offline version of symbols in dev
    // TODO: beautify this
    async initSymbols() {

        let sp500 = await this.makeApiRequestJSON(`https://finnhub.io/api/v1/index/constituents?symbol=^GSPC&token=${process.env.FINNHUB_API_KEY}`);
        let nasdaq = await this.makeApiRequestJSON(`https://finnhub.io/api/v1/index/constituents?symbol=^NDX&token=${process.env.FINNHUB_API_KEY}`);

        sp500 = sp500.constituents.map(symbol => {
            return {
                symbol: symbol,
                pair: "USD"
            }
        })
        nasdaq = nasdaq.constituents.map(symbol => {
            return {
                symbol: symbol,
                pair: "USD"
            }
        })

        // Merge the exchanges
        const data = {
            "DEUS Swap": [ // TODO: turn this into an API - dynamic
              {
                symbol: "DEUS",
                pair: "ETH"
              }
            ],
            SP500: sp500,
            Nasdaq: nasdaq
        }

        // We do not resolve the symbols here, this happens client-side.
        return this.symbols = data;

    } // End of initSymbols()

    initApiHealthCheck() {

        const checkStatus = async () => {
            const res = await this.makeApiRequest(`${process.env.POSTGRESS_URL}/candles?format=json&from=1572446556&resolution=60&to=1606661016`)
            return (res.status != 200)
                ? this.isApiDown = true
                : this.isApiDown = false;
        }

        checkStatus() // on init
        setInterval(async () => {
            checkStatus()
        }, 5 * 60 * 1000) // every 5 minutes
    }

    // TODO: make this dynamic with setInterval and an external API
    async getSymbols() {

        return (Object.getOwnPropertyNames(this.symbols).length)
            ? this.symbols
            : await this.initSymbols();

    } // End of getSymbols()

    getIsApiDown() {
        return this.isApiDown
    }

    async makeApiRequest(path) {

        try {
            return fetch(path);
        } catch (error) {
            throw new Error(`Request error: ${error.status}`);
        }

    } // End of makeApiRequest()

    async makeApiRequestJSON(path) {

        try {
        		const response = await fetch(path);
        		return response.json();
      	} catch (error) {
        		throw new Error(`Request error: ${error.status}`);
      	}

    } // End of makeApiRequestJSON()

}
