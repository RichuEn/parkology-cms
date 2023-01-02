import { withAuthSync } from "../../utils/auth";
import Layout from "../../components/Layout";
import nextCookie from 'next-cookies';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, FormControl, Grid, makeStyles, TextField, Typography, useTheme, Zoom } from "@material-ui/core";
import { forwardRef, useState } from "react";
import * as apis from "../../data/apiConfig";
import EditIcon from "@material-ui/icons/Edit";
import Table from "../../components/Table";
import Cookies from "js-cookie";
import AddIcon from "@material-ui/icons/Add";
import Router from 'next/router';
import AsyncData from "../../data/AsyncData";
import { Autocomplete } from "@material-ui/lab";

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
    resetIcon: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />)
};

const AskTheExpert = (props) => {
    const [isAddModule, setIsAddModule] = useState(true);
    const [tableRef, setTableRef] = useState();
    const [spinner, setSpinner] = useState(false);
    const [selectedKey, setSelectedKey] = useState(true);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [errorMsg, setErrorMsg] = useState();
    const [askTheExpertItem, setAskTheExpertItem] = useState(null);
    const [selectedInstructor_ids, setSelectedInstructor_ids] = useState(null);
    const theme = useTheme();

    const [form_data, setFormData] = useState({
        title: "",
        description: "",
        instructor: "",
        video_url: "",
    });


    const classes = useStyles();
    const columns = [
        {
            field: "id",
            title: "ID"
        },
        {
            field: "title",
            title: "Title"
        },
        {
            field: "instructor",
            title: "The Expert"
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
    const EditAskTheExpertBtn = {
        tooltip: "Edit Content",
        icon: tableIcons.resetIcon,
        onClick: async (evt, data) => {
            setIsAddModule(false);
            setOpen(true);
            setAskTheExpertItem(data);
            setFormData({
                title: data.title,
                description: data.description,
                instructor: data.instructor,
                video_url: data.video_url,
            })
        }
    }
    const onRowClick = (event, rowData) => {
        Router.push(`/experts/${rowData.id}`);
    };
    const handleClickOpen = () => {
        setIsAddModule(true);
        setFormData({
            title: "",
            instructor: "",
            description: "",
            video_url: "",
        });
        setOpen(true);
        setErrorMsg("");
    };
    const handleClose = () => {
        setFormData({
            title: "",
            instructor: "",
            description: "",
            video_url: "",
        });
        setOpen(false);
        setErrorMsg("");
    };

    const handleChange = (field, value) => {
        var new_obj = { ...form_data };
        new_obj[field] = value;
        setFormData(new_obj);
    };
    const handleSubmit = async () => {
        let user_id = Cookies.get("user_id"); // => get user_id
        let token = Cookies.get("token"); // => get token
        if (form_data.title != "" &&
            form_data.description != "" &&
            selectedInstructor_ids != "") {
            var bodyFormData = new FormData();
            bodyFormData.append("title", form_data.title);
            bodyFormData.append("instructor", selectedInstructor_ids.id);
            bodyFormData.append("description", form_data.description);
            setSpinner(true);
            try {
                let response = null;
                response = await AsyncData.createAskTheExpertModule(
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
                {isAddModule ? "Create New" : "Edit Content"}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <DialogContentText>
                            {isAddModule
                                ? "The following will create new content"
                                : "The following will edit a content"}
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
                            label="Description"
                            type="description"
                            multiline
                            maxRows={6}
                            fullWidth
                            value={form_data.description}
                            onChange={e => handleChange("description", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
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

    return (
        <Layout currentPage="askTheExpert" AppBarTitle={"Ask The Expert"}>
            {addModal()}
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Table
                            ref={ref => setTableRef(ref)}
                            title="Ask The Expert"
                            rowKey="id"
                            columns={columns}
                            fetchURL={apis.FETCH_ASKTHEEXPERT}
                            deleteURL={apis.DELETE_ASKTHEEXPERT}
                            updateURL={""}
                            extraOptions={extraOptions}
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
AskTheExpert.getInitialProps = async (ctx) => {
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
export default withAuthSync(AskTheExpert);
