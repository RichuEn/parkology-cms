import React, { useState, useEffect } from "react";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    border: "1px solid grey"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));

export default function CaterersBox(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.secondaryHeading}>
            Caterers Involved
          </Typography>
        </Grid>
        {props.dataSource
          ? props.dataSource.map(row => (
              <Grid item xs={4}>
                <Avatar
                  alt={row.caterer_name}
                  src={row.caterer_logo}
                  className={classes.large}
                />
                <Typography className={classes.secondaryHeading}>
                  {row.caterer_name}
                </Typography>
              </Grid>
            ))
          : null}
      </Grid>
    </div>
  );
}
