import React, { useState, useEffect } from "react";
import clsx from "clsx";
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
    password: "",
    showPassword: false,
    email: props.email
  });
  const [open, setOpen] = useState(props.openResetModal);
  const [error, setError] = useState(false);
  useEffect(() => {
    setOpen(props.openResetModal);
    setValues({ ...values, ...{ email: props.email } });
  }, [props.openResetModal]);

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  async function handleResetInfo() {
    if (props.instructor_edit) {
      const res = await new AsyncData().resetInfo_instructor(
        values.email,
        values.password,
        props.selectedId
      );
      if (res.data == true) {
        props.handleClose();
        setError(false);
        props.refreshCallback(values);
      } else {
        console.log("setting errr");
        setError(true);
      }
    } else {
      const res = await new AsyncData().resetInfo(
        values.email,
        values.password,
        props.selectedId
      );
      if (res.data == true) {
        props.handleClose();
        setError(false);
        props.refreshCallback(values);
      } else {
        console.log("setting errr");
        setError(true);
      }
    }
  }

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" scroll={"body"}>
      <DialogTitle id="form-dialog-title">Edit Info</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.root}>
          <div>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              fullWidth={true}
            >
              <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
              <Input
                id="standard-adornment-email"
                type={"email"}
                value={values.email}
                onChange={handleChange("email")}
              />
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              fullWidth={true}
            >
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="my-helper-text" error={true}>
                {error ? "An error occured" : ""}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleResetInfo} color="primary" variant="contained">
          Edit Info
        </Button>
      </DialogActions>
    </Dialog>
  );
}
