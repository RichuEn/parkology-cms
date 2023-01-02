import Avatar from "@material-ui/core/Avatar";
import Cookies from "js-cookie";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import Panel from "../../components/Panel";
import Button from "@material-ui/core/Button";
import React, { useState, useEffect } from "react";
import AsyncData from "../../data/AsyncData";
import nextCookie from "next-cookies";
import Router from "next/router";
import CropImage from "../../components/CropImage";
// import EditInfo from "../../components/editInfoModal";
// import AccordionActions from "@material-ui/core/AccordionActions";
import DeleteDialog from "../../components/DeleteDialog";
import * as apis from "../../data/apiConfig";
import { CircularProgress, Divider, TextField } from "@material-ui/core";

export default function ProfileInstructor(props) {
  const [expertFacultyMembers, setExpertFacultyMembers] = useState(props.expertFacultyMembers);
  const [user, setUser] = useState({});
  const [error, setError] = useState(false);
  const [instructorImage, setInstructorImage] = useState(props.user_image_url);
  const [lessons, setLessons] = useState([]);
  const [deleteOpts, setDeleteOpts] = useState({
    open: false,
    title: "",
    text: "",
    toggleDeleteModal: () => {
      setDeleteOpts({ ...deleteOpts, ...{ open: !open } });
    },
    deleteURL: "",
  });
  const [loading, setLoading] = useState(false);
  // const [openResetModal, setOpenResetModal] = useState(false);

  useEffect(() => {
    setLessons(props.lessons ? props.lessons : []);
    let userObj = { ...props };
    delete userObj["lessons"];
    setUser(userObj);
  }, [props]);
  const useStyles = makeStyles((theme) => ({
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      margin: "auto",
    },
    container: {
      paddingTop: theme.spacing(5),
    },
    fullWidth: {
      width: "100%",
    },
    card: {
      paddingTop: theme.spacing(2),
    },
    lessonsGrid: {
      paddingTop: theme.spacing(5),
    },
    buttonsContainer: {
      "& button": {
        marginRight: theme.spacing(2),
      },
      marginBottom: theme.spacing(5),
      marginLeft: theme.spacing(2),
      primary: {
        textTransform: "capitalize",
      },
    },
  }));
  const classes = useStyles();
  // const listItems = Object.keys(user).map(key => {
  //   const obj = user[key];
  //   return (
  //     <ListItem>
  //       <Grid container spacing={3}>
  //         <Grid item xs={6}>
  //           <ListItemText
  //             className={classes.primary}
  //             primary={
  //               key
  //                 .split("_")
  //                 .join(" ")
  //                 .charAt(0)
  //                 .toUpperCase() +
  //               key
  //                 .split("_")
  //                 .join(" ")
  //                 .slice(1)
  //             }
  //           />
  //         </Grid>
  //         <Grid item xs={6}>
  //           <ListItemText secondary={obj} />
  //         </Grid>
  //       </Grid>
  //     </ListItem>
  //   );
  // });
  // const panels = lessons.map((lesson, idx) => {
  //   return (
  //     <Grid item xs={12}>
  //       <Panel
  //         disableFooterActions={false}
  //         defaultExpanded={idx == 0 ? true : false}
  //         pannelHeaderTitle={lesson.name}
  //         pannelHeaderDesc={""}
  //         footer={
  //           <AccordionActions>
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               variant="contained"
  //               onClick={() => {
  //                 Router.push("/lessons/" + lesson.id);
  //               }}
  //             >
  //               Go To Lesson
  //             </Button>
  //             <Button
  //               variant="contained"
  //               color="secondary"
  //               onClick={() => {
  //                 setDeleteOpts({
  //                   ...deleteOpts,
  //                   ...{
  //                     open: true,
  //                     title: "Delete Instructor",
  //                     text: "Are you sure you want to delete this instructor?",
  //                     deleteURL: apis.DELETE_USER_LESSON(
  //                       user.user_id,
  //                       lesson.key
  //                     ),
  //                     deleteCallback: () => {
  //                       handleLessonDelete(lesson.key);
  //                     }
  //                   }
  //                 });
  //               }}
  //             >
  //               Delete
  //             </Button>
  //           </AccordionActions>
  //         }
  //       >
  //         <List>
  //           <ListItem>
  //             <Grid container spacing={3}>
  //               <Grid item xs={6}>
  //                 <ListItemText
  //                   className={classes.primary}
  //                   primary={"Reference Number"}
  //                 />
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <ListItemText secondary={lesson["reference_number"]} />
  //               </Grid>
  //             </Grid>
  //           </ListItem>
  //           <ListItem>
  //             <Grid container spacing={3}>
  //               <Grid item xs={6}>
  //                 <ListItemText
  //                   className={classes.primary}
  //                   primary={"Certificate Name"}
  //                 />
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <ListItemText secondary={lesson["certificate_name"]} />
  //               </Grid>
  //             </Grid>
  //           </ListItem>
  //           <ListItem>
  //             <Grid container spacing={3}>
  //               <Grid item xs={6}>
  //                 <ListItemText
  //                   className={classes.primary}
  //                   primary={"Status"}
  //                 />
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <ListItemText
  //                   secondary={lesson["passed"] == 1 ? "Passed" : "In Progress"}
  //                 />
  //               </Grid>
  //             </Grid>
  //           </ListItem>
  //           {lesson["passed"] == 1 ? (
  //             <ListItem>
  //               <Grid container spacing={3}>
  //                 <Grid item xs={6}>
  //                   <ListItemText
  //                     className={classes.primary}
  //                     primary={"Certificate"}
  //                   />
  //                 </Grid>
  //                 <Grid item xs={6}>
  //                   <a href={lesson["certificate_pdf_url"]} download>
  //                     <ListItemText secondary={lesson["certificate_pdf_url"]} />
  //                   </a>
  //                 </Grid>
  //               </Grid>
  //             </ListItem>
  //           ) : null}
  //         </List>
  //       </Panel>
  //     </Grid>
  //   );
  // });

  const uploadInstructorImage = async (src) => {
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    // code here
    var bodyFormData = new FormData();
    bodyFormData.append("file", src);

    try {
      const response = await AsyncData.uploadInstructorImageData(
        user_id,
        props.instructor_id,
        bodyFormData,
        token
      );
      // setFormDat({ currency: "AED" });
      // refreshing the data after successfull insert
      setInstructorImage(response.data.image_url);
      setError(false);
    } catch (e) {
      console.log("error in resfresh status : ", e.response);
      setError(true);
    }
  };

  const updateInfo = async ()=>{
    setLoading(true);
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token

    var bodyFormData = new FormData();
    bodyFormData.append("first_name", expertFacultyMembers);
    bodyFormData.append("last_name", "");

    try {
      const response = await AsyncData.updateInstructorData(
        user_id,
        props.instructor_id,
        bodyFormData,
        token
      );
      
      setError(false);
    } catch (e) {
      console.log("error in resfresh status : ", e.response);
      setError(true);
    }
    setLoading(false);
  }

  // const handleLessonDelete = async () => {
  //   setDeleteOpts({ ...deleteOpts, ...{ isDeleting: true } });
  //   try {
  //     const res = await new AsyncData().deleteUser(user.user_id);
  //     setDeleteOpts({
  //       ...deleteOpts,
  //       ...{ isDeleting: false, open: false },
  //     });
  //     Router.push("/instructors");
  //   } catch {
  //     setDeleteOpts({ ...deleteOpts, ...{ isDeleting: false } });
  //   }
  // };

  return (
    <Layout currentPage="instructors" AppBarTitle={"Profile Instructor"}>
      <DeleteDialog {...deleteOpts} />
      {/* not used */}
      {/* <EditInfo
        instructor_edit={true}
        openResetModal={openResetModal}
        handleClose={() => setOpenResetModal(false)}
        selectedId={user.instructor_id}
        email={user.email}
        refreshCallback={data => {
          setUser({ ...user, ...{ email: data.email } });
        }}
      /> */}
      <Container maxWidth="lg" className={classes.container}>
        <Card className={classes.card}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              {/* <CropImage
                SubmitImage={(src) => {
                  let file = src.src;
                  uploadInstructorImage(file);
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={instructorImage}
                  className={classes.avatar}
                />
              </CropImage> */}
              <Avatar
                  alt="Remy Sharp"
                  src={instructorImage}
                  className={classes.avatar}
                />
              <input type="file" id="instructorImage" name="instructorImage" onChange={e=>uploadInstructorImage(e.target.files[0])}/>           
            </Grid>
            <Grid item xs={12} md={8}>
              {/* <List>{listItems}</List> */}
              <TextField
              className={classes.buttonsContainer}
              fullWidth
                type={"text"}
                margin="dense"
                value={expertFacultyMembers}
                variant="outlined"
                id="expertFacultyMembers"
                label="Expert faculty members"
                name="expertFacultyMembers"
                autoFocus
                onChange={(e) => setExpertFacultyMembers(e.target.value)}
              />
              <Divider  style={{ marginBottom: 10 }}/>
              <div className={classes.buttonsContainer}>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenResetModal(true);
                  }}
                >
                  Edit Info
                </Button> */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    setDeleteOpts({
                      ...deleteOpts,
                      ...{
                        open: true,
                        title: "Delete Instructor",
                        text: "Are you sure you want to delete this instructor?",
                        deleteURL: apis.DELETE_INSTRUCTORS_V2(
                          user.instructor_id
                        ),
                        deleteCallback: () => {
                          Router.push("/instructors");
                        },
                      },
                    })
                  }
                >
                  Delete Instructor
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={updateInfo}
                >
                  {loading ? <CircularProgress size ={24} />  : "Update Info"}
                </Button>
              </div>
            </Grid>
          </Grid>
        </Card>
        {/* Dont know what they are used for */}
        {/* <Grid container spacing={3} className={classes.lessonsGrid}>
          {panels}
        </Grid> */}
      </Container>
    </Layout>
  );
}
ProfileInstructor.getInitialProps = async (ctx) => {
  if (!ctx.query.id) return {};

  const { user_id, token } = nextCookie(ctx);
  let props = {};
  props.user_id = user_id;
  props.token = token;

  try {
    const response = await AsyncData.fetchInstructor(
      user_id,
      token,
      ctx.query.id
    );

    let data = response.data;
    let expertFacultyMembers = data.first_name + (data.last_name ? " "+data.last_name : "");
    props = { ...props, ...data, expertFacultyMembers : expertFacultyMembers};
  } catch (error) {
    console.log("error in getInitialProps in ProfileInstructor is : ", error);
  }

  return props;
};
