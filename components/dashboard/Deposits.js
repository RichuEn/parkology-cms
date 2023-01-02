import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Deposits() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>

      <Title>Top Caterers</Title>

      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Item One" {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Typography color="textSecondary" className={classes.depositContext}>
          <span>Poke & Co</span>
          <span>33</span>
        </Typography>

        <Typography color="textSecondary" className={classes.depositContext}>
          <span>Sukkar</span>
          <span>33</span>
        </Typography>

        <Typography color="textSecondary" className={classes.depositContext}>
          <span>Ayam</span>
          <span>33</span>
        </Typography>
      </TabPanel>

      <TabPanel value={value} index={1}>
      hi
      </TabPanel>

      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View All
        </Link>
      </div>
    </React.Fragment>
  );
}
