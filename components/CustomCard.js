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
import Editor from "./Editor";
import { FormControl } from "@material-ui/core";

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
}));

export default function CustomCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [edit, setEdit] = React.useState(false);

  const [descValue, setDescValue] = React.useState(props.desc);
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

  const handleTitleChange = (value) => {
    setTitleValue(value);
  };

  const handleDescChange = (value) => {
    setDescValue(value);
  };

  const cancelButton = (e) => {
    e.preventDefault();
    setTitleValue(props.title);
    setDescValue(props.desc);
    handleEditClick();
  };

  return (

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
              <FormControl className={classes.form} noValidate>
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
                  onBlur={(e) => handleTitleChange(e.target.value)}
                />
              </FormControl>
            ) : (
              <Typography paragraph>{titleValue}</Typography>
            )
          }
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {edit ? (
              <FormControl className={classes.form} noValidate>
                <Editor
                  value={descValue ? descValue : ""}
                  id="2"
                  name="descValue"
                  required={true}
                  title="Description"
                  handleChange={(name, val) => handleDescChange(val)}
                />
              </FormControl>
            ) : (
              <Typography paragraph>
                <Typography dangerouslySetInnerHTML={{ __html: descValue }}></Typography>
              </Typography>
            )}
          </CardContent>
        </Collapse>

        <CardActions disableSpacing>
          {edit ? (
            <>
              <Button onClick={cancelButton} color="secondary">
                cancel
              </Button>
              <Button
                onClick={() => {
                  let id = props.id;
                  props.editCardData({ id, titleValue, descValue });
                  setExpanded(false);
                  setEdit(false);
                }}
                color="primary"
              >
                Save
              </Button>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </CardActions>
      </Card>
  );
}
