import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const Banner = props => {
  const keys = ["Users"];
  const data = [
    {
      month: "May 2020",
      Users: 92,
      UsersColor: "#c5daef"
    },
    {
      month: "February",
      Users: 80,
      UsersColor: "#6aacd7"
    },
    {
      month: "March",
      Users: 58,
      UsersColor: "#c5daef"
    },
    {
      month: "April",
      Users: 40,
      UsersColor: "#4190c8"
    },
    {
      month: "May",
      Users: 60,
      UsersColor: "#c5daef"
    },
    {
      month: "June",
      Users: 60,
      UsersColor: "#c5daef"
    },
    {
      month: "July",
      Users: 60,
      UsersColor: "#9ec9e2"
    },
    {
      month: "August",
      Users: 60,
      UsersColor: "#4190c8"
    }
  ];
  const commonProps = {
    height: 500,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
    indexBy: "month",
    keys,
    padding: 0.2,
    labelSkipWidth: 16,
    labelSkipHeight: 16
  };
  const divergingCommonProps = {
    ...commonProps,
    data: data,
    indexBy: "month",
    minValue: 0,
    enableGridX: true,
    enableGridY: true,
    labelTextColor: "inherit:darker(1.2)",
    axisTop: {
      tickSize: 0,
      tickPadding: 12
    },
    axisBottom: {
      legend: "Number of registrations per month",
      legendPosition: "middle",
      legendOffset: 50,
      tickSize: 0,
      tickPadding: 12
    },
    axisLeft: null,
    axisRight: {
      format: v => v
    }
  };

  return (
    <ResponsiveBar
      {...divergingCommonProps}
      padding={0.4}
      colors={({ id, data }) => data[`${id}Color`]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      data={props.data}
    />
  );
};
export default Banner;
