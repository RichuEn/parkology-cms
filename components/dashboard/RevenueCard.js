import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AccountBalanceWalletRoundedIcon from "@material-ui/icons/AccountBalanceWalletRounded";
import Title from "./Title";

const useStyles = makeStyles(theme => ({
  revenueBox: {
    padding: theme.spacing(1)
  },
  revenueBoxAmmount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  card: {
    background: "white"
  }
}));

export default function RevenueCard(props) {
  const classes = useStyles();

  return (
    <Card variant="outlined" elevation={1} className={classes.card}>
        <CardContent>
          <Title>{props.title}</Title>
          <div className={classes.revenueBoxAmmount}>
            <Typography gutterBottom variant="h6" component="h3">
              {props.amount}
            </Typography>
            {props.icon ? props.icon : <AccountBalanceWalletRoundedIcon />}
          </div>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.smallDescription}
          </Typography>
        </CardContent>
    </Card>
  );
}
