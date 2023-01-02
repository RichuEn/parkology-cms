import { withAuthSync } from "../../utils/auth";
import Layout from "../../components/Layout";
import nextCookie from 'next-cookies';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, FormControl, Grid, makeStyles, TextField, Typography, useTheme, Zoom } from "@material-ui/core";
import { forwardRef, useState } from "react";
import * as apis from "../../data/apiConfig";
import EditIcon from "@material-ui/icons/Edit";
import NotifyIcon from "@material-ui/icons/Notifications";
import NotifyIconForTester from "@material-ui/icons/NotificationsActiveOutlined";

import Table from "../../components/Table";
import Cookies from "js-cookie";
import AddIcon from "@material-ui/icons/Add";
import Router from 'next/router';
import AsyncData from "../../data/AsyncData";
import { Autocomplete } from "@material-ui/lab";
import UploadS3 from "../../components/UploadS3MultiPart";
import AddVideoDiaBites from "../../components/AddVideoDiaBites";
import CustomVideoCardWithUpdate from "../../components/CustomVideoCardWithUpdate";

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

const extraOptions = {
    actionsColumnIndex: 10,
    search: true
};
const tableIcons = {
    // resetIcon: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />),
    notifyIcon: forwardRef((props, ref) => <NotifyIcon {...props} ref={ref} />),
    notifyIconForTester: forwardRef((props, ref) => <NotifyIconForTester {...props} ref={ref} color="secondary" />),

};

