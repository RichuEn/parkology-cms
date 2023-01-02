import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ResponsiveBar } from "@nivo/bar";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  root: {},
  revenueBox: {
    padding: theme.spacing(0)
  },
  paperSmall: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 250
  },
  revenueBoxAmmount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center"
  },
  card: {
    background: "white"
  }
}));

export default function AnalyticsLessonCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root} variant="outlined" elevation={1}>
      <CardContent className={classes.revenueBoxAmmount}>
        <div className={classes.paperSmall}>
          <Typography color="primary">{props.title}</Typography>
          <ResponsiveBar
            margin={{ top: 20, right: 200, bottom: 70, left: 50 }}
            innerPadding={13}
            data={props.data}
            keys={["no_of_visitors", "users_completed"]}
            indexBy={"lesson_id"}
            groupMode="grouped"
            layout="horizontal"
            width={400}
            axisTop={null}
            axisRight={null}
            borderRadius={3}
            tooltip={({ id, value, color }) => {
              let label = id;
              switch (id) {
                case "no_of_visitors":
                  label = "Subscribed";
                  break;
                case "users_completed":
                  label = "Completed";
                default:
                  break;
              }
              return (
                <strong>
                  {label}: {value}
                </strong>
              );
            }}
            axisLeft={{
              enabled: false,
              renderTick: () => <div />,
              legend: "",
              legendPosition: "middle",
              legendOffset: 10
            }}
            axisBottom={{
              enabled: false,
              renderTick: () => <div />
            }}
            colors={{ scheme: "blues" }}
            legends={[
              {
                dataFrom: "legendsTitle",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 5,
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
            animate={false}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </CardContent>
    </Card>
  );
}
