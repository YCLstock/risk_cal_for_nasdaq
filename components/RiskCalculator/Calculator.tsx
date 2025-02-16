"use client";

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

// MNQ 合約相關常數
const POINT_VALUE = 2; // 每點 $2
// const TICK_SIZE = 0.25; // 最小變動 0.25 點
// const TICK_VALUE = POINT_VALUE * TICK_SIZE; // 每tick $0.50

export const RiskCalculator = () => {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(16000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(15980);

  // 計算邏輯
  const riskAmount = accountSize * (riskPercentage / 100);
  const priceDifference = Math.abs(entryPrice - stopLossPrice);
  const pointDifference = priceDifference; // MNQ 中點數和價格差相同
  const riskPerContract = pointDifference * POINT_VALUE;
  const maxPositionSize = Math.floor(riskAmount / riskPerContract);
  const totalRiskInPoints = pointDifference * maxPositionSize;

  // 風險等級計算
  const getRiskLevel = (percentage: number) => {
    if (percentage <= 1) return { level: 'Low', color: 'text-green-400' };
    if (percentage <= 2) return { level: 'Medium', color: 'text-yellow-400' };
    return { level: 'High', color: 'text-red-400' };
  };

  const riskLevel = getRiskLevel(riskPercentage);

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-2xl text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">MNQ Risk Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 輸入區域 */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Account & Risk Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Size ($)
                </label>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Risk Percentage (%)
                </label>
                <input
                  type="number"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className={`mt-1 text-sm ${riskLevel.color} flex items-center`}>
                  {riskPercentage > 2 && <AlertTriangle size={16} className="mr-1" />}
                  Risk Level: {riskLevel.level}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Position Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Entry Price
                </label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-1 text-sm text-gray-400">
                  Distance: {pointDifference} points (${(pointDifference * POINT_VALUE).toFixed(2)})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 結果區域 */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-6 text-blue-300">Risk Analysis</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Maximum Risk Amount</div>
              <div className="text-2xl font-bold text-green-400">
                ${riskAmount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {riskPercentage}% of account size
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Risk per Contract</div>
              <div className="text-2xl font-bold text-yellow-400">
                {pointDifference} points (${riskPerContract.toFixed(2)})
              </div>
              <div className="text-xs text-gray-500 mt-1">
                $2 per point
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Maximum Position Size</div>
              <div className="text-2xl font-bold text-blue-400">
                {maxPositionSize} contracts
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Total Risk: {totalRiskInPoints} points (${(totalRiskInPoints * POINT_VALUE).toFixed(2)})
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Contract Specifications:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Point Value: $2.00 per point</li>
              <li>Minimum Tick: 0.25 points ($0.50)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;