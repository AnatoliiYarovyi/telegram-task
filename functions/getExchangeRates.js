import axios from 'axios';

let dataMono = {
	data: null,
	date: null,
};

const getDataMono = async () => {
	const differentTimes = dataMono?.date
		? (new Date().valueOf() - dataMono?.date) / 1000 < 300
		: false;

	if (differentTimes) {
		return dataMono;
	} else {
		try {
			const data = await axios.get(
				'https://api.monobank.ua/bank/currency',
			);
			dataMono.data = data.data;
			dataMono.date = new Date().valueOf();

			return dataMono;
		} catch (error) {
			throw error;
		}
	}
};

const getExchangeRates = async (currency) => {
	if (currency === 'USD') {
		const dataPrivat = await getDataPrivat();
		const codeUSD = 840;
		const message = await currencyFilter(currency, codeUSD, dataPrivat);
		return message;
	} else if (currency === 'EUR') {
		const dataPrivat = await getDataPrivat();
		const codeEUR = 978;
		const message = await currencyFilter(currency, codeEUR, dataPrivat);
		return message;
	}

	async function getDataPrivat() {
		try {
			const data = await axios.get(
				'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11',
			);
			return data.data;
		} catch (error) {
			throw error;
		}
	}

	async function currencyFilter(currency, code, dataPrivat) {
		const messagePrivat = dataPrivat.reduce((acc, el) => {
			if (el.ccy === currency) {
				acc += `\nPrivat:\n${Number(el.buy).toFixed(
					2,
				)} → ${currency} → ${Number(el.sale).toFixed(2)}`;
			}
			return acc;
		}, ``);

		const monoDate = await getDataMono();
		const messageMono = monoDate.data.reduce((acc, el) => {
			if (el.currencyCodeA === code && el.currencyCodeB === 980) {
				acc += `\nMono:\n${Number(el.rateBuy).toFixed(
					2,
				)} → ${currency} → ${Number(el.rateSell).toFixed(2)}`;
			}
			return acc;
		}, ``);

		return `${messagePrivat}${messageMono}`;
	}
};

export { getExchangeRates };
