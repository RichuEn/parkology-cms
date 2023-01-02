import React from "react";
import { ResponsivePie } from "@nivo/pie";

const Pie = props => {
  return (
    <ResponsivePie
      data={props.data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.3}
      padAngle={3}
      cornerRadius={5}
      colors={{ scheme: "blues" }}
      borderWidth={2}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: "color" }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#333333"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};
export default Pie;
