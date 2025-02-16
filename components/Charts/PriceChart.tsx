"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChartProps } from '../../types/chart';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center bg-[#1B2029] text-white">Loading chart...</div>
});

interface TooltipContext {
  seriesIndex: number;
  dataPointIndex: number;
  w: {
    globals: {
      seriesCandleO: number[][];
      seriesCandleH: number[][];
      seriesCandleL: number[][];
      seriesCandleC: number[][];
    };
  };
}

export const PriceChart: React.FC<ChartProps> = ({ data, height = 500 }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const candlestickData = data.map(item => ({
    x: new Date(item.time).getTime(),
    y: [item.open, item.high, item.low, item.close]
  }));

  const volumeData = data.map(item => ({
    x: new Date(item.time).getTime(),
    y: item.volume
  }));

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: height,
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      }
    },
    grid: {
      borderColor: '#2B3139',
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#26a69a',
          downward: '#ef5350'
        },
        wick: {
          useFillColor: true,
        }
      },
      bar: {
        columnWidth: '40%',
        colors: {
          ranges: [{
            from: 0,
            to: Number.MAX_VALUE,
            color: '#546E7A80'
          }]
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [1, 0.5]
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#DDD'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: [
      {
        seriesName: 'Price',
        tooltip: {
          enabled: true
        },
        labels: {
          style: {
            colors: '#DDD'
          },
          formatter: (value: number) => `$${value.toFixed(2)}`
        }
      },
      {
        seriesName: 'Volume',
        opposite: true,
        labels: {
          style: {
            colors: '#999'
          },
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          }
        }
      }
    ],
    theme: {
      mode: 'dark',
      palette: 'palette1'
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      shared: true,
      intersect: false,
      x: {
        format: 'MMM dd HH:mm'
      },
      y: [
        {
          formatter: function(
            value: number, 
            { seriesIndex, dataPointIndex, w }: TooltipContext
          ): string {
            if (seriesIndex === 0) {
              const o = w.globals.seriesCandleO?.[0]?.[dataPointIndex] ?? 0;
              const h = w.globals.seriesCandleH?.[0]?.[dataPointIndex] ?? 0;
              const l = w.globals.seriesCandleL?.[0]?.[dataPointIndex] ?? 0;
              const c = w.globals.seriesCandleC?.[0]?.[dataPointIndex] ?? 0;
              return `
                O: $${o.toFixed(2)}
                H: $${h.toFixed(2)}
                L: $${l.toFixed(2)}
                C: $${c.toFixed(2)}
              `;
            }
            return value.toLocaleString();
          }
        },
        {
          formatter: function(value: number): string {
            if (value >= 1000000) return `Volume: ${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `Volume: ${(value / 1000).toFixed(1)}K`;
            return `Volume: ${value}`;
          }
        }
      ]
    }
  };

  const series = [
    {
      name: 'Price',
      type: 'candlestick',
      data: candlestickData
    },
    {
      name: 'Volume',
      type: 'bar',
      data: volumeData
    }
  ];

  if (!isClient) {
    return (
      <div className="bg-[#1B2029] rounded-lg p-4 h-[500px] flex items-center justify-center text-white">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="bg-[#1B2029] rounded-lg p-4">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  );
};

export default PriceChart;