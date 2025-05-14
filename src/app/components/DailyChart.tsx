'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const data = [
  { date: '07 May', rentals: 5 },
  { date: '08 May', rentals: 5 },
  { date: '09 May', rentals: 5 },
  { date: '10 May', rentals: 5 },
  { date: '11 May', rentals: 5 },
  { date: '12 May', rentals: 1 },
  { date: '13 May', rentals: 7 },
];

export default function DailyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRental" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#42a5f5" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#42a5f5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="rentals" stroke="#42a5f5" fill="url(#colorRental)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
