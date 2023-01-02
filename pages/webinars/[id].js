import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import moment from 'moment';
import Cookies from 'js-cookie';
import nextCookie from 'next-cookies';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import CustomAgendaCard from './../../components/CustomAgendaCard';
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
import FormControl from '@material-ui/core/FormControl';
import { Autocomplete } from '@material-ui/lab';
import { IsNumber } from '../../utils/validations';

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

const WebinarsDetails = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  // initialize sate

  const [addVideosModal, setAddVideosModal] = useState({
    open: false,

    handleClose: () =>
      setAddVideosModal({ ...addVideosModal, ...{ open: false } }),
  });

  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [basicInfo_spinner, setBasicInfo_spinner] = useState(false);
  const [open, setOpen] = useState(false);

  const [fromDate, setFromDate] = useState(props.webinar_date);
  const [toDate, setToDate] = useState(props.webinar_date_to);
  const [agenda, setAgenda] = useState(props.agenda);
  const [framework, setFramework] = useState(props.framework);

  const [form_data, setFormDat] = useState({
    id: props.webinar_id,
    title: props.webinar_title,
    description: props.webinar_description,
    clickmeeting_url: props.clickmeeting_url,
    clickmeeting_roomid: props.clickmeeting_roomid,
    url: props.urls,
    date: props.webinar_date,
    date_to: props.webinar_date_to,
    agenda_description: '',
    agenda_time: '',
    agenda_title: '',
    agenda_order: '',
  });

  const [selectedInstructor_ids, setSelectedInstructor_ids] = React.useState(
    props.selectedInstructor
  );

  const handleSelectChange = (event, newValue) => {
    event.preventDefault();
    setSelectedInstructor_ids(newValue);
  };

  const handleFrameworkSelectChange = (event, newValue) => {
    event.preventDefault();
    console.log(framework)
    setFramework(newValue);
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

  const handleClose = () => {
    setOpen(false);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleChange = (field, value) => {
    var new_obj = { ...form_data };

    if (field === 'clickmeeting_roomid') {
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

  const onFromDateChange = (value) => {
    setFromDate(value);
  };
  const onToDateChange = (value) => {
    setToDate(value);
  };

  const getAgendaDetails = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.getWebinarAgendaData(
        user_id,
        props.lesson_key,
        token
      );

      setAgenda([]);
      setAgenda(response.data);
      setSuccess(true);
    } catch (e) {
      console.log('error.response in getAgendaDetails is ', e.response);
      setError(true);
    }
  };

  const getWebinarBasicInfo = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.getWebinarDetailsData(
        user_id,
        props.lesson_key,
        token
      );

      let data = response.data;

      let webinar_id = data.id;
      let webinar_framework = data.framework == "zoom" ? { title: "Zoom", value: "zoom" } : { title: "Click Meeting", value: "click-meeting" };
      let webinar_url = data.url;
      let webinar_title = data.title;
      let webinar_description = data.description; // on purpose added id instead of key when changed from key to id so that not to change all the endpoints that where using this key
      let webinar_date = data.date; // added this field when changed from key to id
      let status = parseInt(data.status);
      let webinar_date_to = data.date_to;

      let selectedInstructor = data.instructors;
      var new_obj = { ...form_data };

      new_obj['id'] = webinar_id;
      new_obj['title'] = webinar_title;
      new_obj['description'] = webinar_description;
      new_obj['framework'] = webinar_framework.value;
      new_obj['url'] = webinar_url;
      new_obj['date'] = webinar_date;
      new_obj['date_to'] = webinar_date_to;
      new_obj['clickmeeting_url'] = data.clickmeeting_url;
      new_obj['clickmeeting_roomid'] = data.clickmeeting_roomid;

      setSelectedInstructor_ids(selectedInstructor);
      setFormDat(new_obj);

      setSuccess(true);
    } catch (e) {
      console.log('error.response in getWebinarBasicInfo is ', e.response);
      setError(true);
    }
  };

  const editAgendaDetails = async (
    detail_id,
    title,
    description,
    time,
    order
  ) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    var bodyFormData = new FormData();

    bodyFormData.append('title', title);
    bodyFormData.append('description', description);
    bodyFormData.append('time', time);
    bodyFormData.append('order', order);

    if (title != '' && description != '' && time != '' && order != '') {
      setSpinner(true);
      try {
        const response = await AsyncData.editAgendaData(
          user_id,
          props.lesson_key,
          detail_id,
          bodyFormData,
          token
        );

        getAgendaDetails();
        setSpinner(false);
        setSuccess(true);
        setError(false);
      } catch (e) {
        setError(true);
        setSpinner(false);
        setSuccess(false);
      }
    }
  };

  const deleteAgendaDetails = async (detail_id) => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    try {
      const response = await AsyncData.deleteAgendaData(
        user_id,
        props.lesson_key,
        detail_id,
        token
      );

      getAgendaDetails();
      setSuccess(true);
      setError(false);
    } catch (e) {
      console.log('error.response in deleteAgendaDetails() ', e.response);
      setError(true);
      setSuccess(false);
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

    bodyFormData.append('title', form_data.title);
    bodyFormData.append('description', form_data.description);
    bodyFormData.append('framework', framework.value);
    bodyFormData.append('url', form_data.url);
    bodyFormData.append('clickmeeting_url', form_data.clickmeeting_url);
    bodyFormData.append('clickmeeting_roomid', form_data.clickmeeting_roomid);
    bodyFormData.append('date', fromDate);
    bodyFormData.append('date_to', toDate);

    let instructor_id = '';
    if (selectedInstructor_ids.length > 0) {
      instructor_id = selectedInstructor_ids;
      let instructors_ids_arr = [];
      for (var k in selectedInstructor_ids) {
        let instructor_row = selectedInstructor_ids[k];
        instructors_ids_arr.push(instructor_row.id);
      }
      bodyFormData.append('instructors', instructors_ids_arr);
    }

    if (
      form_data.title != '' &&
      form_data.description != '' &&
      framework != '' &&
      instructor_id.length > 0
    ) {
      setBasicInfo_spinner(true);
      try {
        const response = await AsyncData.EditWebinarBasicData(
          user_id,
          props.lesson_key,
          bodyFormData,
          token
        );

        getWebinarBasicInfo();
        setSuccess(true);
        setError(false);
        setBasicInfo_spinner(false);
      } catch (e) {
        console.log(
          'error in submitBasicInfo() in Webinar Details is ',
          e.response
        );
      }
    } else {
      setError(true);
      setSuccess(false);
      setBasicInfo_spinner(false);
    }
  };

  const handleAgendaCreationSubmit = async () => {
    let user_id = Cookies.get('user_id'); // => get user_id
    let token = Cookies.get('token'); // => get token
    let data = [];
    if (
      form_data.agenda_title != '' &&
      form_data.agenda_description != '' &&
      form_data.agenda_time != '' &&
      form_data.agenda_order != ''
    ) {
      var bodyFormData = new FormData();

      bodyFormData.append('title', form_data.agenda_title);
      bodyFormData.append('description', form_data.agenda_description);
      bodyFormData.append('time', form_data.agenda_time);
      bodyFormData.append('order', form_data.agenda_order);

      // code here
      try {
        const response = await AsyncData.AddAgendaData(
          user_id,
          props.lesson_key,
          bodyFormData,
          token
        );

        getAgendaDetails();
        setSuccess(true);
        // close the modal
        handleClose();
      } catch (e) {
        console.log('error  in detail creation : ', e);
        setError(true);
      }
    }
  };

  const addDetailsModal = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={'body'}
    >
      <DialogTitle id="form-dialog-title">Add Agenda Event </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a new Agenda event
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Title"
              type="title"
              fullWidth
              onBlur={(e) => handleChange('agenda_title', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <form className={classes.form} noValidate>
              <TextField
                multiline
                required
                id="standard-full-width"
                label="Description"
                fullWidth
                onBlur={(e) =>
                  handleChange('agenda_description', e.target.value)
                }
              />
            </form>
          </Grid>
          <Grid item xs={12}>
            <form className={classes.form} noValidate>
              <TextField
                multiline
                required
                id="time"
                label="Time"
                fullWidth
                onBlur={(e) => handleChange('agenda_time', e.target.value)}
              />
            </form>
          </Grid>
          <Grid item xs={12}>
            <form className={classes.form} noValidate>
              <TextField
                multiline
                required
                id="order"
                label="Order"
                fullWidth
                onBlur={(e) => handleChange('agenda_order', e.target.value)}
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
          <Button onClick={handleAgendaCreationSubmit} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const user_id = Cookies.get('user_id'); // => get user_id
  const token = Cookies.get('token'); // => get token

  return (
    <Layout currentPage="webinars" AppBarTitle={'Webinar Details'}>
      {addDetailsModal}
      <div className={classes.Alertroot}>
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
      </div>
      <div className={classes.Alertroot}>
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
      </div>

      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div style={{ marginBottom: 25 }} className={classes.topNamesStyle}>
              Webinar: {props.webinar_title}
            </div>
            <Panel
              defaultExpanded={true}
              pannelHeaderTitle={'Basic Information'}
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
              <div className={classes.column}>
                <form className={classes.form} noValidate>
                  <TextField
                    defaultValue={form_data.title}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    autoFocus
                    onBlur={(e) => handleChange('title', e.target.value)}
                  />
                </form>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <form className={classes.form} noValidate>
                  <TextField
                    defaultValue={form_data.clickmeeting_url}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="clickmeeting_url"
                    label="Clickmeeting Url"
                    name="clickmeeting_url"
                    autoComplete="clickmeeting_url"
                    autoFocus
                    onBlur={(e) =>
                      handleChange('clickmeeting_url', e.target.value)
                    }
                  />
                  <TextField
                    value={form_data.clickmeeting_roomid}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="clickmeeting_roomid"
                    label="Clickmeeting Id"
                    name="clickmeeting_roomid"
                    autoComplete="clickmeeting_roomid"
                    autoFocus
                    onChange={(e) =>
                      handleChange('clickmeeting_roomid', e.target.value)
                    }
                  />
                  <TextField
                    value={form_data.url}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="url"
                    label="url"
                    name="url"
                    autoComplete="url"
                    autoFocus
                    onChange={(e) =>
                      handleChange('url', e.target.value)
                    }
                  />
                </form>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />

                <form className={classes.form} noValidate>
                  <TextField
                    defaultValue={form_data.description}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    autoComplete="description"
                    autoFocus
                    onBlur={(e) => handleChange('description', e.target.value)}
                  />
                </form>

                <form className={classes.form} noValidate>
                  <TextField
                    id="datetime-from"
                    label="Date From"
                    type="datetime-local"
                    defaultValue={String(
                      moment(form_data.date).format('YYYY-MM-DDTHH:mm')
                    )}
                    className={classes.textField}
                    onChange={(e) => {
                      onFromDateChange(e.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>

                <form className={classes.form} noValidate>
                  <TextField
                    id="datetime-to"
                    label="Date To"
                    type="datetime-local"
                    defaultValue={moment(form_data.date_to).format(
                      'YYYY-MM-DDTHH:mm'
                    )}
                    className={classes.textField}
                    onChange={(e) => {
                      onToDateChange(e.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>

                <FormControl className={classes.formControl}>
                  <Typography
                    color="primary"
                    component="span"
                    style={{ paddingRight: 20 }}
                  >
                    Instructor:{' '}
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
                      option.name ||
                      option.first_name +
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
                    id="framwork-select"
                    value={framework}
                    options={[
                      { 'value': "click-meeting", 'title': "Click Meeting" },
                      { 'value': "zoom", 'title': "Zoom" },
                    ]}
                    getOptionLabel={(option) =>
                      option.title
                    }
                    getOptionSelected={(option, val) => option.value == val.value}
                    autoComplete
                    includeInputInList
                    onChange={handleFrameworkSelectChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Framework Select"
                        margin="normal"
                      />
                    )}
                  />
                </FormControl>
              </div>
            </Panel>
          </Grid>

          <Grid item xs={12}>
            <Panel defaultExpanded={false} pannelHeaderTitle={'Agenda'}>
              <Grid item xs={12}>
                {agenda.map((item, index) => (
                  <CustomAgendaCard
                    key={'custom_' + index}
                    editCardData={(e) => {
                      editAgendaDetails(
                        e.id,
                        e.titleValue,
                        e.descValue,
                        e.timeValue,
                        e.orderValue
                      );
                    }}
                    deleteCardData={(item) => {
                      deleteAgendaDetails(item);
                    }}
                    id={item.id}
                    lessons_id={item.lessons_id}
                    title={item.title}
                    desc={item.description}
                    time={item.time}
                    order={item.order}
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
        </Grid>
      </Container>
    </Layout>
  );
};

WebinarsDetails.getInitialProps = async (ctx) => {
  var props = {};
  const { user_id, token } = nextCookie(ctx);

  const lesson_key = ctx.query.id;

  try {
    const response = await AsyncData.getWebinarDetailsData(
      user_id,
      lesson_key,
      token
    );
    const response_agenda = await AsyncData.getWebinarAgendaData(
      user_id,
      lesson_key,
      token
    );

    const response_instructor_list = await AsyncData.getInstructorList(
      user_id,
      token
    );

    let data = response.data;
    let data_agenda = response_agenda.data;

    let instructor_list = [];
    response_instructor_list.data.map((ins) => {
      instructor_list.push({ ...ins, id: ins.instructor_id });
    });

    props.webinar_id = data.id;
    props.lesson_key = lesson_key;
    props.webinar_title = data.title;
    props.webinar_description = data.description; // on purpose added id instead of key when changed from key to id so that not to change all the endpoints that where using this key
    props.webinar_date = data.date; // added this field when changed from key to id
    props.status = parseInt(data.status);
    props.webinar_date_to = data.date_to;
    props.urls = data.url ? data.url : '';
    props.framework = data.framework == "zoom" ? { value: data.framework, title: "Zoom" } : { value: data.framework, title: "Click Meeting" };
    props.clickmeeting_url = data.clickmeeting_url ? data.clickmeeting_url : '';
    props.clickmeeting_roomid = data.clickmeeting_roomid
      ? data.clickmeeting_roomid
      : '';
    props.agenda = data_agenda;
    props.selectedInstructor = data.instructors;
    props.instructor_list = instructor_list;

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

export default withAuthSync(WebinarsDetails);
