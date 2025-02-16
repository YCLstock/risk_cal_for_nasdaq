"use client";

import { useState, useEffect } from 'react';
import RiskCalculator from '../components/RiskCalculator/Calculator';
import PriceChart from '../components/Charts/PriceChart';
import { fetchCandlestickData } from '../lib/api';
import { CandlestickData, TimeFrame } from '../types/chart';

export default function Home() {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchCandlestickData(timeframe);
        setChartData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [timeframe]);

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Futures Risk Management System
        </h1>

        {/* 圖表控制項 */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex gap-4 mb-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
              className="bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="30m">30 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="1d">1 Day</option>
            </select>
          </div>

          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center text-white">
              Loading...
            </div>
          ) : error ? (
            <div className="h-[500px] flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <PriceChart data={chartData} />
          )}
        </div>

        {/* 風險計算器 */}
        <RiskCalculator />
      </div>
    </main>
  );
}