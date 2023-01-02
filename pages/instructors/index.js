import React, { forwardRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Table from "../../components/Table";
import { withAuthSync } from "../../utils/auth";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import * as apis from "../../data/apiConfig";
import Router from "next/router";
import EditIcon from "@material-ui/icons/Edit";
import CustomDialog from "../../components/CustomDialog";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import AsyncData from "./../../data/AsyncData";
import { ValidateEmail } from "../../utils/validations";

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

  currency_root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
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
}));

const columns = [
  {
    field: "instructor_id",
    title: "ID",
    hidden: true,
  },
  {
    field: "first_name",
    title: "First Name",
  },
  {
    field: "last_name",
    title: "Last Name",
  },
  {
    field: "email",
    title: "Email",
  },
  {
    field: "username",
    title: "Username",
  },
  {
    field: "country",
    title: "Country",
    hidden: true,
  },
  {
    field: "city",
    title: "City",
    hidden: true,
  },
  {
    field: "specialty",
    title: "Specialty",
    hidden: true,
  },
  {
    field: "profession",
    title: "Profession",
    hidden: true,
  },
  {
    field: "organization",
    title: "Organization",
    hidden: true,
  },
  {
    field: "inserted_at",
    title: "Joined on",
  },
];

const extraOptions = {
  actionsColumnIndex: 10,
  search: true,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Instructors = () => {
  const [value, setValue] = useState(0);
  const [tableRef, setTableRef] = useState();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [TabValue, setTabValue] = React.useState(0);
  const [linkEmail, setLinkEmail] = React.useState("");
  const [form_data, setFormDat] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirm_password: "",
    country: "",
    city: "",
    specialty: "",
    profession: "",
    organization: "",
  });
  const classes = useStyles();
  const theme = useTheme();

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add",
    },
  ];
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrorMsg("");
  };

  const handleChange = (field, value) => {
    var new_obj = { ...form_data };
    new_obj[field] = value;
    setFormDat(new_obj);
  };

  const handleClickOpen = () => {
    setOpenAddModal(true);
    setErrorMsg("");
  };

  const handleClose = () => {
    setOpenAddModal(false);
    setLoadingSpinner(False);
    setErrorMsg("");
  };

  const handleDetailsCreationSubmit = async () => {
    setLoadingSpinner(true);
    setErrorMsg("");
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    let data = [];
    if (TabValue == 0) {
      if (
        form_data.first_name != ""
        // form_data.email != "" &&
        // form_data.first_name != "" &&
        // form_data.password != "" &&
        // form_data.confirm_password != "" &&
        // form_data.speciality
      ) {
        // if (ValidateEmail(form_data.email)) {
        // if (form_data.password == form_data.confirm_password) {
        var bodyFormData = new FormData();
        bodyFormData.append("email", form_data.email);
        bodyFormData.append("first_name", form_data.first_name);
        bodyFormData.append("last_name", "");
        // bodyFormData.append("username", form_data.email);
        bodyFormData.append("password", form_data.password);
        bodyFormData.append("confirm_password", form_data.confirm_password);
        // bodyFormData.append("country", form_data.country);
        // bodyFormData.append("city", form_data.city);
        // bodyFormData.append("speciality", form_data.speciality);
        // bodyFormData.append("profession", form_data.profession);
        // bodyFormData.append("organization", form_data.organization);

        try {
          const response = await AsyncData.createNewInstructor(
            user_id,
            bodyFormData,
            token
          );

          // close the modal
          handleClose();
          tableRef.refreshData();
        } catch (e) {
          console.log("error  in detail creation : ", e);
          if (e.response && e.response.data) {
            if (e.response.data.title) {
              setErrorMsg(e.response.data.title);
            } else {
              setErrorMsg("Somthing went wrong, please try again later!");
            }
          } else {
            setErrorMsg("Somthing went wrong, please try again later!");
          }
        }
        //   } else {
        //     setErrorMsg("Password and Confirm Password do not match");
        //   }
        // } else {
        //   setErrorMsg("Invalid email");
        // }
      } else {
        setErrorMsg("Please fill all the fields above");
      }
    } else {
      if (linkEmail != "") {
        if (ValidateEmail(linkEmail)) {
          var bodyFormData = new FormData();
          bodyFormData.append("email", linkEmail);

          // code here
          try {
            const response = await AsyncData.createLinkInstructor(
              user_id,
              bodyFormData,
              token
            );

            setErrorMsg("");
            // close the modal
            handleClose();
            tableRef.refreshData();
          } catch (e) {
            console.log("error  in detail creation : ", e);
            if (e.response.data) {
              if (e.response.data.title) {
                setErrorMsg(e.response.data.title);
              } else {
                setErrorMsg("Somthing went wrong, please try again later!");
              }
            } else {
              setErrorMsg("Somthing went wrong, please try again later!");
            }
          }
        } else {
          setErrorMsg("Invalid email");
        }
      } else {
        setErrorMsg("Please fill all the fields above");
      }
    }
    setLoadingSpinner(false);
  };

  return (
    <Layout currentPage="instructors" AppBarTitle={"Instructors"}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomDialog
              title={"Create A New Instructor"}
              loading={loadingSpinner}
              disagreeText={"Cancel"}
              agreeText={"Submit"}
              onConfirm={handleDetailsCreationSubmit}
              onDisagree={() => setOpenAddModal(false)}
              open={openAddModal}
              handleClose={handleClose}
              refreshCallback={() => {
                tableRef.refreshData();
              }}
            >
              <Tabs
                style={{ marginTop: 10 }}
                value={TabValue}
                onChange={handleTabChange}
                aria-label="Instructor add type"
                centered
              >
                <Tab label="New Instructor" {...a11yProps(0)} />
                <Tab label={"Already A User "} {...a11yProps(1)} />
              </Tabs>
              {errorMsg != "" ? (
                <Typography
                  color="error"
                  component="span"
                  style={{ marginTop: 20, marginLeft: 15 }}
                >
                  {errorMsg != "" ? errorMsg : ""}
                </Typography>
              ) : (
                <></>
              )}
              <TabPanel value={TabValue} index={0} xs={12}>
                <TextField
                  // required
                  autoFocus
                  label={"Email"}
                  type="email"
                  fullWidth
                  onBlur={(e) => handleChange("email", e.target.value)}
                />
                <TextField
                  required
                  autoFocus
                  label={"Expert faculty members"}
                  type="first_name"
                  fullWidth
                  onBlur={(e) => handleChange("first_name", e.target.value)}
                />
                <TextField
                  autoFocus
                  label={"Password"}
                  type="password"
                  fullWidth
                  onBlur={(e) => handleChange("password", e.target.value)}
                />
                <TextField
                  autoFocus
                  label={"Confirm Password"}
                  type="password"
                  fullWidth
                  onBlur={(e) =>
                    handleChange("confirm_password", e.target.value)
                  }
                />
                {/*<TextField
                  autoFocus
                  label={"Country"}
                  type="country"
                  fullWidth
                  onBlur={(e) => handleChange("country", e.target.value)}
                />
                <TextField
                  autoFocus
                  label={"City"}
                  type="city"
                  fullWidth
                  onBlur={(e) => handleChange("city", e.target.value)}
                />
                <TextField
                  required
                  autoFocus
                  label={"Speciality"}
                  type="speciality"
                  fullWidth
                  onBlur={(e) => handleChange("speciality", e.target.value)}
                />
                <TextField
                  autoFocus
                  label={"Profession"}
                  type="profession"
                  fullWidth
                  onBlur={(e) => handleChange("profession", e.target.value)}
                />
                <TextField
                  autoFocus
                  label={"Organization"}
                  type="organization"
                  fullWidth
                  onBlur={(e) => handleChange("organization", e.target.value)}
                /> */}
              </TabPanel>
              <TabPanel value={TabValue} index={1} xs={12}>
                <TextField
                  required
                  autoFocus
                  label={"Email"}
                  type="email"
                  fullWidth
                  onBlur={(e) => setLinkEmail(e.target.value)}
                />
              </TabPanel>
            </CustomDialog>
            <Table
              ref={(ref) => setTableRef(ref)}
              title="Instructors"
              rowKey={"instructor_id"}
              columns={columns}
              fetchURL={apis.FETCH_INSTRUCTORS}
              deleteURL={apis.DELETE_INSTRUCTORS}
              updateURL={""}
              extraOptions={extraOptions}
              disableClick={false}
              onRowClick={(event, rowData, togglePanel) =>
                Router.push("/instructors/" + rowData.instructor_id)
              }
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
export default withAuthSync(Instructors);
