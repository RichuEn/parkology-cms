import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login } from "../utils/auth";
import AsyncData from "./../data/AsyncData";
import SvgLogo from "../components/icons/SvgLogo";
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneIcon from "@material-ui/icons/Done";
import SvgLogoBlue from "../components/icons/SvgLogoBlue";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://thediabeats.com/">
        TheDiabeats
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 3)
  }
}));

export default function SignIn() {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [isDone, setDone] = useState(false);
  const [hasError, setError] = useState(false);
  const [username, setUsername] = useState("");

  const tryToReset = async e => {
    e.preventDefault();

    if (username != "" && !isDone) {
      setLoading(true);
      setDone(false);
      setError(false);

      try {
        const response = await AsyncData.forgot(username);
        setDone(true);
      } catch (e) {
        setError(true);
      }
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className="p-5">
          <SvgLogoBlue />
        </div>
        <form className={classes.form} noValidate>
          <Typography variant="body2" color="textSecondary" align="center">
            Enter your email address to reset your password
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onBlur={e => setUsername(e.target.value)}
          />

          <Button
            onClick={tryToReset}
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            disabled={isLoading || isDone}
            className={classes.submit}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isDone ? (
              <DoneIcon />
            ) : (
              "Request Reset"
            )}
          </Button>

          {hasError ? (
            <Typography variant="body2" color="secondary" align="center">
              Please try again
            </Typography>
          ) : null}

          {isDone ? (
            <Typography variant="body2" color="textSecondary" align="center">
              An email should be sent to your address
            </Typography>
          ) : null}

          <Grid container justify="center">
            <Grid item className={classes.submit}>
              <Link href="/login" variant="body2">
                Go Back to Login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
