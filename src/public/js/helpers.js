export async function makeApiRequestJSON(path) {
	try {

		const response = await fetch(path);
		return response.json();

	} catch (error) {
		throw new Error(`Finnhub request error: ${error.status}`);
	}
}

export function generateSymbol(exchange, fromSymbol, toSymbol) {

		const short = `${fromSymbol}/${toSymbol}`;
		return {
			short,
			full: `${exchange}:${short}`
		}

}

export function getLanguageFromURL(){
		return 'en'
		if (navigator.languages != undefined) return navigator.languages[1]; // TODO: check what languages are supported in charting_library/static and which arent
	  return navigator.language;
}

export function makeNotification(widget, msg) {
		widget.showNoticeDialog({
				title: 'Notification',
				body: msg,
				callback: () => {}
		});
}
