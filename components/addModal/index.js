import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import AsyncData from "../../data/AsyncData";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Cookies from "js-cookie";
let id = Cookies.get("user_id");
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  }
}));

export default function InputAdornments(props) {
  const classes = useStyles();

  const [values, setValues] = useState({
    [props.label1]: "",
    [props.label2]: "",
    listItem_id: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(props.openSendModal);
  const [spinner, setSpinner] = useState(false);
  const [subscriber_id, setSubscriber_id] = useState();
  const [error, setError] = useState(false);

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  useEffect(() => {
    setOpen(props.openSendModal);
    setValues({ ...values, ...{ listItem_id: props.listItem_id } });
  }, [props.openSendModal]);

  const handleScheduelSwitchChange = event => {
    setIsScheduled(event.target.checked);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleListChange = event => {
    setSubscriber_id(event.target.id);
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  async function handleResetInfo() {
    const res = await new AsyncData().AddRecord(
      user_id,
      values.title,
      values.text,
      selectedDate,
      values.listItem_id
    );
    if (res.data == true) {
      props.handleClose();
      setError(false);
      props.refreshCallback({ values });
    } else {
      console.log("setting errr");
      setError(true);
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"body"}
    >
      {props.DialogTitle ? (
        <DialogTitle id="form-dialog-title">{props.DialogTitle}</DialogTitle>
      ) : (
        <DialogTitle id="form-dialog-title">Create A New Record</DialogTitle>
      )}

      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {props.DialogContentText ? (
              <DialogContentText>{props.DialogContentText}</DialogContentText>
            ) : (
              <></>
            )}

            {props.label1 ? (
              <TextField
                required
                autoFocus
                label={props.label1}
                type="title"
                fullWidth
                onBlur={e => handleChange(props.label1, e.target.value)}
              />
            ) : (
              <></>
            )}
            {props.label2 ? (
              <TextField
                style={{ marginTop: 10 }}
                required
                autoFocus
                label={props.label2}
                fullWidth
                onBlur={e => handleChange(props.label2, e.target.value)}
              />
            ) : (
              <></>
            )}
            {props.list ? (
              <TextField
                style={{ marginTop: 10 }}
                id="standard-select-category-native"
                select
                label={props.list_label ? props.list_label : "Value List"}
                value={props.value_id}
                onChange={handleListChange}
                SelectProps={{
                  native: true
                }}
                helperText={
                  props.list_desc ? props.list_desc : "Please select a value"
                }
              >
                {props.values_array.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.id}
                  </option>
                ))}
              </TextField>
            ) : (
              <></>
            )}
          </Grid>
          <Typography
            color="error"
            component="span"
            style={{ marginTop: 20, marginLeft: 15 }}
          >
            {errorMsg != "" ? errorMsg : ""}
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="disabled">
          Cancel
        </Button>
        {spinner ? (
          <CircularProgress color="primary" />
        ) : (
          <Button onClick={props.handleSubmitNewNotification} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
