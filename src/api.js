import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function getPrice(symbol) {
    try {
        const response = await axios.get(`${COINGECKO_API}/simple/price?ids=${symbol}&vs_currencies=usd`);
        return response.data[symbol]?.usd;
    } catch (error) {
        throw new Error('Error fetching price data');
    }
}

export async function getTopCoins() {
    try {
        const response = await axios.get(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching market data');
    }
}

export async function getCoinInfo(symbol) {
    try {
        const response = await axios.get(`${COINGECKO_API}/coins/${symbol}?localization=false&tickers=false&community_data=false&developer_data=false`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching coin info');
    }
}

export async function getMarketStats() {
    try {
        const response = await axios.get(`${COINGECKO_API}/global`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error fetching market stats');
    }
}