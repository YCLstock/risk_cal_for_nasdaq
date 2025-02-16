export interface CandlestickData {
  time: string;  // ISO 格式的時間字符串
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '1d';

export interface ChartProps {
  data: CandlestickData[];
  height?: number;
}