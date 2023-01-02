import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

export default function FabBtn(props) {
  const [value] = useState(0);

  const classes = useStyles();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add"
    }
  ];

  return (
    <>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`
          }}
          unmountOnExit
        >
          <Fab
            className={fab.className}
            onClick={props.onClick}
            aria-label={fab.label}
            color={fab.color}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </>
  );
}
