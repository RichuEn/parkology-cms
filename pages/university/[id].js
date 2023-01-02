import React, { forwardRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "./../../components/Layout";
import { withAuthSync } from "./../../utils/auth";
import { Button, Card, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AsyncData from "./../../data/AsyncData";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as apis from '../../data/apiConfig';
import nextCookie from 'next-cookies';
import Table from './../../components/Table';
import AcceptIcon from "@material-ui/icons/Check";

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

const UniversityAccess = (props) => {
    const [spinner, setSpinner] = useState(false);
    const classes = useStyles();
    const [tableRef, setTableRef] = useState();
    const [user_id, setUser] = useState(0);
    const [univresity_id, setUniversityId] = useState(props.univresity_id ? props.univresity_id : 0);
    const [selectedKey, setSelectedKey] = useState(true);
    useEffect(() => {
        setUser(props.user_id);
    }, []);

    const columns = [
        {
            field: "id",
            title: "ID"
        },
        {
            field: "email",
            title: "Email"
        },
        {
            field: "first_name",
            title: "First Name"
        },
        {
            field: "last_name",
            title: "Last Name"
        },
    ];
    const tableIcons = {
        acceptIcon: forwardRef((props, ref) => <AcceptIcon {...props} ref={ref} />)
    };

    const AcceptBtn = {
        tooltip: "Accept Request",
        icon: tableIcons.acceptIcon,
        onClick: async (evt, data) => {
            let form_data = {
                users_id: data.user_id
            }
            let response = await new AsyncData().GrantAccessAccept(
                univresity_id,form_data
            );
            tableRef.refreshData();
        }
    };
    return (
        <Layout currentPage="access_modules" AppBarTitle={"Access Modules"}>
            <Container maxWidth="lg" className={classes.container}>
                <Card className={classes.card}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Table
                                ref={(ref) => setTableRef(ref)}
                                title="Access Request Modules"
                                columns={columns}
                                fetchURL={AsyncData.getModulesAccessRequest(user_id, univresity_id)}
                                // DELETE_University_Request
                                deleteURL={apis.DELETE_University_Request}
                                rowKey="id"
                                extraActions={AcceptBtn}

                            />
                        </Grid>
                    </Grid>
                </Card>
            </Container>



        </Layout>
    );

};
UniversityAccess.getInitialProps = async (ctx) => {
    var props = {};
    const univresity_id = ctx.query.id;
    const { user_id, token } = nextCookie(ctx);
    props.user_id = user_id;
    props.token = token;
    props.univresity_id = univresity_id;
    return props;
}
export default withAuthSync(UniversityAccess);
