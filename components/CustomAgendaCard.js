import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: "20px"
    // maxWidth: "100%"
  },
  media: {
    height: 0
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
  avatar: {
    backgroundColor: red[500]
  },
  HeaderTitle: {
    color: theme.palette.secondary.main
  }
}));

export default function CustomAgendaCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [edit, setEdit] = React.useState(false);

  const [descValue, setDescValue] = React.useState(props.desc);
  const [speakerValue, setSpeakerValue] = React.useState(props.speaker);
  const [timeValue, setTimeValue] = React.useState(props.time);
  const [orderValue, setOrderValue] = React.useState(props.order);
  const [titleValue, setTitleValue] = React.useState(props.title);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleEditExpandClick = () => {
    setExpanded(true);
  };
  const handleEditClick = () => {
    setEdit(!edit);
  };

  const handleTitleChange = value => {
    setTitleValue(value);
  };

  const handleDescChange = value => {
    setDescValue(value);
  };
  const handleSpeakerChange = value => {
    setSpeakerValue(value);
  };
  const handleTimeChange = value => {
    setTimeValue(value);
  };
  const handleOrderChange = value => {
    setOrderValue(value);
  };

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          action={
            <>
              <IconButton
                onClick={() => {
                  let id = props.id;
                  handleEditExpandClick();
                  handleEditClick();
                }}
                aria-label="settings"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  let id = props.id;
                  props.deleteCardData(id);
                }}
                aria-label="settings"
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
          title={
            edit ? (
              <form className={classes.form} noValidate>
                <TextField
                  defaultValue={titleValue}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  autoFocus
                  onBlur={e => handleTitleChange(e.target.value)}
                />
                {/* <TextField
                  defaultValue={speakerValue}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="speaker"
                  label="Speaker"
                  name="speaker"
                  autoFocus
                  onBlur={e => handleSpeakerChange(e.target.value)}
                /> */}
                <TextField
                  defaultValue={timeValue}
                  multiline
                  required
                  id="time"
                  label="Time"
                  fullWidth
                  onBlur={e => handleTimeChange(e.target.value)}
                />
              </form>
            ) : (
              <form className={classes.form} noValidate>
                <Typography paragraph>
                  <span className={classes.HeaderTitle}>Title: </span>
                  {titleValue}
                </Typography>
                <Typography paragraph>
                  <span className={classes.HeaderTitle}>Time:</span> {timeValue}
                </Typography>
              </form>
            )
          }
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {edit ? (
              <form className={classes.form} noValidate>
                <TextField
                  defaultValue={descValue}
                  multiline
                  required
                  id="description"
                  label="Description"
                  fullWidth
                  onBlur={e => handleDescChange(e.target.value)}
                />
                <TextField
                  defaultValue={orderValue}
                  multiline
                  required
                  id="order"
                  label="Order"
                  fullWidth
                  onBlur={e => handleOrderChange(e.target.value)}
                />
              </form>
            ) : (
              <form className={classes.form} noValidate>
                <Typography paragraph>
                  <span className={classes.HeaderTitle}>Description:</span>{" "}
                  {descValue}
                </Typography>
                <Typography paragraph>
                  <span className={classes.HeaderTitle}>Order:</span>{" "}
                  {orderValue}
                </Typography>
              </form>
            )}
          </CardContent>
        </Collapse>

        <CardActions disableSpacing>
          {edit ? (
            <>
              <Button
                onClick={() => {
                  handleEditClick();
                }}
                color="secondary"
              >
                cancel
              </Button>
              <Button
                onClick={() => {
                  let id = props.id;
                  props.editCardData({
                    id,
                    titleValue,
                    descValue,
                    timeValue,
                    orderValue
                  });
                  setExpanded(false);
                  setEdit(false);
                }}
                color="primary"
              >
                Save
              </Button>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </>
          )}
        </CardActions>
      </Card>
    </div>
  );
}
