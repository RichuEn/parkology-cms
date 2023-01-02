import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import AsyncData from "../data/AsyncData";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import UploadS3 from "./UploadS3MultiPart";
import { IsNumber } from "../utils/validations";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  input: {
    display: "none",
  },
}));

export default function AddVideoDiaBites(props) {
  const [data, setData] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [video, setVideo] = useState(null);
  const handleChange = (prop, value) => {
    setVideo(value)
    // if (prop === "video") {
    //   setData({ ...data, ...{ [prop]: value } });
    // } else {
    //   if (value) {
    //     if (IsNumber(value)) {
    //       setData({ ...data, ...{ [prop]: value } });
    //     }
    //   } else {
    //     setData({ ...data, ...{ [prop]: "" } });
    //   }
    // }
  };
  const classes = useStyles();
  const theme = useTheme();
  const submit = async () => {
    setSpinner(true);
    var bodyFormData = new FormData();
    bodyFormData.append('video', video);
    try {
      const response = await new AsyncData.EditDiaBitesVideo(
        props.admin_id,
        props.diabite_id,
        bodyFormData,
        props.token
      );
      handleClose();
      props.addCallback(response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setSpinner(false);
    }
  };

  const handleClose = () => {
    setData({});
    setVideo(null);
    props.handleClose();
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"body"}
    >
      <DialogTitle id="form-dialog-title">Add Video</DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <FormControl>
              <UploadS3
                accept="video/*"
                admin_id={props.admin_id}
                token={props.token}
                finishedProgress={(e) => {
                  handleChange("video", e.key);
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        {spinner ? (
          <CircularProgress color="primary" />
        ) : (video) ? (
          <Button color="primary" onClick={submit}>
            Submit
          </Button>
        ) : (
          <Button color="primary" disabled onClick={submit}>
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
