import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, orders) {
  return { time, orders };
}

const data = [
  createData('1', 0),
  createData('2', 0),
  createData('3', 0),
  createData('4', 100),
  createData('5', 0),
  createData('6', 20),
  createData('7', 25),
  createData('8', 3),
  createData('9', 13),
  createData('10', 15),
  createData('11', 23),
  createData('12', 28),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Orders quantity for January 2020</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <Tooltip />
          <Legend />
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Qty
            </Label>
          </YAxis>
          <Line strokeWidth={2} type="monotone" dataKey="orders" stroke={theme.palette.primary.main} dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
