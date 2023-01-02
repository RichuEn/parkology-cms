import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import Table from "../../components/Table";
import { withAuthSync } from "../../utils/auth";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import * as apis from "../../data/apiConfig";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },

  currency_root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const columns = [
  {
    field: "id",
    title: "ID",
  },
  {
    field: "name",
    title: "Name",
  },
  {
    field: "image_url",
    title: "Image",
    render: (props) => (
      <img src={props.image_url} width={200} alt={props.name} />
    ),
  },
  {
    field: "inserted_at",
    title: "Inserted on",
  },
  {
    field: "updated_at",
    title: "Updated on",
  },
];

const extraOptions = {
  actionsColumnIndex: 10,
  search: false,
};

const Certificates = () => {
  const [value, setValue] = useState(0);
  const [tableRef, setTableRef] = useState();
  const classes = useStyles();
  const theme = useTheme();

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add",
    },
  ];
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };


  const AddEdit = (e, id) => {
    e.preventDefault();
    Router.push("/certificates/" + (id ? id :"new"))
  };

  return (
    <Layout currentPage="certificates" AppBarTitle={"Certificates"}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table
              ref={(ref) => setTableRef(ref)}
              title="Certificates"
              rowKey="id"
              columns={columns}
              fetchURL={apis.CERTIFICATESLIST}
              deleteURL={apis.CERTIFICATESLIST}
              updateURL={""}
              extraOptions={extraOptions}
              disableClick={false}
              onRowClick={(event, rowData) =>AddEdit(event,rowData.id)}
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
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`,
          }}
          unmountOnExit
        >
          <Fab
            className={fab.className}
            onClick={AddEdit}
            aria-label={fab.label}
            color={fab.color}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </Layout>
  );
};
export default withAuthSync(Certificates);
