import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { resetServerContext } from "react-beautiful-dnd";
import Cookies from "js-cookie";
import { createTheme } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles'
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Refresh from "@material-ui/icons/Refresh";
import Notify from "@material-ui/icons/Notifications";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import CircularProgress from "@material-ui/core/CircularProgress";
const token = Cookies.get("token"); // => get token

const config = {
  headers: { Authorization: "Bearer " + token }
};

// mapping the icons to the data set
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  Refresh: forwardRef((props, ref) => <Refresh {...props} ref={ref} />),
  Notify: forwardRef((props, ref) => <Notify {...props} ref={ref} />)

};

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();

    this.state = {
      isLoading: true,
      selectedId: null,
      showDeleteAlert: false,
      isDeleting: false,
      snackbarOpen: false
    };
  }

  // actions for the data set
  actions = () => {
    let action_btns = this.props.deleteURL == "" ? [
      {
        icon: tableIcons.Refresh,
        tooltip: "Refresh Data",
        isFreeAction: true,
        onClick: () => {
          this.setState({
            isLoading: true
          });
          this.refreshData();
        }
      },
    ] : [
      {
        tooltip: "Remove selected rows",
        icon: tableIcons.Delete,
        onClick: async (evt, data) => {
          // data is the selected data
          this.setState({
            selectedId: this.props.rowKey ? data[this.props.rowKey] : data.id,
            showDeleteAlert: true
          });
        }
      },
      {
        icon: tableIcons.Refresh,
        tooltip: "Refresh Data",
        isFreeAction: true,
        onClick: () => {
          this.setState({
            isLoading: true
          });
          this.refreshData();
        }
      },
    ];

    // add extra buttons
    if (this.props.extraActions) {
      if (this.props.extraActions.isArray)
        action_btns = [...action_btns, this.props.extraActions];
      action_btns = [...action_btns, { ...this.props.extraActions }];
    }
    // 

    // add extra buttons
    if (this.props.SendNotificationBtn) {
      action_btns = [...action_btns, { ...this.props.SendNotificationBtn }];
    }
    // add extra buttons
    if (this.props.SendNotificationBtnForTester) {
      action_btns = [...action_btns, { ...this.props.SendNotificationBtnForTester }];
    }
    if(this.props.activeUrl){
      action_btns = [...action_btns, { ...this.props.activeUrl }];
    }
    if(this.props.disableUrl){
      action_btns = [...action_btns, { ...this.props.disableUrl }];
    }
    return action_btns;
  };

  // add options
  options = () => {
    let obj = {
      selection: false,
      filtering: false,
      grouping: true,
      exportButton: false,
      search: true,
      debounceInterval: 300,
      columnsButton: true,
      pageSize: 10,
      actionsColumnIndex: 5
      // padding: "dense",
    };
    // add extra buttons
    if (this.props.extraOptions) obj = { ...obj, ...this.props.extraOptions };

    return obj;
  };

  refreshData = () => {
    // refreshing the data action
    this.tableRef.current && this.tableRef.current.onQueryChange();
  };

  // querying the data
  remoteData = query => {
    return new Promise((resolve, reject) => {
      this.setState({
        isLoading: false
      });
      axios
        .get(
          `${this.props.fetchURL}?page=${query.page + 1}&limit=${query.pageSize
          }&search=${query.search}`,
          config
        )
        .then(response => {
          resolve({
            data: response.data.data,
            page: response.data.page - 1,
            totalCount: parseInt(response.data.total)
          });
        });
    });
  };

  hideDeleteAlert = () => {
    this.setState({ showDeleteAlert: false });
  };

  // requests
  callRemoteDelete = async () => {
    // gether the Ids and delete them
    this.setState({ isDeleting: true });
    try {
      const response = await axios.delete(
        `${this.props.deleteURL}/${this.state.selectedId}`,
        config
      );
      this.refreshData();
      this.hideDeleteAlert();
      this.setState({ isDeleting: false, snackbarOpen: false });
    } catch {
      this.setState({ isDeleting: false, snackbarOpen: true });
    }
  };

  addDeleteConfirmation = () => (
    <Dialog
      open={this.state.showDeleteAlert}
      // onClose={this.hideDeleteAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Deleting a record?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this record?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={this.state.isDeleting}
          onClick={this.hideDeleteAlert}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          disabled={this.state.isDeleting}
          onClick={this.callRemoteDelete}
          color="primary"
          autoFocus
        >
          {this.state.isDeleting ? <CircularProgress size={20} /> : `Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
  /*
   
  **/
  render() {
    resetServerContext();

    return (
      <div style={{ marginBottom: "50px" }}>
        {this.addDeleteConfirmation()}
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={4000}
          onClose={() => {
            this.setState({ snackbarOpen: false });
          }}
        >
          <Alert
            onClose={() => {
              this.setState({ snackbarOpen: false });
            }}
            severity="error"
          >
            An error occured!
          </Alert>
        </Snackbar>
        <MaterialTable
          isLoading={this.state.isLoading}
          tableRef={this.tableRef}
          title={this.props.title}
          data={this.remoteData}
          columns={this.props.columns}
          options={this.options()}
          icons={tableIcons}
          actions={this.actions()}
          components={this.props.components}
          {...this.props}
        />
      </div>
    );
  }
}
