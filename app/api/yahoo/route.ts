import { NextResponse } from 'next/server';
import { TimeFrame } from '@/types/chart';

const intervalMap: Record<TimeFrame, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '60m',
  '1d': '1d'
};

const rangeMap: Record<TimeFrame, string> = {
  '1m': '7d',
  '5m': '7d',
  '15m': '7d',
  '30m': '7d',
  '1h': '30d',
  '1d': '1y'
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') as TimeFrame || '1d';

  try {
    const interval = intervalMap[timeframe];
    const range = rangeMap[timeframe];
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/MNQ=F?interval=${interval}&range=${range}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}