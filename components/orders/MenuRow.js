import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    marginLeft: theme.spacing(2)
  }
}));

export default function MenuRow(props) {
  const classes = useStyles();

  return (
    <Accordion elevation={1}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        expanded
      >
        <Avatar
          variant="rounded"
          alt="Fit In"
          src="https://s3.eu-west-1.amazonaws.com/media.caterly.co/caterers/12/39/2.jpg"
          className={classes.large}
        />
        <Typography className={classes.heading}>{props.title}</Typography>
        <Typography variant="p">Logma</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              color={"primary"}
              variant="inherit"
              className={classes.special}
            >
              Special Request
            </Typography>
            <Typography className={classes.heading}>
              {props.specialRequest}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography
              color={"primary"}
              variant="inherit"
              className={classes.special}
            >
              Items
            </Typography>
            <List className={classes.root}>
              {props.items.map(row => (
                <>
                  <ListItem>
                    <ListItemText
                      primary={row.title}
                      secondary={row.description}
                    />
                    <p>{`x${row.quantity}`}</p>
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
