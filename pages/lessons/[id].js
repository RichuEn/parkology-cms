import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import nextCookie from 'next-cookies';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import CustomCard from './../../components/CustomCard';
import CustomQuizCard from './../../components/CustomQuizCard';
import CustomVideoCard from './../../components/CustomVideoCard';
import CloseIcon from '@material-ui/icons/Close';
import Layout from './../../components/Layout';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import AccordionActions from '@material-ui/core/AccordionActions';
import IconButton from '@material-ui/core/IconButton';
import { withAuthSync } from './../../utils/auth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Panel from './../../components/Panel';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import AsyncData from './../../data/AsyncData';
import * as apis from '../../data/apiConfig';
import AddVideoLesson from '../../components/AddVideoLesson';
import FormControl from '@material-ui/core/FormControl';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Autocomplete } from '@material-ui/lab';
import { IsNumber } from '../../utils/validations';
import Editor from '../../components/Editor';
import UploadS3 from '../../components/UploadS3MultiPart';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fab: {
    // position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(0),
  },

  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },

  input: {
    display: 'none',
  },

  column: {
    flexBasis: '100%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  Alertroot: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  Stepper_root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  topNamesStyle: {
    fontSize: theme.typography.pxToRem(20),
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(3),
  },

  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
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
    width: '100%',
  },
}));

