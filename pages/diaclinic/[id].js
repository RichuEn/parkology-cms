import { AccordionActions, Button, CircularProgress, Collapse, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, Grid, IconButton, makeStyles, TextareaAutosize, TextField, Typography, useTheme, Zoom } from "@material-ui/core";
import { useState } from "react";
import nextCookie from 'next-cookies';
import Layout from "../../components/Layout";
import { withAuthSync } from "../../utils/auth";
import EditIcon from '@material-ui/icons/Edit';
import Cookies from "js-cookie";
import { Alert } from "@material-ui/lab";
import CloseIcon from '@material-ui/icons/Close';
import Panel from "../../components/Panel";
import UploadS3 from '../../components/UploadS3MultiPart';
import AsyncData from "../../data/AsyncData";
import Router from "next/router";

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



const DiaClinicDetails = (props) => {
    const classes = useStyles();
    const theme = useTheme();
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
    const [thumbnail, setThumbnail] = useState("");

    const [form_data, setFormDat] = useState({
        id: props.diaClinicId,
        title: props.title,
        thumbnail: props.thumbnail,
        author: props.author,
    });


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
        bodyFormData.append('author', form_data.author);
        bodyFormData.append('thumbnail', form_data.thumbnail);
        if (
            form_data.title != '' &&
            form_data.thumbnail != '' &&
            form_data.author != ''
        ) {
            setBasicInfo_spinner(true);
            try {
                const response = await AsyncData.EditDiaClinicBasicData(
                    user_id,
                    props.diaclinic_key,
                    bodyFormData,
                    token
                );
                setSuccess(true);
                setError(false);
                setBasicInfo_spinner(false);
                Router.push(`/diaclinic`);

            } catch (e) {
                console.log('error in submitBasicInfo() is ', e.response);
                setBasicInfo_spinner(false);
                setError(false);
            }
        } else {
            console.log('Error in Data Please try Again')
        }
    }
    const addDetailsModal = (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            scroll={'body'}
        >
            <DialogTitle id="form-dialog-title">Add DiaClinic Info </DialogTitle>
            <DialogContent dividers={true}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <DialogContentText>
                            The following will create a new diaclinic info
                        </DialogContentText>
                        <TextField
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
                            <TextField
                                required
                                autoFocus
                                label="Author"
                                type="author"
                                fullWidth
                                onBlur={(e) => handleChange('author', e.target.value)}
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
        <Layout currentPage="diaclinic" AppBarTitle={'DiaClinic Details'}>
            {addDetailsModal}

            {/* <div className={classes.Alertroot}>
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
            </div> */}

            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography style={{ marginBottom: 25 }} className={classes.topNamesStyle}>
                            {props.title}
                        </Typography>
                    </Grid>
                </Grid>
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
                    <Grid className={classes.column}>

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
                            defaultValue={form_data.author}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="author"
                            label="Author"
                            name="author"
                            onChange={(e) => handleChange('author', e.target.value)}
                        />

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
                        {/* <div
                                    style={{ marginTop: 30, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                                    className={classes.form}

                                > */}

                        <Typography component="span" style={{ paddingRight: 20, fontWeight: 'bold' }}>
                            Update Banner
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
                                        id: form_data.id,
                                        title: form_data.title,
                                        author: form_data.author,
                                        thumbnail: e.key,
                                    })
                                }}
                            />
                        </FormControl>
                        {/* </div> */}
                    </Grid>

                </Panel>

            </Container>



        </Layout >
    )
}
DiaClinicDetails.getInitialProps = async (ctx) => {
    var props = {};
    const { user_id, token } = nextCookie(ctx);

    const diaclinic_key = ctx.query.id;

    try {
        const response = await AsyncData.getDiaClinicDetailsData(
            user_id,
            diaclinic_key,
            token
        );
        props.diaclinic_key = diaclinic_key;
        let data = response.data;

        props.id = data.id;
        props.title = data.title;
        props.thumbnail = data.thumbnail;
        props.author = data.author;
        props.slug = data.slug;
        props.status = true;
    }
    catch (e) {
        console.log(e);
    }
    return props
}

export default withAuthSync(DiaClinicDetails);
