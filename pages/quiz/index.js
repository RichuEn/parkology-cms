import React, { forwardRef, useState } from "react";

import Table from "../../components/Table";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withAuthSync } from "../../utils/auth";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import * as apis from "../../data/apiConfig";
import EditInfo from "../../components/editInfoModal";
import Router from "next/router";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));
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
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [spinner, setSpinner] = useState(false);

  const copyToClipBoardBtn = {
    tooltip: "Edit Info",
    icon: tableIcons.resetIcon,
    onClick: async (evt, data) => {
      setSelectedRow(data);
      setOpenResetModal(true);
    },
  };
  const fabs = [
    {
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
      label: 'Add',
    },
  ];
  const handleCategoryChange = (event, newValue) => {
    event.preventDefault();
    setCategory(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrorMsg('');
  };
  // handel closing dialog 
  const handleClose = () => {
    setOpen(false);
    setFormDat({
      title: '',
      passing_grade: '70',
      intro_text: '',
      cme_points: '',
      reference_number: '',
      date: '',
    });
    setCategory([]);
    setGenerate_certificate(false);
    setCertificate_id('');
    setErrorMsg('');
    setLessonImage('');
  };
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const addModal = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={'body'}
    >
      <DialogTitle id="form-dialog-title">Create Quiz</DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>
              The following will create a quiz
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Title English"
              type="title"
              fullWidth
              onBlur={(e) => handleChange('title', e.target.value)}
            />
            <TextField
              required
              autoFocus
              label="Title Arabic"
              type="title"
              fullWidth
              onBlur={(e) => handleChange('title', e.target.value)}
            />
      



            
            <Divider style={{ marginTop: 40 }} />


 
          </Grid>
          <Typography
            color="error"
            component="span"
            style={{ marginTop: 20, marginLeft: 15 }}
          >
            {errorMsg != '' ? errorMsg : ''}
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
          <Button color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
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
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${value === index ? transitionDuration.exit : 0
              }ms`,
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
};
export default withAuthSync(Quizzes);