const DiaBites = (props) => {
    const [isAddDiaBites, setIsAddDiaBites] = useState(true);
    const [tableRef, setTableRef] = useState();
    const [spinner, setSpinner] = useState(false);
    const [selectedKey, setSelectedKey] = useState(true);
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [image, setImage] = useState();
    const [value, setValue] = useState(0);
    const [diabitesItem, setDiaBitesItem] = useState(null);
    const [selectedInstructor_ids, setSelectedInstructor_ids] = useState(null);
    const theme = useTheme();
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationFormData, setNotificationFormData] = useState({
        id: "",
        type: "",
        message: "",
        slug: "",

    })
    const [targetNotification, setTargetNotification] = useState(null);

    const [addVideosModal, setAddVideosModal] = useState({
        open: false,
        handleClose: () =>
            setAddVideosModal({ ...addVideosModal, ...{ open: false } }),
    });
    const [form_data, setFormData] = useState({
        title: "",
        description: "",
        image_url: "",
        speaker: "",
        video_url: "",
        slug: "",
    });



    const classes = useStyles();
    const columns = [
        {
            field: "id",
            title: "DiaBites ID"
        },
        {
            field: "title",
            title: "Title"
        },
        {
            field: "slug",
            title: "Key"
        },
        {
            field: "speaker",
            title: "Speaker"
        },
    ];

    const fabs = [
        {
            color: "primary",
            className: classes.fab,
            icon: <AddIcon />,
            label: "Add"
        }
    ];

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen
    };
    const handleSelectChange = (event, newValue) => {
        event.preventDefault();
        setSelectedInstructor_ids(newValue);
    };
    // const EditDiaBitesBtn = {
    //     tooltip: "Edit DiaBites",
    //     icon: tableIcons.resetIcon,
    //     onClick: async (evt, data) => {
    //         setIsAddDiaBites(false);
    //         setOpen(true);
    //         setDiaBitesItem(data);
    //         setSelectedInstructor_ids({
    //             id: data.speaker_id,
    //             name: data.speaker
    //         })
    //         setImage(data.thumbnail);
    //         setFormData({
    //             title: data.title,
    //             description: data.description,
    //             image_url: data.thumbnail,
    //             speaker: data.speaker,
    //             video_url: data.videoUrl,
    //             slug: data.slug,

    //         })
    //     }
    // }
    const SendNotificationBtn = {
        tooltip: "Send Notification to All",
        icon: tableIcons.notifyIcon,

        onClick: async (evt, data) => {
            setOpenNotification(true);
            setNotificationFormData({
                id: data.id,
                slug: data.slug,
                type: 'DiaBites',
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
                slug: data.slug,
                type: 'DiaBites',
                message: "",
            })
            setTargetNotification(1);

        }
    }
    const onRowClick = (event, rowData) => {
        Router.push(`diabites/${rowData.slug}`);
    };
    const handleClickOpen = () => {
        setIsAddDiaBites(true);
        setFormData({
            title: "",
            description: "",
            image_url: "",
            speaker: "",
            video_url: "",
            slug: "",

        });
        setImage("");
        setOpen(true);
        setErrorMsg("");
    };
    const handleClose = () => {
        setFormData({
            title: "",
            description: "",
            image_url: "",
            speaker: "",
            video_url: "",
            slug: "",

        });
        setImage("");
        setOpen(false);
        setErrorMsg("");
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
    const handleFileChange = event => {
        if (event.target.files && event.target.files[0]) {
            let formData = new FormData();

            formData.append("image", event.target.files[0]);
            let file_sub_zero = event.target.files[0];

            try {
                setImage(file_sub_zero);
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleChange = (field, value) => {
        var new_obj = { ...form_data };
        new_obj[field] = value;
        setFormData(new_obj);
    };
    const handleChangeNotification = (field, value) => {
        var new_obj = { ...notificationFormData };
        new_obj[field] = value;
        setNotificationFormData(new_obj);
    }
    const handleSubmit = async () => {
        let user_id = Cookies.get("user_id"); // => get user_id
        let token = Cookies.get("token"); // => get token
        if (form_data.title != "" &&
            form_data.description != "" &&
            selectedInstructor_ids != "" &&
            image) {
            var bodyFormData = new FormData();
            bodyFormData.append("title", form_data.title);
            bodyFormData.append("clinical_case", form_data.title);
            bodyFormData.append("speaker", selectedInstructor_ids.id);
            bodyFormData.append("description", form_data.description);
            bodyFormData.append("thumbnail", image);
            setSpinner(true);
            try {
                let response = null;
                response = await AsyncData.createDiaBitesData(
                    user_id,
                    bodyFormData,
                    token
                );
                setSpinner(false);

                tableRef.refreshData();
                setErrorMsg("");
                // close the modal
                handleClose();
            } catch (e) {
                setSpinner(false);
                setErrorMsg("Something went wrong, please try again later!");
                console.log("error in : ", e);
                console.error(e.response.data);     // NOTE - use "error.response.data` (not "error")

            }
        } else {
            setErrorMsg("Please fill all the required fields");
        }
    };
    const UpdateBasicInfo = async (e) => {
        e.preventDefault();
        let user_id = Cookies.get('user_id'); // => get user_id
        let token = Cookies.get('token'); // => get token
        var bodyFormData = new FormData();
        bodyFormData.append('title', form_data.title);
        bodyFormData.append('description', form_data.description);
        bodyFormData.append('speaker', selectedInstructor_ids.id);
        // bodyFormData.append('clinical_case', form_data.clinical_case);
        bodyFormData.append('thumbnail', image);
        if (
            form_data.title != '' &&
            form_data.thumbnail != '' &&
            form_data.description != '' &&
            // form_data.clinical_case != '' &&
            form_data.speaker != ''
        ) {
            setSpinner(true);
            try {
                const response = await AsyncData.EditDiaBitesBasicData(
                    user_id,
                    form_data.slug,
                    bodyFormData,
                    token
                );
                setSpinner(false);

                tableRef.refreshData();
                setErrorMsg("");
                // close the modal
                handleClose();

            } catch (e) {
                setSpinner(false);
                setErrorMsg("Something went wrong, please try again later!");
                console.log("error in : ", e);
                console.error(e.response);     // NOTE - use "error.response.data` (not "error")
            }
        }
    }
    const addModal = (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            scroll={"body"}
        >
            <DialogTitle id="form-dialog-title">
                {isAddDiaBites ? "Create DiaBites" : "Edit DiaBites"}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <DialogContentText>
                            {isAddDiaBites
                                ? "The following will create DiaBites"
                                : "The following will edit a diaBites"}
                        </DialogContentText>
                        <TextField
                            required
                            autoFocus
                            label="Title"
                            type="title"
                            fullWidth
                            value={form_data.title}
                            onChange={e => handleChange("title", e.target.value)}
                        />
                        <TextField
                            name="description"
                            multiline
                            margin="normal"
                            required
                            title="Description"
                            label="Description"
                            fullWidth
                            maxRows={6}
                            value={form_data.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />

                        <Autocomplete
                            fullWidth
                            id="demo-simple-select"
                            value={selectedInstructor_ids}
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
                    </Grid>

                    {/* <Grid item xs={12}>
                        <form style={{ marginTop: 10 }} className={classes.form} noValidate>
                            <input
                                onChange={handleFileChange}
                                accept="image/*"
                                className={classes.input}
                                id="contained-button1-file"
                                type="file"
                            />

                            <label htmlFor="contained-button1-file">
                                <Button variant="contained" color="primary" component="span">
                                    {isAddDiaBites ? "Banner" : "Update banner"}
                                </Button>
                            </label>
                            {isAddDiaBites || (!isAddDiaBites && image) ? (
                                <Typography
                                    color="secondary"
                                    component="div"
                                    style={{ paddingRight: 20 }}
                                >
                                    {image ? image.name : "please choose banner"}
                                </Typography>
                            ) : (
                                <div
                                    style={{

                                        textAlign: "center",
                                        marginTop: "10px"
                                    }}
                                >
                                    <img
                                        style={{ height: "150px" }}
                                        src={form_data.image_url}
                                    />
                                </div>
                            )}
                        </form>
                    </Grid> */}

                    <Grid
                        container
                        justify={'space-between'}
                        item
                        xs={12}
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}
                    >
                        <div
                            xs={12}
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography component="span" style={{ paddingRight: 20 }}>
                                DiaBite Banner
                            </Typography>
                            <br />
                            <Typography
                                color="secondary"
                                component="span"
                                style={{ paddingRight: 20 }}
                            >
                                {image ? (image.name || image) : 'none selected'}
                            </Typography>
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <UploadS3
                                accept="image/*"
                                admin_id={props.user_id}
                                token={props.token}
                                finishedProgress={(e) => {
                                    setImage(e.key);
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid
                        container
                        justify={'space-between'}
                        item
                        xs={12}
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {form_data.video_url != "" ?
                            <div style={{}}>
                                <CustomVideoCardWithUpdate
                                    key={'CustomVideoCard_'}
                                    url={form_data.video_url}
                                    thumbnail_url={form_data.thumbnail}
                                    overview={form_data.title}
                                />
                            </div>
                            : <></>
                        }
                        <div
                            style={{ position: 'relative', marginTop: 20, display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {fabs.map((fab, index) => (
                                <Zoom
                                    key={fab.color}
                                    in={true}
                                    // timeout={transitionDuration}

                                    unmountOnExit
                                >
                                    <Fab
                                        // className={fab.className}
                                        onClick={() =>
                                            setAddVideosModal({
                                                ...addVideosModal,
                                                ...{ open: true },
                                            })
                                        }
                                        aria-label={fab.label}
                                        color={fab.color}
                                    >
                                        {form_data.video_url != "" ? <EditIcon /> : <AddIcon />}
                                    </Fab>
                                </Zoom>
                            ))}
                        </div>
                    </Grid>
                    <Typography
                        color="error"
                        component="span"
                        style={{ marginTop: 20, marginLeft: 15 }}
                    >
                        {errorMsg != "" ? errorMsg : ""}
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
                    <Button onClick={isAddDiaBites ? handleSubmit : UpdateBasicInfo} color="primary">
                        Submit
                    </Button>
                )}
            </DialogActions>
        </Dialog >
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

    return (
        <Layout currentPage="diabites" AppBarTitle={"DiaBites"}>
            {addModal}
            {addNotificationModel}
            <AddVideoDiaBites
                {...addVideosModal}
                diabite_id={form_data.slug}
                admin_id={props.user_id}
                token={props.token}
                addCallback={async (addedVideo) => {
                    console.log(addedVideo.key);
                }}
            />

            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Table
                            ref={ref => setTableRef(ref)}
                            title="DiaBites"
                            rowKey="id"
                            columns={columns}
                            fetchURL={apis.FETCH_DIABITES}
                            deleteURL={apis.DELETE_DIABITES}
                            updateURL={''}
                            extraOptions={extraOptions}
                            // extraActions={EditDiaBitesBtn}
                            SendNotificationBtn={SendNotificationBtn}
                            SendNotificationBtnForTester={SendNotificationBtnForTester}
                            onRowClick={onRowClick}
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
                            }ms`
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
}
DiaBites.getInitialProps = async (ctx) => {
    var props = {};
    const { user_id, token } = nextCookie(ctx);
    try {
        const response_instructor_list = await AsyncData.getInstructorList(
            user_id,
            token
        );
        let instructor_list = [];
        response_instructor_list.data.map((ins) => {
            instructor_list.push({ ...ins, id: ins.instructor_id });
        });
        props.instructor_list = instructor_list;
    }
    catch (e) {

    }
    return props
}
export default withAuthSync(DiaBites);
