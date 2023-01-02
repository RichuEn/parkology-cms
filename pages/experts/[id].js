import { AccordionActions, Button, CircularProgress, Collapse, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, Grid, IconButton, makeStyles, TextareaAutosize, TextField, Typography, useTheme, Zoom } from "@material-ui/core";
import { useState } from "react";
import nextCookie from 'next-cookies';
import Layout from "../../components/Layout";
import { withAuthSync } from "../../utils/auth";
import EditIcon from '@material-ui/icons/Edit';
import Cookies from "js-cookie";
import { Alert, Autocomplete } from "@material-ui/lab";
import CloseIcon from '@material-ui/icons/Close';
import Panel from "../../components/Panel";
import * as apis from '../../data/apiConfig';

import UploadS3 from '../../components/UploadS3MultiPart';

import AsyncData from "../../data/AsyncData";
import CustomVideoCardWithUpdate from "../../components/CustomVideoCardWithUpdate";
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

const AskTheExpertDetails = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [basicInfo_spinner, setBasicInfo_spinner] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedInstructor_ids, setSelectedInstructor_ids] = useState(
        props.selectedInstructor ? props.selectedInstructor : null

    );
    const [form_data, setFormDat] = useState({
        id: props.expertModuleId,
        title: props.title,
        description: props.description,
        instructor: props.instructor,
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
    const handleSelectChange = (event, newValue) => {
        event.preventDefault();
        setSelectedInstructor_ids(newValue);
    };
    const submitBasicInfo = async (e) => {
        e.preventDefault();
        let user_id = Cookies.get('user_id'); // => get user_id
        let token = Cookies.get('token'); // => get token
        var bodyFormData = new FormData();
        bodyFormData.append('title', form_data.title);
        bodyFormData.append('description', form_data.description);
        bodyFormData.append("instructor", selectedInstructor_ids.id);
        if (
            form_data.title != '' &&
            form_data.description != '' &&
            form_data.instructor != ''
        ) {
            setBasicInfo_spinner(true);
            try {
    
                const response = await AsyncData.EditAskTheExpertBasicData(
                    user_id,
                    props.slug,
                    bodyFormData,
                    token
                );
                setSuccess(true);
                setError(false);
                setBasicInfo_spinner(false);
                Router.push(`/experts`);

            } catch (e) {
                console.log('error in submitBasicInfo() is ', e.response);
                setBasicInfo_spinner(false);
                setError(true);
            }
        }
    }

    return (
        <Layout currentPage="askTheExpert" AppBarTitle={'Ask The Expert Details'}>
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
                            {props.title}
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12}>


                    <Panel
                        defaultExpanded={true}
                        pannelHeaderTitle={'Basic Information'}
                        footer={
                            <AccordionActions>
                                {/* <Button size="small">Cancel</Button> */}
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
                                    autoFocus
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        defaultValue={form_data.description}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        multiline
                                        maxRows={6}
                                        id="description"
                                        label="Description"
                                        name="description"
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                </FormControl>
                                <Autocomplete
                                    fullWidth
                                    id="demo-simple-select"
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
                            </form>
                            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                        </div>
                    </Panel>
                </Grid>

            </Container>



        </Layout >
    )
}
AskTheExpertDetails.getInitialProps = async (ctx) => {
    var props = {};
    const { user_id, token } = nextCookie(ctx);
    const expert_key = ctx.query.id;
    try {
        const response = await AsyncData.getTheExpertDetails(
            user_id,
            expert_key,
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
        props.expert_key = expert_key;
        let data = response.data;
        props.expertModuleId = data.id;
        props.title = data.title;
        props.description = data.description;
        props.instructor = data.instructor;
        props.slug = data.slug;
        props.status = true;
        props.instructor_list = instructor_list;
        props.selectedInstructor = {
            id: data.user_id,
            name: data.instructor
        };
    }
    catch (e) {
        console.log(e);
    }
    return props
}

export default withAuthSync(AskTheExpertDetails);
