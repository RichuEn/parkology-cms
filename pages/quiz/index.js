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
    field: "title",
    title: "Title"
  },
  {
    field: "level",
    title: "Level"
  },
  {
    field: "bonus",
    title: "Bonus"
  },
  {
    field: "start_time",
    title: "Start Time"
  },
  {
    field: "end_time",
    title: "End Time",
  }

];
const extraOptions = {
  actionsColumnIndex: 10,
  search: true
};

const Quizzes = () => {
  const [tableRef, setTableRef] = useState();
  const [openResetModal, setOpenResetModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const copyToClipBoardBtn = {
    tooltip: "Edit Info",
    icon: tableIcons.resetIcon,
    onClick: async (evt, data) => {
      setSelectedRow(data);
      setOpenResetModal(true);
    },
  };
  return (
    <Layout currentPage="quiz" AppBarTitle={"Quiz"}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EditInfo
              openResetModal={openResetModal}
              handleClose={() => setOpenResetModal(false)}
              selectedId={selectedRow.id}
              title={selectedRow.title}
              refreshCallback={() => {
                tableRef.refreshData();
              }}
            />
            <Table
              ref={ref => setTableRef(ref)}
              title="Quiz"
              columns={columns}
              fetchURL={apis.FETCH_QUIZZES}
              deleteURL={apis.DELETE_QUIZZES}
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
export default withAuthSync(Quizzes);
