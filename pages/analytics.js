import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AsyncData from "./../data/AsyncData";
import RevenueCard from "../components/dashboard/RevenueCard";
import CategoriesCard from "../components/CategoriesCard";
import AnalyticsLessonCard from "../components/AnalyticsLessonCard";
import ResponsiveBar from "../components/ResponsiveBar";
import ResponsiveBarMonths from "../components/ResponsiveBarMonths";
import ResponsivePie from "../components/ResponsivePie";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

function Copyright() {
  return (
    <>
    {"Copyright © "}
   
    {new Date().getFullYear()}
    {"."}
    <div>{process.env.version}</div>
  </>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  padding: {
    padding: theme.spacing(3)
  },
  containerRow: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  graphsContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 400
  },
  paperLarge: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 2000,
    width: 1400
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 3)
  },
  insetShadow: {
    backgroundColor: "#fff"
    // backgroundColor: "#fbfdff"
    // boxShadow: "inset 0px 0px 20px -7px rgba(0,0,0,0.15)"
  },
  graphpermonth: {
    height: 500
  },

  revenueBoxAmmount: {
    height: 400,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center"
  },
  card: {
    width: "100%"
  }
}));

const Analytics = props => {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [isDone, setDone] = useState(false);
  const [hasError, setError] = useState(false);
  const [webinars, setWebinars] = useState(
    props.webinars ? props.webinars : []
  );
  const [webinarId, setWebinarId] = useState("");
  const [webinarName, setWebinarName] = useState("");

  const [hcp_registered, setHcp_registered] = useState(
    props.hcp_registered ? props.hcp_registered : ""
  );
  const [hcp_per_country, setHcp_per_country] = useState(
    props.hcp_per_country ? props.hcp_per_country : []
  );
  const [hcp_per_speciality, setHcp_per_speciality] = useState(
    props.hcp_per_speciality ? props.hcp_per_speciality : []
  );
  const [module_visitors, setModule_visitors] = useState(
    props.module_visitors ? props.module_visitors : []
  );

  const [webinar_registered, setWebinar_registered] = useState(
    props.webinar_registered ? props.webinar_registered : {}
  );

  const [webinar_ctry, setWebinar_ctry] = useState(
    props.webinar_ctry ? props.webinar_ctry : []
  );

  const [webinar_spec, setWebinar_spec] = useState(
    props.webinar_spec ? props.webinar_spec : []
  );
  const [webinar_live, setWebinar_live] = useState(
    props.webinar_live ? props.webinar_live : {}
  );

  const [data_dummy, setData_dummy] = useState(
    props.data_dummy ? props.data_dummy : []
  );
  const [categories_name, setCategories_name] = useState(
    props.categories_name ? props.categories_name : []
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [renderedLessons, setRenderedLessons] = useState([]);

  const getWebinarData = async webinarId => {
    try {
      const response_webinarRegistered = await AsyncData.getWebinarRegisteredAnalyticsData(
        webinarId
      );
      const res_web_ctry = await AsyncData.getWebinarCountryAnalyticsData(
        webinarId
      );
      const res_web_spec = await AsyncData.getWebinarSpecialityAnalyticsData(
        webinarId
      );
      const res_web_live = await AsyncData.getWebinarLiveAnalyticsData(
        webinarId
      );

      // generate random colors
      let final_spec = [];
      const colors = [
        "#c5daef",
        "#6aacd7",
        "#4190c8",
        "#9ec9e2",
        "#004493",
        "#002761",
        "#deebf7"
      ];
      for (var i in res_web_spec.data) {
        const row = res_web_spec.data[i];
        final_spec.push({
          ...row,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      let final_ctry = [];
      for (var _i in res_web_ctry.data) {
        const row = res_web_ctry.data[_i];
        final_ctry.push({
          ...row,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      setWebinar_registered(response_webinarRegistered.data);
      setWebinar_ctry(final_ctry);
      setWebinar_spec(final_spec);
      setWebinar_live(res_web_live.data);
    } catch (e) {
      console.log("Error in getting webinar graph data", e);
    }
  };

  const Seperator = () => (
    <Grid container justify="center" spacing={1} className={classes.padding}>
      {[1, 2, 3, 4].map(obj => (
        <Grid item>
          <hr />
        </Grid>
      ))}
    </Grid>
  );

  const handleChange = e => {
    setWebinarId(e.target.value);
    setWebinarName(e.target.value);
    getWebinarData(e.target.value);
  };
  return (
    <div>
      <CssBaseline />
      <div className={classes.container}>
        <Grid container justify="center" className={classes.padding}>
          <img
            width={150}
            height={60}
            src="https://s3.eu-west-1.amazonaws.com/static.thediabeats.com/logo.png"
          />
        </Grid>

        <Grid container item>
          <Container justify="center" className={classes.padding} maxWidth="md">
            <Grid item xs>
              <RevenueCard
                actions={`${process.env.api}analytics/download_general_report`}
                title={"Total registered users"}
                amount={hcp_registered}
                smallDescription={"Download Report"}
              />
            </Grid>
          </Container>
        </Grid>

        <Grid container>
          <Container component="main" maxWidth="md">
            <Grid item xs>
              <Seperator />
            </Grid>
          </Container>
        </Grid>

        <Grid container>
          <Container component="main" maxWidth="md">
            <Grid container md={12} justify="center">
              <Typography color="primary" spacing={4}>
                Registered healthcare Users per Countries and per Specialities
              </Typography>
            </Grid>
            <Grid container justify="center" spacing={1}>
              <Grid item xs={12} md={5}>
                <div style={{ height: 400 }}>
                  <ResponsivePie data={hcp_per_country} />
                </div>
              </Grid>
              <Grid item xs={12} md={7}>
                <div style={{ height: 400 }}>
                  <ResponsivePie data={hcp_per_speciality} />
                </div>
              </Grid>
            </Grid>
          </Container>
        </Grid>

        <Grid container>
          <Container component="main" maxWidth="md">
            <Grid item xs={12} className={classes.graphpermonth}>
              <ResponsiveBarMonths data={props.monthly_users} />
            </Grid>
          </Container>
        </Grid>

        <Grid container>
          <Container component="main" maxWidth="md">
            <Grid item xs>
              <Seperator />
            </Grid>
          </Container>
        </Grid>

        <Grid container className={classes.insetShadow}>
          <Container component="main" maxWidth="md" className={classes.padding}>
            <Grid container item justify="center">
              <Typography color="primary" style={{ paddingBottom: 25 }}>
                Please choose a Lesson Category
              </Typography>
            </Grid>

            <Grid maxWidth="xl">
              <Grid container justify="center" spacing={1}>
                {categories_name.map(item => (
                  <Grid item>
                    <CategoriesCard
                      selected={selectedCategory == item ? true : false}
                      onClick={e => {
                        let lessons_array = [];
                        for (var k in data_dummy) {
                          let dummy_row = data_dummy[k];
                          if (dummy_row.category_name == item) {
                            lessons_array.push(dummy_row);
                          }
                        }
                        setSelectedCategory(item);
                        setRenderedLessons(lessons_array);
                      }}
                      title={item}
                      amount={""}
                      smallDescription={""}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid container className={classes.insetShadow}>
          <Container component="main" maxWidth="md" className={classes.padding}>
            <Grid container justify="center" spacing={2}>
              {renderedLessons.map(item => (
                <Grid item md={6}>
                  <AnalyticsLessonCard data={[item]} title={item.lesson_name} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Grid>

        <Grid container className={classes.padding}>
          <Container component="main" maxWidth="md">
            <Grid container item justify="center">
              <Typography color="primary">Webinar Analytics</Typography>
            </Grid>

            <Grid container item justify="center">
              <select
                className="w-100 custom-input p-3 mb-3"
                placeholder="Webinar"
                name={"webinar"}
                value={webinarName}
                onChange={e => {
                  handleChange(e);
                }}
              >
                {webinars.map(item => (
                  <option value={item.id}>{item.title}</option>
                ))}
              </select>
            </Grid>
          </Container>
        </Grid>

        {webinarId != "" ? (
          <>
            <Container maxWidth="md" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RevenueCard
                    title={"Total registered healthcare users"}
                    amount={webinar_registered.users_registered}
                  />
                </Grid>
                {/*<Grid item xs={12} md={6}>
                  <RevenueCard
                    title={"Healthcare users attendees"}
                    amount={webinar_live.no_of_users}
                  />
                </Grid> */}
              </Grid>
            </Container>

            <Container
              component="main"
              maxWidth="md"
              className={classes.padding}
            >
              <Grid container justify="center" spacing={2}>
                <Grid item xs={12} md={6} className={classes.paper}>
                  <Card
                    variant="outlined"
                    elevation={1}
                    className={classes.card}
                  >
                    <CardContent className={classes.revenueBoxAmmount}>
                      <ResponsiveBar
                        data={webinar_ctry}
                        keys={["no_of_users"]}
                        indexBy="country"
                        layout="horizontal"
                        margin={{ top: 50, right: 130, bottom: 50, left: 150 }}
                        colors={({ id, data }) => data["color"]}
                        axisBottom={{
                          tickSize: 0,
                          tickPadding: 0,
                          tickRotation: 90,
                          legend: "Number of users",
                          legendPosition: "middle",
                          legendOffset: 35
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: "Country",
                          legendPosition: "middle",
                          legendOffset: -100
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} className={classes.paper}>
                  <Card
                    variant="outlined"
                    elevation={1}
                    className={classes.card}
                  >
                    <CardContent className={classes.revenueBoxAmmount}>
                      <ResponsiveBar
                        data={webinar_spec}
                        keys={["no_of_users"]}
                        indexBy="speciality"
                        layout="vertical"
                        margin={{ top: 50, right: 20, bottom: 130, left: 90 }}
                        colors={({ id, data }) => data["color"]}
                        axisBottom={{
                          tickSize: 0,
                          tickPadding: 0,
                          tickRotation: 90,
                          legend: "Registered users per speciality",
                          legendPosition: "middle",
                          legendOffset: 115
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: "Speciality",
                          legendPosition: "middle",
                          legendOffset: -50
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </>
        ) : null}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
};

Analytics.getInitialProps = async ctx => {
  var props = {};

  try {
    const response_webinars = await AsyncData.getAllWebinarsData();
    const response_hcp = await AsyncData.getHCPAnalyticsData();
    const response_moduleVisitors = await AsyncData.getModuleVisitorsAnalyticsData();
    const response_monthly_users = await AsyncData.getMonthlyUserAnalyticsData();
    // const response_moduleCompleted = await AsyncData.getModuleCompletedAnalyticsData();

    let data_hcp = response_hcp.data;

    let webinars = [
      {
        id: "",
        title: "Choose Webinar"
      }
    ];
    for (var i in response_webinars.data) {
      webinars.push(response_webinars.data[i]);
    }

    // hydrate the data
    let countries = [];
    let uae = 0;
    let other = 0;
    for (var _index in data_hcp.hcp_per_country) {
      const row = data_hcp.hcp_per_country[_index];
      if (row.country == "United Arab Emirates") uae += parseInt(row.count);
      else other += parseInt(row.count);
    }

    countries.push({
      id: "UAE",
      label: "United Arab Emirates",
      value: uae,
      color: "hsl(202, 70%, 50%)"
    });
    countries.push({
      id: "Others",
      label: "Other Counries",
      value: other,
      color: "hsl(202, 70%, 50%)"
    });

    // hydrate the specialies
    let speciality = [];
    for (var _index in data_hcp.hcp_per_speciality) {
      const row = data_hcp.hcp_per_speciality[_index];
      speciality.push({
        id: row.speciality,
        label: row.speciality,
        value: row.count,
        color: "hsl(202, 70%, 50%)"
      });
    }

    props.webinars = webinars;
    props.hcp_analytics = data_hcp;
    props.hcp_registered = data_hcp.hcp_registered;
    props.hcp_per_country = countries;
    props.hcp_per_speciality = speciality;
    props.module_visitors = response_moduleVisitors.data;
    props.monthly_users = response_monthly_users.data;

    let categories_name = [];

    for (var j in response_moduleVisitors.data) {
      let dummy_row = response_moduleVisitors.data[j];
      let check = categories_name.includes(dummy_row.category_name);
      if (check == false) {
        categories_name.push(dummy_row.category_name);
      }
    }
    //Dummy data for the lessons by category_name
    props.data_dummy = response_moduleVisitors.data;
    props.categories_name = categories_name;
  } catch (error) {
    console.log(
      "error in getInitialProps in getProfileCertificatesData is : ",
      error
    );
  }
  return props;
};

export default Analytics;
