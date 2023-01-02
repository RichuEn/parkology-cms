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
    resetIcon: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />),
    notifyIcon: forwardRef((props, ref) => <NotifyIcon {...props} ref={ref} />),
    notifyIconForTester: forwardRef((props, ref) => <NotifyIconForTester {...props} ref={ref} color="secondary" />),
};

const DiaClinic = (props) => {
    const [isAddDiaClinic, setIsAddDiaClinic] = useState(true);
    const [tableRef, setTableRef] = useState();
    const [spinner, setSpinner] = useState(false);
    const [selectedKey, setSelectedKey] = useState(true);
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [image, setImage] = useState();
    const [value, setValue] = useState(0);
    const [diaClinicItem, setDiaClinicItem] = useState(null);
    const [selectedInstructor_ids, setSelectedInstructor_ids] = useState(null);
    const theme = useTheme();
    const [openNotification, setOpenNotification] = useState(false);
    const [targetNotification, setTargetNotification] = useState(null);
    const [notificationFormData, setNotificationFormData] = useState({
        id: "",
        type: "",
        message: "",
        slug: "",

    })
    const [form_data, setFormData] = useState({
        title: "",
        image_url: "",
        speaker: "",
        video_url: "",
    });


    const classes = useStyles();
    const columns = [
        {
            field: "id",
            title: "DiaClinic ID"
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
            field: "author",
            title: "Auther"
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
    const EditDiaClinicBtn = {
        tooltip: "Edit DiaClinic",
        icon: tableIcons.resetIcon,
        onClick: async (evt, data) => {
            setIsAddDiaClinic(false);
            setOpen(true);
            setDiaClinicItem(data);
            setFormData({
                title: data.title,
                description: data.description,
                image_url: data.thumbnail,
                speaker: data.speaker,
                video_url: data.video_url,
            })
        }
    }
    const onRowClick = (event, rowData) => {
        Router.push(`/diaclinic/${rowData.slug}`);
    };
    const SendNotificationBtn = {
        tooltip: "Send Notification to All",
        icon: tableIcons.notifyIcon,

        onClick: async (evt, data) => {
            setOpenNotification(true);
            setNotificationFormData({
                id: data.id,
                slug: data.slug,
                type: 'DiaClinic',
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
                type: 'DiaClinic',
                message: "",
            })
            setTargetNotification(1);

        }
    }
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
    const handleClickOpen = () => {
        setIsAddDiaClinic(true);
        setFormData({
            title: "",
            author: "",
            image: "",
        });
        setImage("");
        setOpen(true);
        setErrorMsg("");
    };
    const handleClose = () => {
        setFormData({
            title: "",
            author: "",
            image: "",
        });
        setImage("");
        setOpen(false);
        setErrorMsg("");
    };
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
    const handleSubmit = async () => {
        let user_id = Cookies.get("user_id"); // => get user_id
        let token = Cookies.get("token"); // => get token
        console.log(form_data)
        if (form_data.title != "" &&
            form_data.description != "" &&
            selectedInstructor_ids != "" &&
            image) {
            var bodyFormData = new FormData();
            bodyFormData.append("title", form_data.title);
            bodyFormData.append("author", form_data.author);
            bodyFormData.append("thumbnail", image);
            setSpinner(true);
            try {
                let response = null;
                response = await AsyncData.createDiaClinicData(
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
                console.error(e.response);     // NOTE - use "error.response.data` (not "error")

            }
        } else {
            setErrorMsg("Please fill all the required fields");
        }
    };

    const addModal = () => (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            scroll={"body"}
        >
            <DialogTitle id="form-dialog-title">
                {isAddDiaClinic ? "Create DiaClinic" : "Edit DiaClinic"}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <DialogContentText>
                            {isAddDiaClinic
                                ? "The following will create DiaClinic"
                                : "The following will edit a diaClinic"}
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
                    </Grid>
                    <Grid item xs={12}>

                        <TextField
                            required
                            autoFocus
                            label="Author"
                            type="author"
                            fullWidth
                            value={form_data.author}
                            onChange={e => handleChange("author", e.target.value)}
                        />

                    </Grid>
                    <Grid
                        container
                        justify={'space-between'}
                        item
                        xs={12}
                        style={{ marginTop: 20, marginBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}
                    >
                        <div
                            xs={12}
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography component="span" style={{ paddingRight: 20 }}>
                                DiaClinic Banner
                            </Typography>
                            <Typography
                                color="secondary"
                                component="span"
                                style={{ paddingRight: 20 }}
                            >
                                {image ? image.name : 'none selected'}
                            </Typography>
                        </div>
                        <FormControl>
                            <UploadS3
                                accept="image/*"
                                admin_id={props.user_id}
                                token={props.token}
                                finishedProgress={(e) => {
                                    setImage(e.key);
                                }}
                            />
                        </FormControl>
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
                    <Button onClick={handleSubmit} color="primary">
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
        <Layout currentPage="diaclinic" AppBarTitle={"DiaClinic"}>
            {addModal()}
            {addNotificationModel}
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Table
                            ref={ref => setTableRef(ref)}
                            title="DiaClinic"
                            rowKey="id"
                            columns={columns}
                            fetchURL={apis.FETCH_DiaClinic}
                            deleteURL={apis.DELETE_DiaClinic}
                            updateURL={""}
                            extraOptions={extraOptions}
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
DiaClinic.getInitialProps = async (ctx) => {
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
export default withAuthSync(DiaClinic);
