export const configurationData = {
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
  	supported_resolutions: ['1', '60', 'D' ],
  	exchanges: [
        {
          value: 'DEUS_Swap', // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
          name: 'DEUS Swap', // filter name
          desc: 'DEUS Swap', // full exchange name displayed in the filter popup,
          type: "Crypto",
          // key: '^NDX'     // as identified in the Finnhub API
        },
        {
    			value: 'Nasdaq', // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
    			name: 'Nasdaq', // filter name
    			desc: 'Nasdaq', // full exchange name displayed in the filter popup,
          type: "Stock",
          // key: '^NDX'     // as identified in the Finnhub API
    		},
        {
          value: 'SP500', // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
          name: 'SP500', // filter name
          desc: 'SP500', // full exchange name displayed in the filter popup
          type: "Stock",
          // key: '^GSPC'   // as identified in the Finnhub API
        }
  	],
  	symbols_types: [
        {
    		  name: 'Stock',
    		  value: 'Stock', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
  	    },
        {
          name: 'Crypto',
          value: 'Crypto', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
        }
  	]
}
