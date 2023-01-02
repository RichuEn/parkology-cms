import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import nextCookie from "next-cookies";
import { withAuthSync } from "../utils/auth";

import Layout from "../components/Layout";
import RevenueCard from "../components/dashboard/RevenueCard";

// async data
import AsyncData from "../data/AsyncData";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();

  return (
    <Layout currentPage="dashboard" AppBarTitle={"Dashboard"}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {props.data &&
            Object.keys(props.data).map((key) => {
              return (
                <Grid item xs={12} md={4} key={key}>
                  <RevenueCard
                    title={key}
                    amount={props.data[key]}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </Layout>
  );
};

Dashboard.getInitialProps = async (ctx) => {
  var props = {};
  const { user_id, token } = nextCookie(ctx);

  try {
    const response = await AsyncData.getDashboardData(user_id, token);

    props.data = response.data;
    props.user_id = user_id;
    props.token = token;
  } catch (error) {
    console.log("error in getInitialProps in getDashboardData is : ", error);
  }
  return props;
};

export default withAuthSync(Dashboard);
