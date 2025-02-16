// API 配置
export const YAHOO_FINANCE_API_URL = 'https://query2.finance.yahoo.com/v8/finance/chart/';
export const DEFAULT_SYMBOL = 'MNQ=F';

// 風險管理配置
export const DEFAULT_RISK_PERCENTAGE = 1; // 預設風險比例 1%
export const DEFAULT_MARGIN_REQUIREMENT = 1980; // MNQ 預設保證金要求
export const TICK_SIZE = 0.25; // MNQ 最小價格變動單位
export const TICK_VALUE = 0.50; // 每個 tick 的價值（美元）
export const CONTRACT_MULTIPLIER = 2; // MNQ 合約乘數

// 介面配置
export const DEFAULT_CHART_PERIOD = '1d';
export const DEFAULT_CHART_INTERVAL = '15m';

// 計算相關常數
export interface Position {
  entryPrice: number;
  stopLossPrice: number;
  takeProfit?: number;
  quantity: number;
}

export interface RiskParameters {
  accountSize: number;
  riskPercentage: number;
  position: Position;
}

// 計算風險金額
export const calculateRiskAmount = (accountSize: number, riskPercentage: number): number => {
  return accountSize * (riskPercentage / 100);
};

// 計算最大倉位大小
export const calculateMaxPositionSize = (
  riskAmount: number,
  entryPrice: number,
  stopLossPrice: number
): number => {
  const riskPerContract = Math.abs(entryPrice - stopLossPrice) * CONTRACT_MULTIPLIER;
  return Math.floor(riskAmount / riskPerContract);
};

// 計算預期獲利
export const calculateExpectedProfit = (
  position: Position,
  winRate: number,
  riskRewardRatio: number
): number => {
  const riskPerTrade = Math.abs(position.entryPrice - position.stopLossPrice) * 
                       CONTRACT_MULTIPLIER * 
                       position.quantity;
  const expectedProfitPerTrade = riskPerTrade * riskRewardRatio;
  return (winRate / 100) * expectedProfitPerTrade - ((100 - winRate) / 100) * riskPerTrade;
};