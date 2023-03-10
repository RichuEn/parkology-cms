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
import CircularProgress from "@material-ui/core/CircularProgress";
import AsyncData from "./../data/AsyncData";

import SvgLogoBlue from "../components/icons/SvgLogoBlue";

function Copyright() {
  return (
    <>
      {"Copyright © "}
     
      {new Date().getFullYear()}
      {"."}
      <div>{process.env.version}</div>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);

  const tryToLogin = async (e) => {
    setLoading(true);
    setError(false);
    const email = e.target[0].value;
    const password = e.target[2].value;
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append("email", email);
    bodyFormData.append("password", password);

    try {
      const response = await AsyncData.loginData(bodyFormData);
      let user_id = response.data.data.id;
      let token = response.data.data.token;

      document.cookie = `token=${response.data.data.token}; path=/`;
      document.cookie = `user_id=${response.data.data.id}; path=/`;
      login(token, user_id, "the username");
    
    } catch (e) {
      console.log("e",e.message)
      setError(true);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className="p-5">
          <SvgLogoBlue />
        </div>
        {hasError ? (
        <Typography variant="body2" color="error" align="center">
          Please try again
        </Typography>
      ) : null}
        <form className={classes.form} onSubmit={tryToLogin}>
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
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            className={classes.submit}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
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
