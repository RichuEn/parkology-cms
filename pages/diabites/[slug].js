import { AccordionActions, Button, CircularProgress, Collapse, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, Grid, IconButton, makeStyles, TextareaAutosize, TextField, Typography, useTheme, Zoom } from "@material-ui/core";
import { useState } from "react";
import nextCookie from 'next-cookies';
import Layout from "../../components/Layout";

import { createTheme, alpha } from '@material-ui/core/styles'
import { withAuthSync } from "../../utils/auth";
import EditIcon from '@material-ui/icons/Edit';
import Cookies from "js-cookie";
import Editor from "../../components/Editor";
import { Alert, Autocomplete } from "@material-ui/lab";
import CloseIcon from '@material-ui/icons/Close';
import Panel from "../../components/Panel";
import UploadS3 from '../../components/UploadS3MultiPart';
import AsyncData from "../../data/AsyncData";
import CustomVideoCardWithUpdate from "../../components/CustomVideoCardWithUpdate";
import AddVideoDiaBites from "../../components/AddVideoDiaBites";
import Router from "next/router";

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
    flex: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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


const DiaBiteDetails = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [status, setStatus] = useState(props.status);
    const [videos, setVideos] = useState(props.videos);
    const [addVideosModal, setAddVideosModal] = useState({
        open: false,
        handleClose: () =>
            setAddVideosModal({ ...addVideosModal, ...{ open: false } }),
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [basicInfo_spinner, setBasicInfo_spinner] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState("");

    const [form_data, setFormDat] = useState({
        title: props.title,
        description: props.description,
        thumbnail: props.thumbnail,
        clinical_case: props.clinical_case,
        date: props.date,
        instructor_name: props.speaker,
        video_url: props.videoUrl
    });
    const [selectedInstructor_ids, setSelectedInstructor_ids] = useState(
        props.selectedInstructor ?? null
    );
    const handleSelectChange = (event, newValue) => {
        event.preventDefault();
        setSelectedInstructor_ids(newValue);
    };
    const fabs = [
        {
            color: 'primary',
            className: classes.fab,
            icon: <EditIcon />,
            label: 'Add',
        },
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
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
    }
    const submitBasicInfo = async (e) => {
        e.preventDefault();
        let user_id = Cookies.get('user_id'); // => get user_id
        let token = Cookies.get('token'); // => get token
        var bodyFormData = new FormData();
        bodyFormData.append('title', form_data.title);
        bodyFormData.append('description', form_data.description);
        bodyFormData.append('speaker', selectedInstructor_ids.id);
        // bodyFormData.append('clinical_case', form_data.clinical_case);
        bodyFormData.append('thumbnail', form_data.thumbnail);
        if (
            form_data.title != '' &&
            form_data.thumbnail != '' &&
            form_data.description != '' &&
            // form_data.clinical_case != '' &&
            form_data.instructor_name != ''
        ) {
            setBasicInfo_spinner(true);
            try {
                const response = await AsyncData.EditDiaBitesBasicData(
                    user_id,
                    props.diabite_key,
                    bodyFormData,
                    token
                );
                setSuccess(true);
                setError(false);
                setBasicInfo_spinner(false);
                Router.push(`/diabites`);

            } catch (e) {
                console.log('error in submitBasicInfo() is ', e.response);
                setBasicInfo_spinner(false);
                setError(false);
            }
        }
    }
    const addDetailsModal = (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            scroll={'body'}
        >
            <DialogTitle id="form-dialog-title">Add DiaBite Info </DialogTitle>
            <DialogContent dividers={true}>
                <Grid container="true" spacing={3}>
                    <Grid item xs={12}>
                        <DialogContentText>
                            The following will create a new diabite info
                        </DialogContentText>
                        <TextField
                            // defaultValue={}
                            required
                            autoFocus
                            label="Title"
                            type="title"
                            fullWidth
                            onBlur={(e) => handleChange('title', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.form} noValidate>
                            <Editor
                                value={form_data.description ? form_data.description : ''}
                                name="description"
                                required={true}
                                title="Description"
                                fullWidth
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


    const user_id = Cookies.get('user_id'); // => get user_id
    const token = Cookies.get('token'); // => get token
    return (
        <Layout currentPage="diabites" AppBarTitle={'Diabite Details'}>
            {addDetailsModal}
            <AddVideoDiaBites
                {...addVideosModal}
                diabite_id={props.slug}
                admin_id={user_id}
                token={token}
                addCallback={async (addedVideo) => {
                    console.log(addedVideo.key);

                }}
            />

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
                <Grid spacing={3}>
                    <Grid item xs={12}>
                        <div style={{ marginBottom: 25 }} className={classes.topNamesStyle}>
                            {props.title}
                        </div>
                    </Grid>
                </Grid>
                <Grid xs={12}>
                    <Grid>
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
                                <form className={classes.form} noValidate={true}>
                                    <TextField
                                        defaultValue={form_data.title}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="title"
                                        label="Title"
                                        name="title"
                                        autoFocus
                                        onChange={(e) => handleChange('title', e.target.value)}
                                    />
                                    <TextField
                                        defaultValue={form_data.description}
                                        name="description"
                                        variant="outlined"
                                        multiline
                                        margin="normal"
                                        required
                                        title="Description"
                                        label="Description"
                                        fullWidth
                                        maxRows={6}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                    <FormControl className={classes.formControl}>
                                        <Typography
                                            color="primary"
                                            component="span"
                                            style={{ paddingRight: 20 }}
                                        >
                                            Instructor:
                                        </Typography>

                                        <Autocomplete
                                            fullWidth
                                            value={selectedInstructor_ids}
                                            options={props.instructor_list}
                                            getOptionLabel={(option) => {
                                                return (option.name ? option.name : '') ||
                                                    (option.first_name ? option.first_name : '') +
                                                    (option.last_name ? ' ' + option.last_name : '')
                                            }}
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
                                    <FormControl>
                                        <Grid style={{ marginTop: 15 }} item xs={12}>

                                            <Typography
                                                color="primary"
                                                component="span"
                                                style={{ paddingRight: 20 }}
                                            >
                                                Existing Banner :
                                            </Typography>

                                            <Typography
                                                color="secondary"
                                                component="span"
                                                style={{ paddingRight: 20 }}
                                            >
                                                <a href={form_data.thumbnail}>{form_data.thumbnail}</a>
                                            </Typography>
                                        </Grid>
                                        <div
                                            style={{ marginTop: 30, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                                            className={classes.form}

                                        >

                                            <Typography color="primary"
                                                component="span" style={{ paddingRight: 20 }}>
                                                Update Banner:
                                            </Typography>


                                            <FormControl
                                                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                                                <UploadS3
                                                    accept="image/*"
                                                    admin_id={props.user_id}
                                                    token={props.token}
                                                    finishedProgress={(e) => {
                                                        setThumbnail(e.key);
                                                        setFormDat({
                                                            title: form_data.title,
                                                            description: form_data.description,
                                                            thumbnail: e.key,
                                                            clinical_case: form_data.clinical_case,
                                                            date: form_data.date,
                                                            instructor_name: form_data.instructor_name,
                                                            video_url: form_data.video_url
                                                        })
                                                    }}
                                                />
                                            </FormControl>
                                        </div>



                                    </FormControl>

                                </form>
                            </div>
                        </Panel>
                    </Grid>
                    <Grid style={{ marginTop: 15 }} item xs={12}>


                        <Panel
                            defaultExpanded={true}
                            pannelHeaderTitle={'Video'}>

                            <div
                                container
                                style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                            >
                                {form_data.video_url != "" ?
                                    <CustomVideoCardWithUpdate
                                        key={'CustomVideoCard_'}
                                        url={form_data.video_url}
                                        thumbnail_url={form_data.thumbnail}
                                        overview={form_data.title}
                                    />
                                    : ""
                                }
                                {fabs.map((fab, index) => (
                                    <Zoom
                                        key={fab.color}
                                        in={true}
                                        // timeout={transitionDuration}

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

                            </div>

                        </Panel>
                    </Grid>
                </Grid>
            </Container>



        </Layout >
    )
}
DiaBiteDetails.getInitialProps = async (ctx) => {
    var props = {};
    const { user_id, token } = nextCookie(ctx);

    const diabite_key = ctx.query.slug;
    console.log(diabite_key)

    try {
        const response = await AsyncData.getDiaBitesDetailsData(
            user_id,
            diabite_key,
            token
        );
        const response_instructor_list = await AsyncData.getInstructorList(
            user_id,
            token
        );
        let instructor_list = [];
        response_instructor_list.data.map((ins) => {
            instructor_list.push({ ...ins, id: ins.instructor_id });
        });
        props.diabite_key = diabite_key;
        let data = response.data[0];
        props.id = data.id;
        props.title = data.title;
        props.description = data.description;
        props.thumbnail = data.thumbnail;
        props.country = data.country;
        props.speaker = data.speaker;
        props.email = data.email;
        props.city = data.city;
        props.speciality = data.speciality;
        props.videoUrl = data.videoUrl;
        props.slug = data.slug;
        props.clinical_case = data.clinical_case;
        props.status = true;
        props.instructor_list = instructor_list;
        props.selectedInstructor = {
            id: data.speaker_id,
            name: (data.speaker).trim(),
            instructor_first_name: (data.instructor_first_name),
            instructor_last_name: (data.instructor_last_name),
        };
    }
    catch (e) {
        console.log(e);
    }
    return props
}

export default withAuthSync(DiaBiteDetails);
