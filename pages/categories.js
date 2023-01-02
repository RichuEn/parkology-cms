import React, { forwardRef, useState, useEffect, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Router from "next/router";
import clsx from "clsx";
import Cookies from "js-cookie";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Layout from "./../components/Layout";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import Table from "./../components/Table";
import { withAuthSync } from "./../utils/auth";
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
import * as apis from "../data/apiConfig";
import SendIcon from "@material-ui/icons/Send";
import LinkIcon from "@material-ui/icons/Link";
import axios from "axios";
import AsyncData from "./../data/AsyncData";
import EditIcon from "@material-ui/icons/Edit";
import EditInfo from "../components/editInfoModal";
import CircularProgress from "@material-ui/core/CircularProgress";

const tableIcons = {
  resetIcon: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />)
};

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
  },
  input: {
    display: "none"
  }
}));

const Categories = () => {
  const [isAddCategory, setIsAddCategory] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [selectedKey, setSelectedKey] = useState(true);
  const [extraModalData, setExtraModalData] = useState({
    image_url_active: "",
    image_url_colored: "",
    image_url_inactive: ""
  });
  const classes = useStyles();
  const theme = useTheme();
  const EditCategoryBtn = {
    tooltip: "Edit Category",
    icon: tableIcons.resetIcon,
    onClick: async (evt, data) => {
      setFormData({
        title: data.name
      });
      setExtraModalData({
        image_url_active: data.image_url_active,
        image_url_colored: data.image_url_colored,
        image_url_inactive: data.image_url_inactive
      });
      setIsAddCategory(false);
      setOpen(true);
      setSelectedKey(data.key);
    }
  };
  // initialize sate
  const [tableRef, setTableRef] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [white_image, setWhite_image] = useState();
  const [gray_image, setGray_image] = useState();
  const [value, setValue] = useState(0);

  const [open, setOpen] = useState(false);
  const [form_data, setFormData] = useState({
    title: "",
    white_image: "",
    gray_image: "",
    colored_image: ""
  });

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add"
    }
  ];

  const handleClickOpen = () => {
    setIsAddCategory(true);
    setFormData({
      title: "",
      white_image: "",
      gray_image: "",
      colored_image: ""
    });
    setOpen(true);
    setErrorMsg("");
  };

  const handleClose = () => {
    setFormData({
      title: "",
      white_image: "",
      gray_image: "",
      colored_image: ""
    });
    setWhite_image("");
    setGray_image("");
    setOpen(false);
    setErrorMsg("");
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const handleChange = (field, value) => {
    var new_obj = { ...form_data };
    new_obj[field] = value;
    setFormData(new_obj);
  };

  const handleFile1Change = event => {
    if (event.target.files && event.target.files[0]) {
      let formData = new FormData();

      formData.append("photo1", event.target.files[0]);
      let file_sub_zero = event.target.files[0];

      try {
        setWhite_image(file_sub_zero);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleFile2Change = event => {
    if (event.target.files && event.target.files[0]) {
      let formData = new FormData();

      formData.append("photo2", event.target.files[0]);
      let file_sub_zero = event.target.files[0];

      try {
        setGray_image(file_sub_zero);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    if (form_data.title != "") {
      var bodyFormData = new FormData();

      bodyFormData.append("name", form_data.title);
      bodyFormData.append("image_active", white_image);
      bodyFormData.append("image_inactive", gray_image);

      setSpinner(true);
      try {
        let response = null;
        if (isAddCategory)
          response = await AsyncData.createCategoriesData(
            user_id,
            bodyFormData,
            token
          );
        else
          response = await new AsyncData().editCategoriesData(
            selectedKey,
            bodyFormData
          );
        // setFormData({ currency: "AED" });
        // refreshing the data after successfull insert
        setWhite_image("");
        setGray_image("");
        setSpinner(false);

        tableRef.refreshData();
        setErrorMsg("");
        // close the modal
        handleClose();
      } catch (e) {
        setSpinner(false);
        setErrorMsg("Something went wrong, please try again later!");
        console.log("error in : ", e);
      }
    } else {
      setErrorMsg("Please fill all the required fields");
    }
  };

  const addModal = () => (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"body"}
    >
      <DialogTitle id="form-dialog-title">
        {isAddCategory ? "Create Category" : "Edit Category"}
      </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              {isAddCategory
                ? "The following will create a custom Category"
                : "The following will edit a category"}
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Title"
              type="title"
              fullWidth
              value={form_data.title}
              onChange={e => handleChange("title", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <form style={{ marginTop: 10 }} className={classes.form} noValidate>
              <input
                onChange={handleFile1Change}
                accept="image/*"
                className={classes.input}
                id="contained-button1-file"
                type="file"
              />

              <label htmlFor="contained-button1-file">
                <Button variant="contained" color="primary" component="span">
                  Active Image
                </Button>
              </label>
              {isAddCategory || (!isAddCategory && white_image) ? (
                <Typography
                  color="secondary"
                  component="div"
                  style={{ paddingRight: 20 }}
                >
                  {white_image ? white_image.name : "none selected"}
                </Typography>
              ) : (
                <div
                  style={{
                    background: "black",
                    textAlign: "center",
                    padding: "20px",
                    marginTop: "20px"
                  }}
                >
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={extraModalData.image_url_active}
                  />
                </div>
              )}
            </form>
          </Grid>

          <Grid item xs={12} md={4}>
            <form style={{ marginTop: 10 }} className={classes.form} noValidate>
              <input
                onChange={handleFile2Change}
                accept="image/*"
                className={classes.input}
                id="contained-button2-file"
                type="file"
              />
              <label htmlFor="contained-button2-file">
                <Button variant="contained" color="primary" component="span">
                  InActive Image
                </Button>
              </label>
              {isAddCategory || (!isAddCategory && gray_image) ? (
                <Typography
                  color="secondary"
                  component="div"
                  style={{ paddingRight: 20 }}
                >
                  {gray_image ? gray_image.name : "none selected"}
                </Typography>
              ) : (
                <div
                  style={{
                    background: "black",
                    textAlign: "center",
                    padding: "20px",
                    marginTop: "20px"
                  }}
                >
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={extraModalData.image_url_inactive}
                  />
                </div>
              )}
            </form>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <form style={{ marginTop: 10 }} className={classes.form} noValidate>
              <input
                onChange={handleFile3Change}
                accept="image/*"
                className={classes.input}
                id="contained-button3-file"
                type="file"
              />
              <label htmlFor="contained-button3-file">
                <Button variant="contained" color="primary" component="span">
                  Colored Image
                </Button>
              </label>
              {isAddCategory || (!isAddCategory && colored_image) ? (
                <Typography
                  color="secondary"
                  component="div"
                  style={{ paddingRight: 20 }}
                >
                  {colored_image ? colored_image.name : "none selected"}
                </Typography>
              ) : (
                <div
                  style={{
                    background: "black",
                    textAlign: "center",
                    padding: "20px",
                    marginTop: "20px"
                  }}
                >
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={extraModalData.image_url_colored}
                  />
                </div>
              )}
            </form>
          </Grid> */}
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
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const columns = [
    {
      field: "id",
      title: "Category ID"
    },
    {
      field: "name",
      title: "Name"
    },
    {
      field: "key",
      title: "Key"
    },
    {
      field: "image_url_active",
      title: "Active Image"
    },
    {
      field: "image_url_inactive",
      title: "Inactive Image"
    }
  ];

  const extraOptions = {
    actionsColumnIndex: 10,
    search: true
  };

  const onRowClick = (event, rowData) => {
    // Router.push(`/categories/${rowData.id}`);
  };

  return (
    <Layout currentPage="categories" AppBarTitle={"Categories"}>
      {addModal()}
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table
              ref={ref => setTableRef(ref)}
              title="Categories"
              rowKey="key"
              columns={columns}
              fetchURL={apis.FETCH_CATEGORIES}
              deleteURL={apis.DELETE_CATEGORY}
              updateURL={""}
              extraOptions={extraOptions}
              extraActions={EditCategoryBtn}
              onRowClick={onRowClick}
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

export default withAuthSync(Categories);
