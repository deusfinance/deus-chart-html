import {
	makeApiRequest,
	generateSymbol,
} from './helpers.js';
import {
	configurationData
} from './configurationData.js';

export default class Datafeed {
		constructor(options) {
				this.debug = options.debug || false;
				this.symbols = [];
				this.lastBarsCache = new Map();
		}

		onReady(callback) {
				this.debug && console.log('[onReady]: Method call');

				this.symbols = this.getSymbols();
				callback(configurationData);
		} // End of onReady()

		getSymbols() {

				const data = JSON.parse(localStorage.getItem('symbols'))

				let allSymbols = [];
				for (const exchange of configurationData.exchanges) {

						const assets = data[exchange.value];
						const symbols = assets.map(asset => {
								const symbol = generateSymbol(exchange.value, asset.symbol, asset.pair);
								return {
										symbol: asset.symbol,
										pair: asset.pair,
										full_name: symbol.full,
										description: symbol.short,
										exchange: exchange.value,
										type: exchange.type,
								};
						});
						allSymbols = [...allSymbols, ...symbols];

				} // End of for {exchange}

				return allSymbols;

		} // End of getSymbols()

		async searchSymbols ( userInput, exchange, symbolType, onResultReadyCallback) {
				this.debug && console.log('[searchSymbols]: Method call');

				onResultReadyCallback(
						this.symbols.filter(symbol => {
								const isExchangeValid = exchange === '' || symbol.exchange === exchange;
								const isFullSymbolContainsInput = symbol.full_name
									.toLowerCase()
									.indexOf(userInput.toLowerCase()) !== -1;
								return isExchangeValid && isFullSymbolContainsInput;
					 	})
				)

		} // End of searchSymbols()

		async resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
				this.debug && console.log('[resolveSymbol]: Method call', symbolName);

				// Find symbol from the list => 1st try is the default method, second try is a fix for when users use arrow keys to select a symbol.
				let symbolItem = this.symbols.find(({full_name}) => full_name === symbolName);
				symbolItem = (!symbolItem)
						? this.symbols.find(({symbol}) => symbol === symbolName)
						: symbolItem;

				if (!symbolItem) return onResolveErrorCallback('[resolveSymbol]: Cannot resolve symbol');

				// TODO: make this dynamic
				onSymbolResolvedCallback({
						name: symbolItem.description, // needs fixing (this is the upperleft symbol in the chart)
						description: symbolItem.description,
						type: symbolItem.type,
						symbol: symbolItem.symbol,
						pair: symbolItem.pair,
						session: '24x7',
						timezone: 'Etc/UTC',
						exchange: symbolItem.exchange,
						minmov: 1,
						pricescale: 1000000, // TODO: make this dynamic per token.
						has_intraday: true,
						has_no_volume: true, // TODO: set to false when we've fixed the volume, something looks weird
						has_weekly_and_monthly: true,
						supported_resolutions: configurationData.supported_resolutions,
						volume_precision: 100, // TODO: something is wrong with the volume
						data_status: 'streaming',
				});

		} // End of resolveSymbol()

		async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {

				this.debug && console.log('[getBars]: Method call', symbolInfo, resolution, from, to);

				// TODO: create urlParameters from class in different file and not here
				const urlParameters = {
						exchange: symbolInfo.exchange,
						type: symbolInfo.type,
						symbol: symbolInfo.symbol,
						pair: symbolInfo.pair,
						resolution: resolution,
						from: from,
						to: to
				}

				// TODO: use helper function for this
				const query = Object.keys(urlParameters)
						.map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
						.join('&');

				try {

						const data = await makeApiRequest(`${window.location.href}candles?${query}`)
						this.resolveBars(data, symbolInfo, from, to, firstDataRequest, onHistoryCallback)
				} catch (error) {
						console.log('[getBars]: Get error', error);
						onErrorCallback(error);
				} // End of try-catch

		} // End of getBars()

		resolveBars(data, symbolInfo, from, to, firstDataRequest, onHistoryCallback) {

				const isInvalidData = (symbolInfo.type == "Stocks")
						? data.s != "ok" || data.c.length <= 1
						: data.length <= 1;

				if (isInvalidData) {
						return onHistoryCallback([], { noData: true	});
				}

				const reduceStocks = (data) => {
						return data.t.reduce((acc, bar, index) => {
								if (bar <= from && bar > to) return acc;
								const obj = {
									time: bar * 1000,
									low: data.l[index],
									high: data.h[index],
									open: data.o[index],
									close: data.c[index],
									volume: data.v[index],
								};
								acc.push(obj);
								return acc;
						}, [])
				}

				const reduceCrypto = (data) => {
						return data.reduce((acc, bar, index) => {
								if (bar.t <= from && bar.t > to) return acc;
								const obj = {
									time: bar.t * 1000,
									low: bar.l,
									high: bar.h,
									open: bar.o,
									close: bar.c,
									volume: bar.v,
								};
								acc.push(obj);
								return acc;
						}, [])
				}

				const new_bars = (symbolInfo.type == "Stock")
						? reduceStocks(data)
						: reduceCrypto(data);

				if (firstDataRequest) {
						this.lastBarsCache.set(symbolInfo.full_name, {
							...new_bars[new_bars.length - 1],
						});
				}

				this.debug && console.log(`[getBars]: returned ${new_bars.length} bar(s)`);
				onHistoryCallback(new_bars, {	noData: false });
		}

		// This function is currently disabled (it does exactly nothing)
		subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
				this.debug && console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
		} // End of subscribeBars()

		// This function is currently disabled (it does exactly nothing)
		unsubscribeBars (subscriberUID) {
				this.debug && console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
		} // End of unsubscribeBars()
}
