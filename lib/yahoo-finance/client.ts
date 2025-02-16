import { YAHOO_FINANCE_API_URL, DEFAULT_SYMBOL } from '../constants';

export interface YahooFinanceData {
  timestamp: number[];
  indicators: {
    quote: Array<{
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>;
  };
}

export interface ParsedYahooData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class YahooFinanceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = YAHOO_FINANCE_API_URL;
  }

  private async fetchData(symbol: string, period: string, interval: string): Promise<YahooFinanceData> {
    const url = `${this.baseUrl}${symbol}?range=${period}&interval=${interval}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.chart.result[0];
    } catch (error) {
      console.error('Error fetching data from Yahoo Finance:', error);
      throw error;
    }
  }

  public async getHistoricalData(
    symbol: string = DEFAULT_SYMBOL,
    period: string = '1d',
    interval: string = '15m'
  ): Promise<ParsedYahooData[]> {
    const data = await this.fetchData(symbol, period, interval);
    
    return data.timestamp.map((time, index) => ({
      timestamp: time * 1000, // Convert to milliseconds
      open: data.indicators.quote[0].open[index],
      high: data.indicators.quote[0].high[index],
      low: data.indicators.quote[0].low[index],
      close: data.indicators.quote[0].close[index],
      volume: data.indicators.quote[0].volume[index]
    }));
  }

  public async getCurrentPrice(symbol: string = DEFAULT_SYMBOL): Promise<number> {
    const data = await this.fetchData(symbol, '1d', '1m');
    const lastIndex = data.indicators.quote[0].close.length - 1;
    return data.indicators.quote[0].close[lastIndex];
  }
}

export const yahooFinanceClient = new YahooFinanceClient();
export default yahooFinanceClient;