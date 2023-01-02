import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import NotificationsIcon from "@material-ui/icons/Notifications";

import BarChartIcon from "@material-ui/icons/BarChart";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import Link from "@material-ui/core/Link";
import SettingsIcon from "@material-ui/icons/Settings";
import SwitchVideoIcon from "@material-ui/icons/SwitchVideo";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import SPA from "@material-ui/icons/Spa";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
import ClassIcon from "@material-ui/icons/Class";

export const MenuItemsPrimary = current_page => (
  <div>
    <Link href="/">
      <ListItem button selected={current_page == "dashboard"}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    {/* <Link href="/experts">
      <ListItem button selected={current_page == "experts"}>
        <ListItemIcon>
          <AssignmentInd />
        </ListItemIcon>
        <ListItemText primary="Ask The Expert" />
      </ListItem>
    </Link>
    <Link href="/categories">
      <ListItem button selected={current_page == "categories"}>
        <ListItemIcon>
          <ClassIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItem>
    </Link>


    <Link href="/diabites">
      <ListItem button selected={current_page == "diabites"}>
        <ListItemIcon>
          <SPA />
        </ListItemIcon>
        <ListItemText primary="DiaBites" />
      </ListItem>
    </Link>
    <Link href="/diaclinic">
      <ListItem button selected={current_page == "diaclinic"}>
        <ListItemIcon>
          <SPA />
        </ListItemIcon>
        <ListItemText primary="DiaClinic" />
      </ListItem>
    </Link>
    <Link href="/universities">
      <ListItem button selected={current_page == "universities"}>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="E-Learning" />
      </ListItem>
    </Link>
    <Link href="/instructors">
      <ListItem button selected={current_page == "instructors"}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Instructors" />
      </ListItem>
    </Link>
    <Link href="/lessons">
      <ListItem button selected={current_page == "lessons"}>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="Lessons" />
      </ListItem>
    </Link>
    <Link href="/university">
      <ListItem button selected={current_page == "access_modules"}>
        <ListItemIcon>
          <AssignmentInd />
        </ListItemIcon>
        <ListItemText primary="Modeules Access" />
      </ListItem>
    </Link> */}
     
    <Link href="/users">
      <ListItem button selected={current_page == "users"}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
    </Link>
    <Link href="/quiz">
      <ListItem button selected={current_page == "quiz"}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Quiz" />
      </ListItem>
    </Link>

    {/* <Link href="/webinars">
      <ListItem button selected={current_page == "webinars"}>
        <ListItemIcon>
          <SwitchVideoIcon />
        </ListItemIcon>
        <ListItemText primary="Webinars" />
      </ListItem>
    </Link> */}
  
    {/* <Link href="/notification">
      <ListItem button selected={current_page == "notification"}>
        <ListItemIcon>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText primary="Push Notification" />
      </ListItem>
    </Link> */}
    {/* <ListItem button disabled>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem> */}
    {/* <Link href="/certificates">
      <ListItem button selected={current_page == "certificates"}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Certificates" />
      </ListItem>
    </Link> */}
  </div>
);

export const MenuItemsSecondary = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);

export const MenuItemsTelr = (
  <div>
    <ListSubheader inset>Telr payments</ListSubheader>
    <Link href="/manual-transactions">
      <ListItem button>
        <ListItemIcon>
          <AttachMoneyOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Manual transaction" />
      </ListItem>
    </Link>
  </div>
);

export const MenuItemsSettings = current_page => (
  <div>
    <ListItem button disabled>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
  </div>
);