const LessonsDetails = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  // initialize sate
  const [lesson_info, setLesson_info] = useState(props.lesson_info);
  const [status, setStatus] = useState(props.status);

  const [questions, setQuestions] = useState(props.questions);
  const [videos, setVideos] = useState(props.videos);
  const [addVideosModal, setAddVideosModal] = useState({
    open: false,

    handleClose: () =>
      setAddVideosModal({ ...addVideosModal, ...{ open: false } }),
  });

  const [questionTitle, setQuestionTitle] = useState('');
  const [questionPoints, setQuestionPoints] = useState('10');

  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [basicInfo_spinner, setBasicInfo_spinner] = useState(false);

  const [lessonImage, setLessonImage] = React.useState('');

  const [open, setOpen] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form_data, setFormDat] = useState({
    overview_title: props.overview_title ? props.overview_title : 'Overview',
    overview_description: props.overview_description,
    lesson_name: props.lesson_name,
    cme: props.cme,
    image_url: props.image_url,
    instructor_name: props.instructor_name,
    instructor_image_url: props.instructor_image_url,
    passing_grade: props.passing_grade,
    total_grade: props.total_grade,
    intro_text: props.intro_text,
    certificate_name: props.certificate_name,
    certificate_pdf_url: props.certificate_pdf_url,
    reference_number: props.reference_number,
    date: props.date,
    details_title: '',
    details_desc: '',
  });

  const [selectedInstructor_ids, setSelectedInstructor_ids] = React.useState(
    props.selectedInstructor
  );

  const [certificate_id, setCertificate_id] = React.useState(
    props.certificate_id
  );
  const [generate_certificate, setGenerate_certificate] = React.useState(
    props.generate_certificate
  );

  const handleSelectChange = (event, newValue) => {
    event.preventDefault();
    setSelectedInstructor_ids(newValue);
  };

  const handleCertificateChange = (event, newValue) => {
    event.preventDefault();
    setCertificate_id(newValue);
  };

  const fabs = [
    {
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
      label: 'Add',
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleQuizClickOpen = () => {
    setOpenQuiz(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuizClose = () => {
    setOpenQuiz(false);
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

  const handleDetailsCreationSubmit = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    let data = [];
    if (form_data.details_title != '' && form_data.details_desc != '') {
      let obj = {
        title: form_data.details_title,
        description: form_data.details_desc,
      };
      data.push(obj);

      // code here
      try {
        const response = await AsyncData.createDetailsData(
          user_id,
          props.lesson_key,
          data,
          token
        );

        getCardDetails();
        refreshStatus();
        setSuccess(true);
        // close the modal
        handleClose();
      } catch (e) {
        console.log('error  in detail creation : ', e);
        setError(true);
      }
    }
  };

  const getQuestionDetails = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response_quiz = await AsyncData.getQuizData(
        user_id,
        props.lesson_key,
        token
      );
      setQuestions([]);

      setQuestions(response_quiz.data.questions);
      refreshStatus();
      setSuccess(true);
    } catch (e) {
      console.log('error in getQuestionDetails is ', e);
      setError(true);
    }
  };

  const handleQuestionCreationSubmit = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token

    if (questionTitle != '' && questionPoints != '') {
      var bodyFormData = new FormData();
      bodyFormData.append('question', questionTitle);
      bodyFormData.append('points', questionPoints);

      // code here
      try {
        const response = await AsyncData.createQuestionData(
          user_id,
          props.lesson_key,
          bodyFormData,
          token
        );

        getQuestionDetails();
        refreshStatus();
        setSuccess(true);
        // close the modal
        handleQuizClose();
      } catch (e) {
        console.log('error  in detail creation : ', e);
        setError(true);
      }
    }
  };

  const refreshStatus = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    // code here
    try {
      const response = await AsyncData.refreshStatusData(
        user_id,
        props.lesson_key,
        token
      );

      setStatus(parseInt(response.data));
    } catch (e) {
      console.log('error in resfresh status : ', e.response);
      setError(true);
    }
  };

  const handleAnswerCreationSubmit = async (question_id, answer) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token

    if (answer != '') {
      var bodyFormData = new FormData();
      bodyFormData.append('answer', answer);
      bodyFormData.append('lesson_id', props.lesson_key);

      // code here
      try {
        const response = await AsyncData.addAnswerData(
          user_id,
          question_id,
          bodyFormData,
          token
        );

        getQuestionDetails();
        refreshStatus();
        setSuccess(true);
        // close the modal
      } catch (e) {
        console.log('error  in detail creation : ', e);
        setError(true);
      }
    }
  };

  const handleCorrectAnswer = async (question_id, answer_id) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token

    var bodyFormData = new FormData();
    bodyFormData.append('correct', 1);

    // code here
    try {
      const response = await AsyncData.setCorrectAnswerData(
        user_id,
        question_id,
        answer_id,
        bodyFormData,
        token
      );

      getQuestionDetails();
      refreshStatus();
      setSuccess(true);
      // close the modal
    } catch (e) {
      console.log('error  in detail creation : ', e);
      setError(true);
    }
  };

  const getCardDetails = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.getDetailsData(
        user_id,
        props.lesson_key,
        token
      );

      setLesson_info([]);
      setLesson_info(response.data);
      refreshStatus();
      setSuccess(true);
    } catch (e) {
      console.log('error.response in getCardDetails is ', e.response);
      setError(true);
    }
  };

  const getBasicInfo = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.getLessonDetailsData(
        user_id,
        props.lesson_key,
        token
      );

      let data = response.data;

      let lesson_name = data.name;
      let passing_grade = data.passing_grade;
      let total_grade = data.total_grade;
      let cme = data.cme;
      let certificate_name = data.certificate_name;

      let reference_number = data.reference_number;
      let date = data.date;
      let image_url = data.image_url;
      let instructor_name = data.instructor_name;
      let selectedInstructor = data.instructors;
      let instructor_image_url = data.instructor_image_url;

      var new_obj = { ...form_data };

      new_obj['lesson_name'] = lesson_name;
      new_obj['cme'] = cme;
      new_obj['image_url'] = image_url;
      new_obj['instructor_name'] = instructor_name;
      new_obj['instructor_image_url'] = instructor_image_url;
      new_obj['passing_grade'] = passing_grade;
      new_obj['total_grade'] = total_grade;

      new_obj['certificate_name'] = certificate_name;
      new_obj['reference_number'] = reference_number;
      new_obj['date'] = date;
      setSelectedInstructor_ids(selectedInstructor); //// TODO: FIX this, and check it
      setFormDat(new_obj);

      refreshStatus();
      setSuccess(true);
    } catch (e) {
      console.log('error.response in getBasicInfo is ', e.response);
      setError(true);
    }
  };

  const editCardDetails = async (detail_id, title, description) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    var bodyFormData = new FormData();

    bodyFormData.append('title', title);
    bodyFormData.append('description', description);

    if (title != '' && description != '') {
      try {
        const response = await AsyncData.editDetailsData(
          user_id,
          bodyFormData,
          detail_id,
          token
        );

        getCardDetails();
        refreshStatus();
        setSuccess(true);
        setError(false);
      } catch (e) {
        setError(true);
        setSuccess(false);
      }
    }
  };

  const deleteCardDetails = async (detail_id) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.deleteDetailsData(
        user_id,
        detail_id,
        token
      );
      //
      // location.reload();
      getCardDetails();
      refreshStatus();
      setSuccess(true);
      setError(false);
    } catch (e) {
      console.log('error.response in deleteCardDetails() ', e.response);
      setError(true);
      setSuccess(false);
    }
  };

  const deleteQuestionCard = async (question_id) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.deleteQuestionData(
        user_id,
        question_id,
        token
      );

      getQuestionDetails();
      refreshStatus();
      setSuccess(true);
      setError(false);
    } catch (e) {
      console.log('error.response in deleteQuestionCard() ', e.response);
      setError(true);
      setSuccess(false);
    }
  };

  const submitOverView = async (e) => {
    e.preventDefault();
    setLoading(true);
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    var bodyFormData = new FormData();

    bodyFormData.append('overview_title', form_data.overview_title);
    bodyFormData.append('overview_description', form_data.overview_description);

    if (
      form_data.overview_title != '' &&
      form_data.overview_description != ''
    ) {
      try {
        const response = await AsyncData.createOverViewData(
          user_id,
          props.lesson_key,
          bodyFormData,
          token
        );

        refreshStatus();
        setSuccess(true);
        setError(false);
      } catch (e) {
        setError(true);
        setSuccess(false);
      }
      setLoading(false);
    }
  };

  const submitBasicInfo = async (e) => {
    e.preventDefault();
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    var bodyFormData = new FormData();
    let categories_id_arr = [];
    for (var i in props.categories_name) {
      let cat_row = props.categories_name[i];
      categories_id_arr.push(cat_row.id);
    }

    bodyFormData.append('categories_id', categories_id_arr);
    bodyFormData.append('lesson_name', form_data.lesson_name);
    bodyFormData.append('cme', form_data.cme);
    // bodyFormData.append("image_url", form_data.image_url);

    bodyFormData.append('passing_grade', form_data.passing_grade);
    bodyFormData.append('intro_text', form_data.intro_text);

    bodyFormData.append('reference_number', form_data.reference_number);
    bodyFormData.append('date', form_data.date);
    if (generate_certificate)
      bodyFormData.append(
        'certificate_id',
        certificate_id ? certificate_id.id : ''
      );
    bodyFormData.append('generate_certificate', generate_certificate ? 1 : 0);

    if (lessonImage) {
      bodyFormData.append('image', lessonImage);
    }
    let instructors_ids_arr = [];
    selectedInstructor_ids.map((instructor) => {
      instructors_ids_arr.push(instructor.id);
    });
    bodyFormData.append('instructors_id', instructors_ids_arr);

    if (
      form_data.lesson_name != '' &&
      form_data.image_url != '' &&
      form_data.passing_grade != '' &&
      form_data.total_grade != '' &&
      form_data.date
    ) {
      setBasicInfo_spinner(true);
      try {
        const response = await AsyncData.EditBasicData(
          user_id,
          props.lesson_key,
          bodyFormData,
          token
        );

        getBasicInfo();
        refreshStatus();
        setSuccess(true);
        setError(false);
        setBasicInfo_spinner(false);
      } catch (e) {
        console.log('error in submitBasicInfo() is ', e.response);
      }
    } else {
      console.log('error', 'required fields');
      setError(true);
      setSuccess(false);
      setBasicInfo_spinner(false);
    }
  };

  const handleCMECHange = (e) => {
    if (e.target.value) {
      if (IsNumber(e.target.value)) {
        setFormDat({ ...form_data, ['cme']: e.target.value });
      }
    } else {
      handleChange('cme', '');
    }
  };
  const handleTotalGradesHange = (e) => {
    if (e.target.value) {
      if (IsNumber(e.target.value)) {
        setQuestionPoints(e.target.value);
      }
    } else {
      handleChange('cme_points', '');
    }
  };

  const checkGenerateBox = (e) => {
    e.preventDefault();
    setGenerate_certificate(!generate_certificate);
    if (!generate_certificate == false) setCertificate_id('');
  };

  const addDetailsModal = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={'body'}
    >
      <DialogTitle id="form-dialog-title">Add Lesson Info </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a new lesson info
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Title"
              type="title"
              fullWidth
              onBlur={(e) => handleChange('details_title', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <form className={classes.form} noValidate>
              <Editor
                value={form_data.details_desc ? form_data.details_desc : ''}
                id="1"
                name="details_desc"
                required={true}
                title="Description"
                handleChange={handleChange}
              />
            </form>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {spinner ? (
          <CircularProgress color="primary" />
        ) : (
          <Button onClick={handleDetailsCreationSubmit} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const addQuizModal = (
    <Dialog
      open={openQuiz}
      onClose={handleQuizClose}
      aria-labelledby="form-dialog-title"
      scroll={'body'}
    >
      <DialogTitle id="form-dialog-title">Add Question Info</DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a new Question
            </DialogContentText>
            <TextField
              required
              multiline
              autoFocus
              label="Title"
              type="title"
              fullWidth
              onBlur={(e) => setQuestionTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <form className={classes.form} noValidate>
              <TextField
                value={questionPoints}
                type="text"
                required
                id="standard-full-width"
                label="Total Grade"
                fullWidth
                onChange={handleTotalGradesHange}
              />
            </form>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleQuizClose} color="primary">
          Cancel
        </Button>
        {spinner ? (
          <CircularProgress color="primary" />
        ) : (
          <Button onClick={handleQuestionCreationSubmit} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const user_id = Cookies.get('user_id'); // => get user_id
  const token = Cookies.get('token'); // => get token

  return (
    <Layout currentPage="lessons" AppBarTitle={'Lessons Details'}>
      {addDetailsModal}
      <AddVideoLesson
        {...addVideosModal}
        lesson_id={props.lesson_key}
        admin_id={user_id}
        token={token}
        addCallback={async (addedVideo) => {
          const response = await AsyncData.getLessonDetailsData(
            props.user_id,
            props.lesson_key,
            props.token
          );
          setVideos(response.data.videos);
          refreshStatus();
        }}
      />
      {addQuizModal}

      {/* <Typography className={classes.Alertroot}>
        <Collapse in={error}>
          <Alert
            severity="error"
            primary={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError(false);
                }}
              >
                <CloseIcon
                  onClick={() => {
                    setError(false);
                  }}
                  fontSize="inherit"
                />
              </IconButton>
            }
          >
            There is an error — check it out!
          </Alert>
        </Collapse>
      </Typography>
      <Typography className={classes.Alertroot}>
        <Collapse in={success}>
          <Alert
            primary={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess(false);
                }}
              >
                <CloseIcon
                  onClick={() => {
                    setError(false);
                  }}
                  fontSize="inherit"
                />
              </IconButton>
            }
          >
            You have successfully updated/added this section
          </Alert>
        </Collapse>
      </Typography> */}

      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              color="secondary"
              component="span"
              className={classes.topNamesStyle}
            >
              Categories:
              {props.categories_name.map((item, index) => (
                <Typography
                  component="span"
                  key={'categories_' + index}>
                  {item.name}
                  {index < props.categories_name.length - 1 ? ',' : ''}{' '}
                </Typography>
              ))}
            </Typography>
            <Typography style={{ marginBottom: 25 }} className={classes.topNamesStyle}>
              Lesson: {props.lesson_name}
            </Typography>
            <Panel
              defaultExpanded={true}
              pannelHeaderTitle={'Basic Information'}
              pannelHeaderDesc={
                (status & 2) == 2 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              pannelHeaderDesc_color={
                (status & 2) == 2 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              footer={
                <AccordionActions>
                  {basicInfo_spinner ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Button
                      onClick={submitBasicInfo}
                      size="small"
                      color="primary"
                    >
                      Save
                    </Button>
                  )}
                </AccordionActions>
              }
            >
              <Grid className={classes.column}>
                <FormControl className={classes.form}>
                  <TextField
                    defaultValue={form_data.lesson_name}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="lesson_name"
                    label="Lesson Name"
                    name="lesson_name"
                    autoComplete="lesson_name"
                    autoFocus
                    onBlur={(e) => handleChange('lesson_name', e.target.value)}
                  />
                </FormControl>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Typography
                  color="primary"
                  component="span"
                  style={{ paddingRight: 20 }}
                >
                  Existing Image :
                </Typography>
                <Typography
                  color="secondary"
                  component="span"
                  style={{ paddingRight: 20 }}
                >
                  {form_data.image_url}
                </Typography>
                <FormControl>
                  <Typography component="span" style={{ paddingRight: 20, marginTop: 10 }}>
                    Update Lesson Image
                  </Typography>
                  <Typography
                    color="secondary"
                    component="span"
                    style={{ paddingRight: 20 }}
                  >
                    {lessonImage ? lessonImage : 'none selected'}
                  </Typography>
                </FormControl>

                <FormControl>
                  <UploadS3
                    accept="image/*"
                    admin_id={props.user_id}
                    token={props.token}
                    finishedProgress={(e) => {
                      setLessonImage(e.key);
                    }}
                  />
                </FormControl>

                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <FormControl className={classes.form}>
                  <TextField
                    value={
                      form_data.passing_grade ? form_data.passing_grade : ''
                    }
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="passing_grade"
                    label="Passing Grade"
                    name="passing_grade"
                    autoComplete="passing_grade"
                    autoFocus
                    onChange={(e) =>
                      handleChange('passing_grade', e.target.value)
                    }
                  />
                </FormControl>
                <FormControl className={classes.form}>
                  <TextField
                    defaultValue={form_data.intro_text}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="intro_text"
                    label="Quiz Intro Text"
                    name="intro_text"
                    autoComplete="intro_text"
                    autoFocus
                    onBlur={(e) => handleChange('intro_text', e.target.value)}
                  />
                </FormControl>
                <FormControl className={classes.form}>
                  <TextField
                    value={form_data.cme ? form_data.cme : ''}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="cme"
                    label="CME Points"
                    name="cme"
                    autoComplete="cme"
                    autoFocus
                    onChange={handleCMECHange}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <Typography
                    color="primary"
                    component="span"
                    style={{ paddingRight: 20 }}
                  >
                    Instructor:
                    <Typography className={classes.selectedInstructorIndicator}>
                      Selected: {selectedInstructor_ids.length}
                    </Typography>
                  </Typography>

                  <Autocomplete
                    fullWidth
                    id="demo-simple-select"
                    multiple
                    value={selectedInstructor_ids ?? []}
                    options={props.instructor_list}
                    getOptionLabel={(option) =>
                      (option.name ? option.name : '') ||
                      (option.first_name ? option.first_name : '') +
                      (option.last_name ? ' ' + option.last_name : '')
                    }
                    getOptionSelected={(option, val) => option.id == val.id}
                    autoComplete
                    includeInputInList
                    onChange={handleSelectChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Instructors Select"
                        margin="normal"
                      />
                    )}
                  />
                </FormControl>

                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <FormControl className={classes.form}>
                  <TextField
                    defaultValue={form_data.reference_number}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="reference_number"
                    label="Reference Number"
                    name="reference_number"
                    autoComplete="reference_number"
                    autoFocus
                    onBlur={(e) =>
                      handleChange('reference_number', e.target.value)
                    }
                  />
                </FormControl>

                <FormControl className={classes.form}>
                  <TextField
                    style={{ marginTop: 10 }}
                    fullWidth
                    required
                    id="date"
                    label="Date"
                    type="datetime-local"
                    defaultValue={
                      form_data.date
                        ? String(
                          moment(form_data.date).format('YYYY-MM-DDTHH:mm')
                        )
                        : ''
                    }
                    className={classes.textField}
                    onChange={(e) => {
                      handleChange('date', e.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>

                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                {/*}
                <FormControlLabel
                  label="Generate Certificate"
                  control={
                    <Checkbox
                      checked={generate_certificate}
                      onClick={checkGenerateBox}
                    />
                  }
                /> */}
                <FormControl
                >
                  <Checkbox
                    checked={generate_certificate}
                    onClick={checkGenerateBox}
                  />
                </FormControl>
                <FormControl
                  style={{ marginTop: 8 }}
                >
                  <Typography
                    component="span"
                    style={{ paddingRight: 20 }}
                  >
                    Generate Certificate
                  </Typography>

                </FormControl>

                {generate_certificate ? (
                  <FormControl className={classes.form}>
                    <Autocomplete
                      fullWidth
                      id="certificate_id"
                      value={certificate_id}
                      options={props.certificate_list}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, val) => option.id == val.id}
                      autoComplete
                      includeInputInList
                      onChange={handleCertificateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Certificate Select"
                          margin="normal"
                        />
                      )}
                    />
                  </FormControl>
                ) : <></>}
              </Grid>
            </Panel>
          </Grid>
          <Grid item xs={12}>
            <Panel
              defaultExpanded={false}
              pannelHeaderTitle={'Overview'}
              pannelHeaderDesc={
                (status & 4) == 4 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              pannelHeaderDesc_color={
                (status & 4) == 4 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              footer={
                <AccordionActions>
                  <Button onClick={submitOverView} size="small" color="primary">
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </AccordionActions>
              }
            >
              <Typography className={classes.column}>
                <FormControl className={classes.form}>
                  <TextField
                    defaultValue={form_data.overview_title}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="overview_title"
                    label="Overview Title"
                    name="overview_title"
                    autoComplete="overview_title"
                    autoFocus
                    onBlur={(e) =>
                      handleChange('overview_title', e.target.value)
                    }
                  />
                </FormControl>
                <FormControl className={classes.form}>
                  <TextField
                    defaultValue={form_data.overview_description}
                    multiline
                    required
                    variant="outlined"
                    margin="normal"
                    id="standard-full-width"
                    label="OverView Details"
                    fullWidth
                    onBlur={(e) =>
                      handleChange('overview_description', e.target.value)
                    }
                  />
                </FormControl>
              </Typography>
            </Panel>
          </Grid>
          <Grid item xs={12}>
            <Panel
              defaultExpanded={false}
              pannelHeaderTitle={'Lesson Information'}
              pannelHeaderDesc={
                (status & 8) == 8 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              pannelHeaderDesc_color={
                (status & 8) == 8 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
            >
              <Grid item xs={12}>
                {lesson_info.map((item, index) => (
                  <CustomCard
                    key={'CustomCard_' + index}
                    editCardData={(e) => {
                      editCardDetails(e.id, e.titleValue, e.descValue);
                    }}
                    deleteCardData={(item) => {
                      deleteCardDetails(item);
                    }}
                    id={item.id}
                    lessons_id={item.lessons_id}
                    title={item.title}
                    desc={item.description}
                  />
                ))}
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
              </Grid>
            </Panel>
          </Grid>
          <Grid item xs={12}>
            <Panel
              defaultExpanded={false}
              pannelHeaderTitle={'Videos'}
              pannelHeaderDesc={
                (status & 16) == 16 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              pannelHeaderDesc_color={
                (status & 16) == 16 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
            >
              <Grid item xs={12}>
                {videos.map((item, idx) => (
                  <CustomVideoCard
                    key={'CustomVideoCard_' + idx}
                    deleteURL={apis.DELETE_LESSON_VIDEO(item.id)}
                    deleteCallback={(id) => {
                      setVideos(
                        videos.filter((el) => {
                          return el.id !== id;
                        })
                      );
                      refreshStatus();
                    }}
                    id={item.id}
                    url={item.url}
                    thumbnail_url={item.thumbnail_url}
                    overview={item.overview}
                    duration={item.duration}
                  />
                ))}
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
                      onClick={() =>
                        setAddVideosModal({
                          ...addVideosModal,
                          ...{ open: true },
                        })
                      }
                      aria-label={fab.label}
                      color={fab.color}
                    >
                      {fab.icon}
                    </Fab>
                  </Zoom>
                ))}
              </Grid>
            </Panel>
          </Grid>
          <Grid item xs={12}>
            <Panel
              defaultExpanded={true}
              pannelHeaderTitle={'Quiz'}
              pannelHeaderDesc={
                (status & 32) == 32 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
              pannelHeaderDesc_color={
                (status & 32) == 32 ? (
                  <CheckCircleIcon color="primary" />
                ) : (
                  <WarningIcon color="error" />
                )
              }
            >
              <Grid item xs={12}>
                {questions.map((item, index) => (
                  <CustomQuizCard
                    key={'CustomQuizCard_' + index}
                    editCardData={(e) => {
                      editCardDetails(e.id, e.titleValue, e.descValue);
                    }}
                    addAnswer={(e) => {
                      handleAnswerCreationSubmit(e.question_id, e.answer);
                    }}
                    setCorrectAnswer={(e) => {
                      handleCorrectAnswer(e.question_id, e.answer_id);
                    }}
                    deleteCardData={(item) => {
                      deleteQuestionCard(item);
                    }}
                    deleteCallback={() => {
                      getQuestionDetails();
                    }}
                    id={item.question_id}
                    title={item.title}
                    points={item.points}
                    answers={item.answers}
                  />
                ))}

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
                      onClick={handleQuizClickOpen}
                      aria-label={fab.label}
                      color={fab.color}
                    >
                      {fab.icon}
                    </Fab>
                  </Zoom>
                ))}
              </Grid>
            </Panel>
          </Grid>

        </Grid>
      </Container>
    </Layout>
  );
};

LessonsDetails.getInitialProps = async (ctx) => {
  var props = {};
  const { user_id, token } = nextCookie(ctx);

  const lesson_key = ctx.query.id;

  try {
    const response = await AsyncData.getLessonDetailsData(
      user_id,
      lesson_key,
      token
    );
    const response_quiz = await AsyncData.getQuizData(
      user_id,
      lesson_key,
      token
    );
    const response_instructor_list = await AsyncData.getInstructorList(
      user_id,
      token
    );

    const response_certificate_list = await AsyncData.getCertificateList(
      user_id,
      token
    );

    let data = response.data;
    let quiz_data = response_quiz.data;
    let instructor_list = [];
    response_instructor_list.data.map((ins) => {
      instructor_list.push({ ...ins, id: ins.instructor_id });
    });
    let certificateList = response_certificate_list.data.data
      ? response_certificate_list.data.data
      : [];
    let certificate_id = {};
    certificateList.map((cert) => {
      if (cert.id === data.certificate_id) certificate_id = { ...cert };
    });

    props.lesson_id = data.id;
    props.lesson_name = data.name;
    props.lesson_key = data.id; // on purpose added id instead of key when changed from key to id so that not to change all the endpoints that where using this key
    props.status = parseInt(data.status);
    props.overview_title = data.overview_title;
    props.overview_description = data.overview_description;
    props.categories_id = data.categories_id;
    props.categories_name = data.categories;
    props.certificate_id = certificate_id;
    props.generate_certificate = data.generate_certificate == 1 ? true : false;
    props.duration = data.duration;
    props.passing_grade = data.passing_grade;
    props.total_grade = data.total_grade;
    props.cme = data.cme;

    props.certificate_name = data.certificate_name;
    props.certificate_pdf_url = data.certificate_pdf_url;
    props.reference_number = data.reference_number;
    props.date = data.date;
    props.image_url = data.image_url;
    props.selectedInstructor = data.instructors;
    props.instructor_name = data.instructor_name;
    props.instructor_image_url = data.instructor_image_url;
    props.lesson_info = data.lesson_info;
    props.videos = data.videos;

    props.intro_text = quiz_data.intro_text;
    props.questions = quiz_data.questions;

    props.instructor_list = instructor_list;
    props.certificate_list = certificateList;

    props.user_id = user_id;
    props.token = token;
  } catch (error) {
    console.log(
      'error in getInitialProps in getProfileCertificatesData is : ',
      error
    );
  }
  return props;
};

export default withAuthSync(LessonsDetails);
