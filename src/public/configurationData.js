export const configurationData = {
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
  	supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M'],
  	exchanges: [
        {
    			value: 'Nasdaq', // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
    			name: 'Nasdaq', // filter name
    			desc: 'Nasdaq', // full exchange name displayed in the filter popup,
          // key: '^NDX'     // as identified in the Finnhub API
    		},
        {
          value: 'SP500', // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
          name: 'SP500', // filter name
          desc: 'SP500', // full exchange name displayed in the filter popup
          // key: '^GSPC'   // as identified in the Finnhub API
        }
  	],
  	symbols_types: [
        {
    		  name: 'Stock',
    		  value: 'Stock', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
  	    }
  	]
}
