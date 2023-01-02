import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Panel from "../../components/Panel";
import Button from "@material-ui/core/Button";
import React, { useState, useEffect } from "react";
import AsyncData from "../../data/AsyncData";
import nextCookie from "next-cookies";
import Router from "next/router";

import EditInfo from "../../components/editInfoModal";
import AccordionActions from "@material-ui/core/AccordionActions";
import DeleteDialog from "../../components/DeleteDialog";
import * as apis from "../../data/apiConfig";

export default function Profile(props) {
  const [quiz, setquiz] = useState({});
  const [lessons, setLessons] = useState([]);
  const [deleteOpts, setDeleteOpts] = useState({
    open: false,
    title: "",
    text: "",
    toggleDeleteModal: () => {
      setDeleteOpts({ ...deleteOpts, ...{ open: !open } });
    },
    deleteURL: ""
  });
  const [openResetModal, setOpenResetModal] = useState(false);

  useEffect(() => {
    setLessons(props.lessons ? props.lessons : []);
    let quizObj = { ...props };
    delete quizObj["lessons"];
    setUser(quizObj);
  }, [props]);
  const useStyles = makeStyles(theme => ({
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      margin: "auto"
    },
    container: {
      paddingTop: theme.spacing(5)
    },
    fullWidth: {
      width: "100%"
    },
    card: {
      paddingTop: theme.spacing(2)
    },
    lessonsGrid: {
      paddingTop: theme.spacing(5)
    },
    buttonsContainer: {
      "& button": {
        marginRight: theme.spacing(2)
      },
      marginBottom: theme.spacing(5),
      marginLeft: theme.spacing(2),
      primary: {
        textTransform: "capitalize"
      }
    }
  }));
  const classes = useStyles();
  
  const listItems = Object.keys(quiz).map(key => {
    const obj = user[key];
    return (
      <ListItem>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ListItemText
              className={classes.primary}
              primary={
                key
                  .split("_")
                  .join(" ")
                  .charAt(0)
                  .toUpperCase() +
                key
                  .split("_")
                  .join(" ")
                  .slice(1)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <ListItemText secondary={obj} />
          </Grid>
        </Grid>
      </ListItem>
    );
  });
  const panels = lessons.map((lesson, idx) => {
    return (
      <Grid item xs={12}>
        <Panel
          disableFooterActions={false}
          defaultExpanded={idx == 0 ? true : false}
          pannelHeaderTitle={lesson.name}
          pannelHeaderDesc={""}
          footer={
            <AccordionActions>
              <Button
                variant="contained"
                color="primary"
                variant="contained"
                onClick={() => {
                  Router.push("/lessons/" + lesson.key);
                }}
              >
                Go To Lesson
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setDeleteOpts({
                    ...deleteOpts,
                    ...{
                      open: true,
                      title: "Delete Quiz",
                      text: "Are you sure you want to delete this quiz?",
                      deleteURL: apis.DELETE_USER_LESSON(
                        user.user_id,
                        lesson.key
                      ),
                      deleteCallback: () => {
                        handleLessonDelete(lesson.key);
                      }
                    }
                  });
                }}
              >
                Delete
              </Button>
            </AccordionActions>
          }
        >
          <List>
            <ListItem>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <ListItemText
                    className={classes.primary}
                    primary={"Reference Number"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ListItemText secondary={lesson["reference_number"]} />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <ListItemText
                    className={classes.primary}
                    primary={"Certificate Name"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ListItemText secondary={lesson["certificate_name"]} />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <ListItemText
                    className={classes.primary}
                    primary={"Status"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ListItemText
                    secondary={lesson["passed"] == 1 ? "Passed" : "In Progress"}
                  />
                </Grid>
              </Grid>
            </ListItem>
            {lesson["passed"] == 1 ? (
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <ListItemText
                      className={classes.primary}
                      primary={"Certificate"}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <a href={lesson["certificate_pdf_url"]} download>
                      <ListItemText secondary={lesson["certificate_pdf_url"]} />
                    </a>
                  </Grid>
                </Grid>
              </ListItem>
            ) : null}
          </List>
        </Panel>
      </Grid>
    );
  });
  const handleUserDelete = async () => {
    setDeleteOpts({ ...deleteOpts, ...{ isDeleting: true } });
    try {
      const res = await new AsyncData().deleteUser(user.user_id);
      setDeleteOpts({
        ...deleteOpts,
        ...{ isDeleting: false, open: false }
      });
      Router.push("/users");
    } catch {
      setDeleteOpts({ ...deleteOpts, ...{ isDeleting: false } });
    }
  };
  const handleLessonDelete = async () => {
    setDeleteOpts({ ...deleteOpts, ...{ isDeleting: true } });
    try {
      const res = await new AsyncData().deleteUser(user.user_id);
      setDeleteOpts({
        ...deleteOpts,
        ...{ isDeleting: false, open: false }
      });
      Router.push("/users");
    } catch {
      setDeleteOpts({ ...deleteOpts, ...{ isDeleting: false } });
    }
  };

  return (
    <Layout currentPage="Profile" AppBarTitle={"Profile"}>
      <DeleteDialog {...deleteOpts} />
      <EditInfo
        openResetModal={openResetModal}
        handleClose={() => setOpenResetModal(false)}
        selectedId={quiz.quiz_id}
        email={quiz.email}
        refreshCallback={data => {
          setquiz({ ...quiz, ...{ email: data.email } });
        }}
      />
      <Container maxWidth="lg" className={classes.container}>
        <Card className={classes.card}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={3}>
              <Avatar
                alt="Remy Sharp"
                src={user.user_image_url}
                className={classes.avatar}
              />
            </Grid> */}
            <Grid item xs={12} md={9}>
              <List>{listItems}</List>
              <div className={classes.buttonsContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenResetModal(true);
                  }}
                >
                  Edit Info
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    setDeleteOpts({
                      ...deleteOpts,
                      ...{
                        open: true,
                        title: "Delete User",
                        text: "Are you sure you want to delete this user?",
                        deleteURL: apis.DELETE_USERS_V2(user.user_id),
                        deleteCallback: () => {
                          Router.push("/users");
                        }
                      }
                    })
                  }
                >
                  Delete User
                </Button>
              </div>
            </Grid>
          </Grid>
        </Card>
        <Grid container spacing={3} className={classes.lessonsGrid}>
          {panels}
        </Grid>
      </Container>
    </Layout>
  );
}
Profile.getInitialProps = async ctx => {  
  if (!ctx.query.id) return {};

const { user_id, token } = nextCookie(ctx);
let props = {};
props.user_id = user_id;
props.token = token;

try {
  const response = await AsyncData.fetchUser(
    user_id,
    token,
    ctx.query.id
  );

  let data = response.data;
  props = { ...props, ...data };
} catch (error) {
  console.log("error in getInitialProps in Profile is : ", error);
}

return props;
};
