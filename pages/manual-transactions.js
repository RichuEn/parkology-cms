import React, { forwardRef, useState } from "react";
import { withAuthSync } from "../utils/auth";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

import LinkIcon from "@material-ui/icons/Link";

import axios from "axios";
import copy from "copy-to-clipboard";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  root: {
    background: "green"
  }
}));

const tableIcons = {
  Clipboard: forwardRef((props, ref) => <LinkIcon {...props} ref={ref} />)
};

const ManualTransactions = () => {
  const classes = useStyles();
  const theme = useTheme();

  // initialize sate
  const [value, setValue] = useState(0);
  const [tableRef, setTableRef] = useState();
  const [open, setOpen] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [form_data, setFormDat] = useState({
    currency: "AED",
    sendEmail: true
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCurrency = () => {
    setOpenCurrency(false);
  };

  const handleOpenCurrency = () => {
    setOpenCurrency(true);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const handleChange = (field, value) => {
    var new_obj = { ...form_data };
    new_obj[field] = value;
    setFormDat(new_obj);
  };

  const handleSubmit = async () => {
    // code here
    try {
      const response = await axios.post(
        `${process.env.api}v1/manual-payment`,
        form_data
      );
      setFormDat({ currency: "AED" });
      // refreshing the data after successfull insert
      tableRef.refreshData();

      // close the modal
      handleClose();
    } catch {}
  };

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add"
    }
  ];

  const addModal = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"body"}
    >
      <DialogTitle id="form-dialog-title">Create Transaction</DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a custom Telr payment link for the user
              to pay online. Once succeeded, a reciept will be sent for both
              parties.
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Email Address"
              type="email"
              fullWidth
              onBlur={e => handleChange("email", e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form_data.sendEmail}
                  onChange={e => handleChange("send_email", e.target.checked)}
                  value="checkedB"
                  color="primary"
                />
              }
              label="Send link via email directly"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              id="first_name"
              label="First Name"
              type="text"
              fullWidth
              onBlur={e => handleChange("first_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="lastname"
              label="Last Name"
              type="text"
              fullWidth
              onBlur={e => handleChange("last_name", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              id="amount"
              label="Amount"
              type="number"
              fullWidth
              onBlur={e => handleChange("amount", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId={"currency-label"}
              Label={"Currency"}
              open={openCurrency}
              onClose={handleCloseCurrency}
              onOpen={handleOpenCurrency}
              value={form_data.currency}
              onBlur={e => handleChange("currency", e.target.value)}
              fullWidth
            >
              <MenuItem value={"AED"}>AED</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="standard-full-width"
              label="Description"
              helperText="Telr description"
              fullWidth
              onBlur={e => handleChange("description", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              required
              id="standard-full-width"
              label="Order Details"
              helperText="Order Details"
              fullWidth
              onBlur={e => handleChange("order_details", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Generate Link
        </Button>
      </DialogActions>
    </Dialog>
  );

  // table columns
  const columns = [
    {
      field: "id",
      title: "ID",
      hidden: true
    },
    {
      field: "uuid",
      title: "UUID",
      hidden: true
    },
    {
      field: "first_name",
      title: "First Name"
    },
    {
      field: "last_name",
      title: "Last Name"
    },
    {
      field: "email",
      title: "Email"
    },
    {
      field: "amount",
      title: "Amount"
    },
    {
      field: "currency",
      title: "Currency",
      hidden: true
    },
    {
      field: "description",
      title: "Description",
      hidden: true
    },
    {
      field: "status",
      title: "Status"
    }
  ];

  const copyToClipBoardBtn = {
    tooltip: "Copy link to clipboard",
    icon: tableIcons.Clipboard,
    onClick: async (evt, data) => {
      const url = `${process.env.api}v1/manual-payment/${data.uuid}/${
        data.id
      }/pay`;
      copy(url, {
        message: "Press #{key} to copy"
      });
    }
  };

  return (
    <Layout currentPage="orders" AppBarTitle={"Payments"}>
      {addModal}
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table
              ref={ref => setTableRef(ref)}
              columns={columns}
              title="Manual Transactions"
              fetchURL={`${process.env.api}v1/manual-payment`}
              deleteURL={`${process.env.api}v1/manual-payment`}
              updateURL={""}
              extraActions={copyToClipBoardBtn}
              disableClick={false}
            />
          </Grid>
        </Grid>
      </Container>

      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`
          }}
          unmountOnExit
        >
          <Fab
            className={fab.className}
            onClick={handleClickOpen}
            aria-label={fab.label}
            color={fab.color}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </Layout>
  );
};

export default withAuthSync(ManualTransactions);
