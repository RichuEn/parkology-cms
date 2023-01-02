import React, { forwardRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import { withAuthSync } from "../../utils/auth";
import { Button, Card, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AsyncData from "../../data/AsyncData";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as apis from '../../data/apiConfig';
import nextCookie from 'next-cookies';
import Table from '../../components/Table';
import AcceptIcon from "@material-ui/icons/Check";
import DisableIcon from "@material-ui/icons/RemoveCircleOutline";

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
            field: "description",
            title: "Title"
        },
     
       
    ];
    const tableIcons = {
        activeIcon: forwardRef((props, ref) => <AcceptIcon {...props} ref={ref} />),
        disableIcon: forwardRef((props, ref) => <DisableIcon {...props} ref={ref} />)

    };

    const activeUrl = {
        tooltip: "Active Module",
        icon: tableIcons.activeIcon,

        onClick: async (evt, data) => {
        //    data.id
        }
    }
    const disableUrl = {
        tooltip: "Disable Module",
        icon: tableIcons.disableIcon,

        onClick: async (evt, data) => {
        //    data.id
        }
    }
    return (
        <Layout currentPage="universities" AppBarTitle={"Universities"}>
            <Container maxWidth="lg" className={classes.container}>
                <Card className={classes.card}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Table
                                ref={(ref) => setTableRef(ref)}
                                title="Modules"
                                columns={columns}
                                fetchURL={AsyncData.getModules(user_id, univresity_id)}
                                deleteURL={''}
                                activeUrl={activeUrl}
                                disableUrl={disableUrl}
                                rowKey="id"
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
