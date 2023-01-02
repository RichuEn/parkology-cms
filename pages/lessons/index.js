import React, { forwardRef, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Router from 'next/router';
import Cookies from 'js-cookie';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Layout from './../../components/Layout';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import NotifyIcon from "@material-ui/icons/Notifications";
import NotifyIconForTester from "@material-ui/icons/NotificationsActiveOutlined";
import Table from './../../components/Table';
import { withAuthSync } from './../../utils/auth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import nextCookie from 'next-cookies';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import * as apis from '../../data/apiConfig';
import AsyncData from './../../data/AsyncData';
import { Autocomplete } from '@material-ui/lab';
import { IsNumber } from '../../utils/validations';
import UploadS3 from '../../components/UploadS3MultiPart';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },

  currency_root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
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
}));

const Lessons = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  // initialize sate
  const [tableRef, setTableRef] = useState();

  const [value, setValue] = useState(0);

  const [spinner, setSpinner] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [form_data, setFormDat] = useState({
    title: '',
    passing_grade: '70',
    intro_text: '',
    cme_points: '',
    reference_number: '',
    date: '',
  });
  const [certificate_id, setCertificate_id] = useState('');
  const [generate_certificate, setGenerate_certificate] = useState(false);

  const [categories_list, setCategories_list] = React.useState(
    props.categories
  );
  const [lessonImage, setLessonImage] = React.useState('');
  const [category, setCategory] = React.useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [targetNotification, setTargetNotification] = useState(null);
  const [notificationFormData, setNotificationFormData] = useState({
    id: "",
    type: "",
    message: "",
    slug: "",

  })
  const tableIcons = {
    resetIcon: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />),
    notifyIcon: forwardRef((props, ref) => <NotifyIcon {...props} ref={ref} />),
    notifyIconForTester: forwardRef((props, ref) => <NotifyIconForTester {...props} ref={ref} color="secondary" />),
  };
  const fabs = [
    {
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
      label: 'Add',
    },
  ];

  const handleCategoryChange = (event, newValue) => {
    event.preventDefault();
    setCategory(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrorMsg('');
  };

  const handleClose = () => {
    setOpen(false);
    setFormDat({
      title: '',
      passing_grade: '70',
      intro_text: '',
      cme_points: '',
      reference_number: '',
      date: '',
    });
    setCategory([]);
    setGenerate_certificate(false);
    setCertificate_id('');
    setErrorMsg('');
    setLessonImage('');
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleChange = (field, value) => {
    var new_obj = { ...form_data };

    if (field == 'passing_grade') {
      if (value) {
        if (IsNumber(value)) new_obj[field] = value;
      } else {
        new_obj[field] = '';
      }
    } else {
      new_obj[field] = value;
    }
    setFormDat(new_obj);
  };

  const handleCertificateChange = (event, newValue) => {
    event.preventDefault();
    setCertificate_id(newValue);
  };

  const handleSubmitNewLesson = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token

    if (
      form_data.title != '' &&
      form_data.passing_grade != '' &&
      form_data.intro_text != '' &&
      category.length > 0 &&
      form_data.date
    ) {
      setSpinner(true);

      let categories_id = [];
      category.map((row) => {
        categories_id.push(parseInt(row.id, 10));
      });

      let obj = {
        lesson_name: form_data.title,
        passing_grade: form_data.passing_grade,
        intro_text: form_data.intro_text,
        cme: form_data.cme_points,
        reference_number: form_data.reference_number,
        date: form_data.date,
        categories_id: categories_id,
        image: lessonImage,
        certificate_id: certificate_id?.id,
        generate_certificate: generate_certificate ? 1 : 0,
      };

      try {
        const response = await AsyncData.createLessonData(user_id, obj, token);

        setSpinner(false);
        setErrorMsg('');
        setCategory([]);

        handleClose();
        tableRef.refreshData();

        // close the modal
      } catch (e) {
        console.log('e', e.message);
        setErrorMsg(
          'Something went wrong/or some fields are still not set, try again later !'
        );
        setSpinner(false);
      }
    } else {
      setSpinner(false);
      setErrorMsg('Please fill all the above fields');
    }
  };

  const handleCMECHange = (e) => {
    if (e.target.value) {
      if (IsNumber(e.target.value)) {
        handleChange('cme_points', e.target.value);
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
      // close the modal
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
      scroll={'body'}
    >
      <DialogTitle id="form-dialog-title">Create Lesson</DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a custom Lesson
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Title"
              type="title"
              fullWidth
              onBlur={(e) => handleChange('title', e.target.value)}
            />
            <Grid
              container
              justify={'space-between'}
              item
              xs={12}
              style={{ marginTop: 20, marginBottom: 10 }}
            >
              <Typography component="span" style={{ paddingRight: 20 }}>
                Lesson Image
              </Typography>
              <Typography
                color="secondary"
                component="span"
                style={{ paddingRight: 20 }}
              >
                {lessonImage ? lessonImage.name : 'none selected'}
              </Typography>
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
            </Grid>

            <Autocomplete
              fullWidth
              id="standard-select-category-native"
              multiple
              value={category}
              options={categories_list}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, val) => option.id == val.id}
              autoComplete
              includeInputInList
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Categories Select"
                  margin="normal"
                />
              )}
            />

            <TextField
              value={form_data.passing_grade ? form_data.passing_grade : ''}
              type="number"
              style={{ marginTop: 10 }}
              required
              autoFocus
              label="Passing Grade"
              fullWidth
              onChange={(e) => handleChange('passing_grade', e.target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              required
              autoFocus
              label="Quiz Intro Text"
              type="intro_text"
              fullWidth
              onBlur={(e) => handleChange('intro_text', e.target.value)}
            />
            <TextField
              value={form_data.cme_points ? form_data.cme_points : ''}
              style={{ marginTop: 10 }}
              type="text"
              autoFocus
              label="CME Points"
              fullWidth
              onChange={handleCMECHange}
            />
            <TextField
              style={{ marginTop: 10 }}
              autoFocus
              label="Reference Number"
              type="reference_number"
              fullWidth
              onBlur={(e) => handleChange('reference_number', e.target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              required
              id="date"
              label="Date"
              type="datetime-local"
              defaultValue={
                form_data.date
                  ? String(moment(form_data.date).format('YYYY-MM-DDTHH:mm'))
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
            <Divider style={{ marginTop: 40 }} />

            <FormControlLabel
              label="Generate Certificate"
              control={
                <Checkbox
                  checked={generate_certificate}
                  onClick={checkGenerateBox}
                />
              }
            />

            {generate_certificate ? (
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
            ) : null}
          </Grid>
          <Typography
            color="error"
            component="span"
            style={{ marginTop: 20, marginLeft: 15 }}
          >
            {errorMsg != '' ? errorMsg : ''}
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
      field: 'id',
      title: 'Lesson ID',
    },
    {
      field: 'name',
      title: 'Name',
    },
    {
      field: 'key',
      title: 'Key',
    },
    {
      field: 'passing_grade',
      title: 'Passing Grade',
      hidden: true,
    },
    {
      field: 'total_grade',
      title: 'Total Grade',
      hidden: true,
    },
    {
      field: 'cme',
      title: 'CME Points',
      hidden: true,
    },
    {
      field: 'intro_text',
      title: 'Intro Text',
      hidden: true,
    },
    {
      field: 'overview_title',
      title: 'Overview Title',
      hidden: true,
    },
    {
      field: 'overview_description',
      title: 'overview Description',
      hidden: true,
    },
    {
      field: 'duration',
      title: 'Duration',
      hidden: true,
    },
    {
      field: 'categories_id',
      title: 'Categories Id',
      hidden: true,
    },
    {
      field: 'certificate_id',
      title: 'Certificate Id',
      hidden: true,
    },
    {
      field: 'reference_number',
      title: 'Reference Number',
      hidden: true,
    },
    {
      field: 'inserted_at',
      title: 'Inserted At',
      hidden: true,
    },
  ];

  const extraOptions = {
    actionsColumnIndex: 10,
    search: true,
  };

  const onRowClick = (event, rowData) => {
    Router.push(`/lessons/${rowData.id}`);
  };

  const SendNotificationBtn = {
    tooltip: "Send Notification to All",
    icon: tableIcons.notifyIcon,

    onClick: async (evt, data) => {
      setOpenNotification(true);
      setNotificationFormData({
        id: data.id,
        slug: data.key,
        type: 'ExpandYourKnowledge',
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
        slug: data.key,
        type: 'ExpandYourKnowledge',
        message: ""
      })
      setTargetNotification(1);

    }
  }

  const user_id = Cookies.get('user_id'); // => get user_id
  const token = Cookies.get('token'); // => get token

  return (
    <Layout currentPage="lessons" AppBarTitle={'Lessons'}>
      {addModal}
      {addNotificationModel}
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table
              ref={(ref) => setTableRef(ref)}
              title="Lessons"
              columns={columns}
              fetchURL={AsyncData.getLessonsData(user_id)}
              deleteURL={apis.DELETE_LESSON}
              updateURL={''}
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

Lessons.getInitialProps = async (ctx) => {
  var props = {};
  const { user_id, token } = nextCookie(ctx);

  try {
    let config = {
      headers: { Authorization: 'token ' + token },
    };
    const response = await axios.get(
      `${AsyncData.getCategoriesData()}` + `?page=1&limit=100`,
      config
    );

    const response_certificate_list = await AsyncData.getCertificateList(
      user_id,
      token
    );

    let certificateList = response_certificate_list.data.data
      ? response_certificate_list.data.data
      : [];

    let data = response.data;

    props.categories = data.data;

    props.user_id = user_id;
    props.token = token;
    props.certificate_list = certificateList;
  } catch (error) {
    console.log(
      'error in getInitialProps in getCategoriesData is : ',
      error.message
    );
  }
  return props;
};

export default withAuthSync(Lessons);
