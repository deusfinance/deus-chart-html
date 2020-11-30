export async function makeApiRequest(path) {
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
