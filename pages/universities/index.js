import React, { forwardRef, useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import { withAuthSync } from "../../utils/auth";
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AsyncData from "../../data/AsyncData";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as apis from '../../data/apiConfig';
import nextCookie from 'next-cookies';
import Table from '../../components/Table';
import Router from 'next/router';
import NotifyIcon from "@material-ui/icons/Notifications";
import NotifyIconForTester from "@material-ui/icons/NotificationsActiveOutlined";

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

const University = (props) => {
    const [spinner, setSpinner] = useState(false);
    const classes = useStyles();
    const [tableRef, setTableRef] = useState();
    const [user_id, setUser] = useState(0);
    const [openNotification, setOpenNotification] = useState(false);
    const [targetNotification, setTargetNotification] = useState(null);

    const [notificationFormData, setNotificationFormData] = useState({
        id: "",
        type: "",
        message: "",
        slug: "",
    })
    const tableIcons = {
        notifyIcon: forwardRef((props, ref) => <NotifyIcon {...props} ref={ref} />),
        notifyIconForTester: forwardRef((props, ref) => <NotifyIconForTester {...props} ref={ref} color="secondary" />),

    };
    useEffect(() => {
        setUser(props.user_id);
    }, []);

    const columns = [
        {
            field: "id",
            title: "ID"
        },
        {
            field: "name",
            title: "University Name"
        },
        {
            field: "title",
            title: "University details"
        },

    ];
    const onRowClick = (event, rowData) => {
        // Router.push(`/universities/${rowData.id}`);
    };
    const SendNotificationBtn = {
        tooltip: "Send Notification to All",
        icon: tableIcons.notifyIcon,

        onClick: async (evt, data) => {
            setOpenNotification(true);
            setNotificationFormData({
                id: data.id,
                slug: data.slug,
                type: 'ELearning',
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
                type: 'ELearning',
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
        <Layout currentPage="universities" AppBarTitle={"Universities"}>
            <Container maxWidth="lg" className={classes.container}>
                {addNotificationModel}
                <Card className={classes.card}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Table
                                ref={(ref) => setTableRef(ref)}
                                title="Univerity List"
                                columns={columns}
                                fetchURL={AsyncData.getUniversity(user_id)}
                                deleteURL={''}
                                rowKey="id"
                                SendNotificationBtn={SendNotificationBtn}
                                SendNotificationBtnForTester={SendNotificationBtnForTester}
                                onRowClick={onRowClick}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Container>



        </Layout>
    );

};
University.getInitialProps = async (ctx) => {
    var props = {};
    const { user_id, token } = await nextCookie(ctx);
    props.user_id = user_id;
    props.token = token;
    console.log(token)
    return props;
}
export default withAuthSync(University);
