import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import DeleteDialog from "./DeleteDialog";
import * as apis from "./../data/apiConfig";

import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "20px",
    // maxWidth: "100%"
  },
  media: {
    height: 0,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },

  listRoot: {
    width: "100%",

    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(0),
  },
  listItemStyle: {
    flexShrink: 2,
  },
}));

export default function CustomQuizCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const [radio_value, setRadio_Value] = React.useState();
  const [newAnswer, setNewAnswer] = React.useState();
  const [answers] = React.useState(props.answers);
  const [titleValue] = React.useState(props.title);
  const [deleteOpts, setDeleteOpts] = useState({
    open: false,
    title: "Are you sure you want to delete this answer?",
    text: "",
    toggleDeleteModal: () => {
      setDeleteOpts({ ...deleteOpts, ...{ open: !open } });
    },
    deleteURL: props.deleteURL,
    deleteCallback: props.deleteCallback,
  });

  const handleChange = (event) => {
    setRadio_Value(event.target.value);
    let answer_id = event.target.value;
    let question_id = props.id;
    props.setCorrectAnswer({ question_id, answer_id });
  };

  const handleNewAnswerChange = (value) => {
    setNewAnswer(value);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      {answers.length < 2 ? (

        <Grid item Container direction="row">
          <WarningRoundedIcon color="error" style={{ marginLeft: 10 }} />
        </Grid>

      ) : (
        <></>
      )}
      <DeleteDialog {...deleteOpts} />
      <CardHeader
        action={

          <IconButton
            onClick={() => {
              let id = props.id;
              props.deleteCardData(props.id);
            }}
            aria-label="settings"
          >
            <DeleteIcon />
          </IconButton>

        }
        subheader={
          <Typography>
            <Typography variant="body1" color="textPrimary" component="p">
              {answers.length == 1
                ? answers.length + " answer"
                : answers.length + " answers"}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {props.points} points
            </Typography>
          </Typography>
        }
        title={

          <Typography paragraph>{titleValue}</Typography>

        }
      />

      <Collapse in={expanded} timeout="auto">
        <List className={classes.listRoot}>
        {/* <RadioGroup name="answers"
            aria-labelledby="answers"
            defaultValue={radio_value}
           > */}
        {answers.map((value) => {
          return (
            <ListItem
              key={value.answer_id}
              role={undefined}
              dense
              button
              onClick={handleChange}
            >
              <ListItemIcon className={classes.listItemStyle}>
                <input type={"radio"} value={value.answer_id} checked={value.correct == 1 ? true : false} />
                <FormControl>
                  {value.answer}
                </FormControl>
                {/* //      <FormControlLabel
            //       checked={value.correct == 1 ? true : false}
            //       value={value.answer_id}
            //       control={<Radio />}
            //       label={value.answer}
            //     />*/}
              </ListItemIcon>
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    let delete_api = apis.DELETE_ANSWER(value.answer_id);
                    setDeleteOpts({
                      ...deleteOpts,
                      ...{
                        open: true,
                        deleteURL: delete_api,
                      },
                    });
                  }}
                  edge="end"
                  aria-label="comments"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}

        {/* </RadioGroup> */}
        </List>
        <Grid
          item
          xs={6}
          style={{ marginLeft: 20 }}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid
            item
            xs={6}
            style={{ marginLeft: 0, width: "100%", maxWidth: "100%" }}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <FormControl>
              <TextField
                multiline
                required
                id="standard-full-width"
                label="New Answer"
                fullWidth
                onBlur={(e) => handleNewAnswerChange(e.target.value)} />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            style={{ marginLeft: 0, width: "100%" }}
            container
            direction="row"
          >
            <IconButton
              onClick={() => {
                let question_id = props.id;
                let answer = newAnswer;
                props.addAnswer({ question_id, answer });
              }}
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Collapse>

      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    </Card >
  );
}
