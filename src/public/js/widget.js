import Datafeed from './datafeed.js';
import { getLanguageFromURL } from './helpers.js';

const widget = window.tvWidget = new TradingView.widget({
		debug: true, // tradingview logs
		symbol: 'DEUS Swap:DEUS/ETH', // default symbol
		interval: 'D', // default interval
		fullscreen: true, // displays the chart in the fullscreen mode
		container_id: 'tv_chart_container',
		datafeed: new Datafeed({ debug: true }), // our own datafeed + logs
		library_path: '../charting_library/',
		locale: getLanguageFromURL() || "en",
		drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
		disabled_features: ["use_localstorage_for_settings"],
		charts_storage_api_version: "1.1",
		client_id: 'tradingview.com',
		user_id: 'public_user_id',
		theme: "Dark",
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});
