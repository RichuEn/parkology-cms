import React, { forwardRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Router from "next/router";
import FormControl from "@material-ui/core/FormControl";
import Cookies from "js-cookie";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "./../../components/Layout";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import NotifyIcon from "@material-ui/icons/Notifications";
import NotifyIconForTester from "@material-ui/icons/NotificationsActiveOutlined";

import Table from "./../../components/Table";
import { withAuthSync } from "./../../utils/auth";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Chip from "@material-ui/core/Chip";
import nextCookie from "next-cookies";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import * as apis from "../../data/apiConfig";
import AsyncData from "./../../data/AsyncData";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },

  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },

  selectedInstructorIndicator: {
    color: theme.palette.secondary.main,
  },
  textField: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const webinars = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  // initialize sate
  const [tableRef, setTableRef] = useState();

  const [value, setValue] = useState(0);
  const [framework, setFramework] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [targetNotification, setTargetNotification] = useState(null);

  const [form_data, setFormDat] = useState({
    title: "",
    description: "",
    iframe_text: "",
  });

  const [selectedInstructor_ids, setSelectedInstructor_ids] = React.useState(
    []
  );

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add",
    },
  ];
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationFormData, setNotificationFormData] = useState({
    id: "",
    type: "",
    message: "",
    slug: "",
  });
  const tableIcons = {
    notifyIcon: forwardRef((props, ref) => <NotifyIcon {...props} ref={ref} />),
    notifyIconForTester: forwardRef((props, ref) => <NotifyIconForTester {...props} ref={ref} color="secondary" />),
  };
  const handleClickOpen = () => {
    setOpen(true);
    setErrorMsg("");
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMsg("");
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleChange = (field, value) => {
    var new_obj = { ...form_data };
    new_obj[field] = value;
    setFormDat(new_obj);
  };

  const onFromDateChange = (value) => {
    setFromDate(value);
  };
  const onToDateChange = (value) => {
    setToDate(value);
  };

  const handleSelectChange = (event, newValue) => {
    event.preventDefault();
    setSelectedInstructor_ids(newValue);
  };

  const handleFrameworkSelectChange = (event, newValue) => {
    event.preventDefault();
    setFramework(newValue);
  };

  const handleSubmitNewLesson = async () => {
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    var bodyFormData = new FormData();
    if (
      form_data.title != "" &&
      form_data.description != "" &&
      form_data.iframe_text != "" &&
      selectedInstructor_ids.length > 0
    ) {
      setSpinner(true);

      bodyFormData.append("title", form_data.title);
      bodyFormData.append("framework", framework.value);
      bodyFormData.append("description", form_data.description);
      bodyFormData.append("url", form_data.iframe_text);
      if (fromDate) bodyFormData.append("date", fromDate);
      if (toDate) bodyFormData.append("date_to", toDate);

      let instructors_ids_arr = [];
      selectedInstructor_ids.map((instructor) => {
        instructors_ids_arr.push(instructor.instructor_id);
      });
      bodyFormData.append("instructors", instructors_ids_arr);

      try {
        const response = await AsyncData.createWebinarData(
          user_id,
          bodyFormData,
          token
        );

        setSpinner(false);
        setErrorMsg("");
        setSelectedInstructor_ids([]);

        handleClose();
        tableRef.refreshData();

        // close the modal
      } catch (e) {
        setErrorMsg(
          "Something went wrong/or some fields are still not set, try again later !"
        );
        setSpinner(false);
      }
    } else {
      setSpinner(false);
      setErrorMsg("Please fill all the above fields");
    }
  };



  const SendNotificationBtn = {
    tooltip: "Send Notification to All",
    icon: tableIcons.notifyIcon,

    onClick: async (evt, data) => {
      setOpenNotification(true);
      setNotificationFormData({
        id: data.id,
        slug: data.slug,
        type: 'Webinar',
        message: ""
      })
      setTargetNotification(0);

    }
  }
  const SendNotificationBtnForTester = {
    tooltip: "Send Notification to Tester",
    icon: tableIcons.notifyIconForTester,

    onClick: async (evt, data) => {
      setOpenNotification(true);
      setNotificationFormData({
        id: data.id,
        slug: data.slug,
        type: 'Webinar',
        message: "",
      })
      setTargetNotification(1);

    }
  }
  const handleNotificationClose = () => {
    setOpenNotification(false);
    setNotificationFormData({
      id: "",
      type: "",
      messaage: "",
      slug: "",
    });
    setTargetNotification(null)
  };
  const sendNotificationBtn = async () => {
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    var bodyFormData = new FormData();
    bodyFormData.append("message", notificationFormData.message);
    bodyFormData.append("slug", notificationFormData.slug);
    bodyFormData.append("target_id", notificationFormData.id);
    bodyFormData.append("type", notificationFormData.type);

    setSpinner(true);
    try {
      const response = await AsyncData.SendNotification(
        user_id,
        bodyFormData,
        token,
        targetNotification
      );
      setSpinner(false);

      tableRef.refreshData();
      // // close the modal
      handleNotificationClose();
    }
    catch (e) {
      setSpinner(false);
      setErrorMsg("Something went wrong, please try again later!");
      console.log("error in : ", e);
      console.error(e.response);     // NOTE - use "error.response.data` (not "error")
    }
  }
  const handleChangeNotification = (field, value) => {
    var new_obj = { ...notificationFormData };
    new_obj[field] = value;
    setNotificationFormData(new_obj);
  }

  const addModal = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"body"}
    >
      <DialogTitle id="form-dialog-title">Create Webinar</DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a custom Webinar
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Title"
              type="title"
              fullWidth
              onBlur={(e) => handleChange("title", e.target.value)}
            />

            <FormControl className={classes.formControl}>
              <Typography
                color="primary"
                component="span"
                style={{ paddingRight: 20 }}
              >
                Instructor:{" "}
                <span className={classes.selectedInstructorIndicator}>
                  Selected: {selectedInstructor_ids.length}
                </span>
              </Typography>
              <Autocomplete
                fullWidth
                id="demo-simple-select"
                multiple
                value={selectedInstructor_ids ?? []}
                options={props.instructor_list}
                getOptionLabel={(option) =>
                  option.name || option.first_name + (option.last_name ? " " + option.last_name : "")
                }
                getOptionSelected={(option, val) =>
                  option.instructor_id == val.instructor_id
                }
                autoComplete
                includeInputInList
                onChange={handleSelectChange}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Instructors Select"
                    margin="normal"
                  />
                )}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Typography
                color="primary"
                component="span"
                style={{ paddingRight: 20 }}
              >
                Framework:
              </Typography>
              <Autocomplete
                fullWidth
                id="framework-select"
                value={framework}
                options={[
                  { 'value': "click-meeting", 'title': "Click Meeting" },
                  { 'value': "zoom", 'title': "Zoom" },

                ]}
                getOptionLabel={(option) =>
                  option.title
                }
                getOptionSelected={(option, val) =>
                  option.value == val.value

                }
                autoComplete
                includeInputInList
                onChange={handleFrameworkSelectChange}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Framework Select"
                    margin="normal"
                  />
                )}
              />
            </FormControl>
            <TextField
              style={{ marginTop: 10 }}
              required
              label="Description"
              fullWidth
              onBlur={(e) => handleChange("description", e.target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              required
              label={framework.value == "zoom" ? "Zoom Link" : "Iframe Link"}
              type="iframe_text"
              fullWidth
              onBlur={(e) => handleChange("iframe_text", e.target.value)}
            />
            <TextField
              id="datetime-from"
              label="Date From"
              type="datetime-local"
              defaultValue={new Date()}
              className={classes.textField}
              onChange={(e) => {
                onFromDateChange(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-to"
              label="Date To"
              type="datetime-local"
              defaultValue={new Date()}
              className={classes.textField}
              onChange={(e) => {
                onToDateChange(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {spinner ? (
          <CircularProgress color="primary" />
        ) : (
          <Button onClick={handleSubmitNewLesson} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
  const addNotificationModel = (
    <Dialog
      open={openNotification}
      onClose={handleNotificationClose}
      aria-labelledby="form-dialog-title"
      scroll={"body"}
    >
      <DialogTitle id="form-dialog-title">
        Send Notification
      </DialogTitle>
      <DialogContent dividers={false} style={{ width: 500, minHeight: 200 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>

            <TextField
              name="message"
              multiline
              margin="normal"
              required
              title="Notification Message"
              label="Notification Message"
              fullWidth
              maxRows={12}
              value={notificationFormData.message}
              onChange={(e) => handleChangeNotification('message', e.target.value)}
            />
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNotificationClose} color="primary">
          Cancel
        </Button>
        {spinner ? (
          <CircularProgress color="primary" />
        ) : (
          <Button onClick={sendNotificationBtn} color="primary">
            Send
          </Button>
        )}
      </DialogActions>
    </Dialog >
  )

  const columns = [
    {
      field: "id",
      title: "Webinar ID",
    },
    {
      field: "title",
      title: "Title",
    },
    {
      field: "url",
      title: "Iframe url",
    },
    {
      field: "date",
      title: "Date From",
    },
    {
      field: "date_to",
      title: "Date To",
    },
    {
      field: "instructors",
      title: "Instructors",
      render: (rowData) => (
        <div className="name_column d-flex justify-content-center align-items-center">
          {rowData.instructors.map(function (item, idx) {
            return (
              <Chip
                key={item.id + "__" + idx}
                label={item.name}
                className={classes.chip}
              />
            );
          })}

          <style global jsx>
            {`
              .name_column {
                display: flex;
                justify-content: start;
                align-items: center;
                // border: 1px solid black;
                // text-decoration: none;
                // color: #00adee;
              }
            `}
          </style>
        </div>
      ),
    },
    {
      field: "description",
      title: "Description",
    },
  ];

  const extraOptions = {
    actionsColumnIndex: 10,
    search: true,
  };

  const onRowClick = (event, rowData) => {
    Router.push(`/webinars/${rowData.id}`);
  };

  const user_id = Cookies.get("user_id"); // => get user_id
  const token = Cookies.get("token"); // => get token

  return (
    <Layout currentPage="webinars" AppBarTitle={"Webinars"}>
      {addModal}
      {addNotificationModel}

      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table
              ref={(ref) => setTableRef(ref)}
              title="Webinars"
              columns={columns}
              fetchURL={AsyncData.getWebinarsData(user_id)}
              deleteURL={apis.DELETE_WEBINAR}
              updateURL={""}
              extraOptions={extraOptions}
              onRowClick={onRowClick}
              SendNotificationBtn={SendNotificationBtn}
              SendNotificationBtnForTester={SendNotificationBtnForTester}
              rowKey="id"
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
            transitionDelay: `${value === index ? transitionDuration.exit : 0
              }ms`,
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

webinars.getInitialProps = async (ctx) => {
  var props = {};
  const { user_id, token } = nextCookie(ctx);

  const lesson_key = ctx.query.id;
  try {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const response = await axios.get(
      `${AsyncData.getCategoriesData()}` + `?page=1&limit=100`,
      config
    );

    const response_instructor_list = await AsyncData.getInstructorList(
      user_id,
      token
    );

    let data = response.data;
    let instructor_list = response_instructor_list.data;
    props.categories = data.data;
    props.instructor_list = instructor_list;
    props.user_id = user_id;
    props.token = token;
  } catch (error) {
    console.log("error in getInitialProps in getCategoriesData is : ", error);
  }
  return props;
};

export default withAuthSync(webinars);
