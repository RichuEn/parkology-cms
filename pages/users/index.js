import React, { forwardRef, useState } from "react";

import Table from "../../components/Table";
import { withAuthSync } from "../../utils/auth";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import * as apis from "../../data/apiConfig";
import EditInfo from "../../components/editInfoModal";
import Router from "next/router";
import EditIcon from "@material-ui/icons/Edit";
const tableIcons = {
  resetIcon: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />)
};
const columns = [
  {
    field: "id",
    title: "ID",
    hidden: true
  },
  {
    field: "first_name",
    title: "First Name"
  },
  {
    field: "last_name",
    title: "Last Name"
  },
  {
    field: "email",
    title: "Email"
  },
  {
    field: "username",
    title: "Username"
  },
  {
    field: "country",
    title: "Country",
    hidden: true
  },
  {
    field: "city",
    title: "City",
    hidden: true
  },
  {
    field: "specialty",
    title: "Specialty",
    hidden: true
  },
  {
    field: "profession",
    title: "Profession",
    hidden: true
  },
  {
    field: "organization",
    title: "Organization",
    hidden: true
  },
  {
    field: "inserted_at",
    title: "Joined on"
  }
];
const extraOptions = {
  actionsColumnIndex: 10,
  search: true
};

const Users = () => {
  const [tableRef, setTableRef] = useState();
  const [openResetModal, setOpenResetModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const copyToClipBoardBtn = {
    tooltip: "Edit Info",
    icon: tableIcons.resetIcon,
    onClick: async (evt, data) => {
      setSelectedRow(data);
      setOpenResetModal(true);
    }
  };
  return (
    <Layout currentPage="users" AppBarTitle={"Users"}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EditInfo
              openResetModal={openResetModal}
              handleClose={() => setOpenResetModal(false)}
              selectedId={selectedRow.id}
              email={selectedRow.email}
              refreshCallback={() => {
                tableRef.refreshData();
              }}
            />
            <Table
              ref={ref => setTableRef(ref)}
              title="Users"
              columns={columns}
              fetchURL={apis.FETCH_USERS}
              deleteURL={apis.DELETE_USERS}
              updateURL={""}
              extraOptions={extraOptions}
              extraActions={copyToClipBoardBtn}
              disableClick={false}
              //Remove row click -AA

              // onRowClick={(event, rowData, togglePanel) =>
              //   Router.push("/users/" + rowData.id)
              // }
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default withAuthSync(Users);
