import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  root: {},
  revenueBox: {
    padding: theme.spacing(0)
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

export default function CategoriesCard(props) {
  const classes = useStyles();
  return (
    <Card
      className={classes.root}
      variant="outlined"
      elevation={1}
      style={{ background: props.selected ? "#009ad8" : "white" }}
      onClick={props.onClick}
    >
      <CardActionArea className={classes.revenueBox}>
        <CardContent className={classes.revenueBoxAmmount}>
          <h3>{props.title}</h3>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.smallDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
