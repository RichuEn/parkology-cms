import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CustomDialog(props) {
  const handleConfirm = () => {
    if (props.onConfirm) props.onConfirm();
  };

  const handleDisagree = () => {
    if (props.onDisagree) props.onDisagree();
  };

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const renderAgreeButton = () => {
    if (props.loading) return <CircularProgress size={20} />;
    if (props.agreeText) return props.agreeText;
    return "Agree";
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="disabled">
          {props.disagreeText ? props.disagreeText : "Disagree"}
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          {renderAgreeButton()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
