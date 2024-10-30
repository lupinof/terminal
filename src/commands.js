import { getCoinInfo, getMarketStats, getPrice, getTopCoins } from './api.js';

export const commands = {
    help: (term) => {
        term.writeln('\r\n\x1B[1;32mAvailable commands:\x1B[0m');
        term.writeln('  price <symbol>     - Get current price of a cryptocurrency (e.g., price bitcoin)');
        term.writeln('  info <symbol>      - Get detailed information about a cryptocurrency');
        term.writeln('  top               - Show top 10 cryptocurrencies by market cap');
        term.writeln('  market            - Show global market statistics');
        term.writeln('  clear             - Clear the terminal');
        term.writeln('  help              - Show this help message\n');
    },

    async price(term, symbol) {
        if (!symbol) {
            term.writeln('\r\nPlease provide a cryptocurrency symbol (e.g., price bitcoin)');
            return;
        }
        try {
            const price = await getPrice(symbol);
            if (price) {
                term.writeln(`\r\n${symbol.toUpperCase()}: $${price.toLocaleString()}`);
            } else {
                term.writeln('\r\nUpdate soon');
            }
        } catch (error) {
            term.writeln('\r\nUpdate soon');
        }
    },

    async info(term, symbol) {
        if (!symbol) {
            term.writeln('\r\nPlease provide a cryptocurrency symbol (e.g., info bitcoin)');
            return;
        }
        try {
            const data = await getCoinInfo(symbol);
            term.writeln('\r\n\x1B[1;32m=== ' + data.name + ' (' + data.symbol.toUpperCase() + ') ===\x1B[0m');
            term.writeln(`Price: $${data.market_data.current_price.usd.toLocaleString()}`);
            term.writeln(`Market Cap: $${data.market_data.market_cap.usd.toLocaleString()}`);
            term.writeln(`24h Change: ${data.market_data.price_change_percentage_24h.toFixed(2)}%`);
            term.writeln(`All Time High: $${data.market_data.ath.usd.toLocaleString()}`);
        } catch (error) {
            term.writeln('\r\nUpdate soon');
        }
    },

    async top(term) {
        try {
            const coins = await getTopCoins();
            term.writeln('\r\n\x1B[1;32m=== Top 10 Cryptocurrencies ===\x1B[0m');
            term.writeln('Rank | Symbol |    Price    | 24h Change | Market Cap');
            term.writeln('----------------------------------------------------');
            coins.forEach((coin, index) => {
                const change = coin.price_change_percentage_24h.toFixed(2);
                const changeColor = change >= 0 ? '\x1B[32m' : '\x1B[31m';
                term.writeln(
                    `${(index + 1).toString().padEnd(4)} | ` +
                    `${coin.symbol.toUpperCase().padEnd(6)} | ` +
                    `$${coin.current_price.toLocaleString().padStart(10)} | ` +
                    `${changeColor}${change}%\x1B[0m | ` +
                    `$${(coin.market_cap / 1e9).toFixed(2)}B`
                );
            });
            term.writeln('');
        } catch (error) {
            term.writeln('\r\nUpdate soon');
        }
    },

    async market(term) {
        try {
            const stats = await getMarketStats();
            term.writeln('\r\n\x1B[1;32m=== Global Crypto Market Stats ===\x1B[0m');
            term.writeln(`Total Market Cap: $${(stats.total_market_cap.usd / 1e12).toFixed(2)}T`);
            term.writeln(`24h Volume: $${(stats.total_volume.usd / 1e9).toFixed(2)}B`);
            term.writeln(`BTC Dominance: ${stats.market_cap_percentage.btc.toFixed(2)}%`);
            term.writeln(`Active Cryptocurrencies: ${stats.active_cryptocurrencies}`);
            term.writeln(`Markets: ${stats.markets}\n`);
        } catch (error) {
            term.writeln('\r\nUpdate soon');
        }
    },

    clear(term) {
        term.clear();
    }
};