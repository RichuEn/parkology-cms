import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import { Link } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import DeleteDialog from "./DeleteDialog";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: "20px",
    maxWidth: 700,
    padding: "10px"
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

export default function CustomVideoCard(props) {
  const classes = useStyles();
  const [deleteOpts, setDeleteOpts] = useState({
    open: false,
    title: "Are you sure you want to delete this video?",
    toggleDeleteModal: () => {
      setDeleteOpts({ ...deleteOpts, open: !open });
    }
  });

  return (
    <Card className={classes.root}>
      <DeleteDialog
        {...deleteOpts}
        deleteURL={props.deleteURL}
        deleteCallback={props.deleteCallback}
        id={props.id}
      />
      <CardActionArea>
        <Link href={props.url} target="_blank">
          {props.url}
        </Link>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => {
            setDeleteOpts({ ...deleteOpts, open: true });
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
