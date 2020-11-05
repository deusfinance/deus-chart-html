const fetch = require('node-fetch');

module.exports = class Worker {
    constructor() {
        this.symbols = {}

        this.initSymbols()
    }

    // TODO: use offline version of symbols in dev
    async initSymbols() {

        const sp500 = await this.makeApiRequest(`https://finnhub.io/api/v1/index/constituents?symbol=^GSPC&token=${process.env.FINNHUB_API_KEY}`);
        const nasdaq = await this.makeApiRequest(`https://finnhub.io/api/v1/index/constituents?symbol=^NDX&token=${process.env.FINNHUB_API_KEY}`);

        // Merge the two exchanges
        const data = {
            SP500: sp500.constituents,
            Nasdaq: nasdaq.constituents
        }

        // We do not resolve the symbols here, for now let it happen client-side.
        return this.symbols = data;

    } // End of initSymbols()

    // TODO: make this dynamic with setInterval
    getSymbols() {

        return (Object.getOwnPropertyNames(this.symbols).length)
            ? this.symbols
            : this.initSymbols();

    } // End of getSymbols()

    async makeApiRequest(path) {

        try {

        		const response = await fetch(path);
        		return response.json();

      	} catch (error) {
        		throw new Error(`Request error: ${error.status}`);
      	}

    } // End of makeApiRequest()

}
