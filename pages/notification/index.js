import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "./../../components/Layout";
import { withAuthSync } from "./../../utils/auth";
import { Button, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AsyncData from "./../../data/AsyncData";
import CircularProgress from "@material-ui/core/CircularProgress";

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

const Notificaiton = () => {
  const [spinner, setSpinner] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const classes = useStyles();
  const [form_data, setFormData] = useState({
    title: "",
    description: ""
  });



  const handleChange = (field, value) => {
    var new_obj = { ...form_data };
    new_obj[field] = value;
    setFormData(new_obj);
  };



  const handleSubmit = async () => {
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    if (form_data.description != "") {
      var bodyFormData = new FormData();

      bodyFormData.append("title", form_data.title);
      bodyFormData.append("description", form_data.description);

      setSpinner(true);
      try {
        let response = await AsyncData.pushNotification(
          user_id,
          bodyFormData,
          token
        );
        console.log()
        setSpinner(false);
        setErrorMsg("");
      } catch (e) {
        setSpinner(false);
        setErrorMsg("Something went wrong, please try again later!");
        console.log("error in : ", e);
      }
    } else {
      setErrorMsg("Please fill all the required fields");
    }
  };

  return (
    <Layout currentPage="notification" AppBarTitle={"Notification"}>
      <Container maxWidth="lg" className={classes.container}>
        <Card className={classes.card}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Typography
                color="error"
                component="span"
                style={{ marginTop: 20, marginLeft: 15 }}
              >
                {errorMsg != "" ? errorMsg : ""}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    label="Title of notification"
                    type="title"
                    fullWidth
                    value={form_data.title}
                    onChange={e => handleChange("title", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoFocus
                    multiline={true}
                    minRows={4}
                    label="Body of notification"
                    type="description"
                    fullWidth
                    value={form_data.description}
                    onChange={e => handleChange("description", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  {spinner ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Button onClick={handleSubmit} color="primary">
                      Send Now
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Container>



    </Layout>
  );
};

export default withAuthSync(Notificaiton);
