import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const Banner = props => {
  return (
    <ResponsiveBar
      data={props.data}
      keys={props.keys}
      indexBy={props.indexBy}
      layout={props.layout}
      margin={props.margin}
      innerPadding={props.innerPadding}
      padding={props.padding || 0.3}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={props.axisTop ? props.axisTop : null}
      axisRight={props.axisRight ? props.axisRight : null}
      axisBottom={props.axisBottom ? props.axisBottom : null}
      axisLeft={props.axisLeft ? props.axisLeft : null}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};
export default ResponsiveBar;
