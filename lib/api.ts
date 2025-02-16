import { CandlestickData, TimeFrame } from '../types/chart';

interface YahooQuote {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

interface YahooResponse {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: YahooQuote[];
      };
    }>;
  };
}

export async function fetchCandlestickData(
  timeframe: TimeFrame = '1d'
): Promise<CandlestickData[]> {
  try {
    const response = await fetch(`/api/yahoo?timeframe=${timeframe}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as YahooResponse;
    
    if (!data.chart?.result?.[0]) {
      throw new Error('Invalid data structure from Yahoo Finance');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    return timestamps.map((time: number, index: number): CandlestickData => ({
      time: new Date(time * 1000).toISOString(),
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0
    })).filter((item: CandlestickData) => 
      item.open !== 0 && 
      item.high !== 0 && 
      item.low !== 0 && 
      item.close !== 0
    );
  } catch (error) {
    console.error('Error fetching candlestick data:', error);
    throw error;
  }
}