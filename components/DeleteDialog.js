import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
export default function DeleteDialog(props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  async function callRemoteDelete() {
    // gether the Ids and delete them
    const token = Cookies.get("token"); // => get token

    try {
      const response = await axios.delete(`${props.deleteURL}`, {
        headers: { Authorization: "token " + token }
      });
      props.deleteCallback(props.id);
      props.toggleDeleteModal();
      setSnackbarOpen(false);
      setIsDeleting(false);
    } catch (error) {
      console.log("error", error.response);
      setSnackbarOpen(true);
      setIsDeleting(false);
    }
  }
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        // onClose={this.hideDeleteAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isDeleting}
            onClick={props.toggleDeleteModal}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting}
            onClick={() => {
              setIsDeleting(true);
              callRemoteDelete();
            }}
            color="primary"
            autoFocus
          >
            {isDeleting ? <CircularProgress size={20} /> : `Delete`}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen(false);
          }}
          severity="error"
        >
          An error occured!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
