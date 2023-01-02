import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import DeleteDialog from "./DeleteDialog";

const useStyles = makeStyles(theme => ({
  root: {
    // marginBottom: "20px",
    // maxWidth: '100%',
    // padding: "10px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  media: {
    minHeight: 140
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  listRoot: {
    width: "100%",

    backgroundColor: theme.palette.background.paper
  },
  formControl: {
    margin: theme.spacing(0)
  }
}));

export default function CustomVideoCardWithUpdate(props) {
  const classes = useStyles();


  return (
    <div>
      <div className={classes.root}>
        {props.url != "" ? (<>

          <video width="320" height="240" controls>
            <source src={props.url} type="video/mp4" />
            <source src={props.url} type="video/ogg" />
          </video>
        </>) : (<></>)}
      </div>
    </div>
  );
}
