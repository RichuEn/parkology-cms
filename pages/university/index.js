import React, { useEffect, useState } from "react";
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
import Router from 'next/router';

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
        Router.push(`/university/${rowData.id}`);
    };

    return (
        <Layout currentPage="access_modules" AppBarTitle={"Access Modules"}>
            <Container maxWidth="lg" className={classes.container}>
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
    return props;
}
export default withAuthSync(University);
