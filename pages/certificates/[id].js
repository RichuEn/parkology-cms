import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "../../components/Layout";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import React, { useEffect, useState } from "react";
import AsyncData from "../../data/AsyncData";
import nextCookie from "next-cookies";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Certificate(props) {
  const Router = useRouter();
  const [positions, setPositions] = useState({
    fullNameTop: 125,
    fullNameLeft: 300,
    fullNameColor: '#fff',
    dateTop: 680,
    dateLeft: 400,
    fullNameFontSize: 60,
    dateFontSize: 30,
    dateColor: '#fff',
  });
  const [id] = useState(props.id ? props.id : "");
  const [image, setImage] = useState(props.image_url ? props.image_url : "");
  const [initialImage] = useState(props.image_url ? props.image_url : "");
  const [name, setName] = useState(props.name ? props.name : "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.html_conf) {
      let config=JSON.parse(props.html_conf.replaceAll("'", ""));
      setPositions(
        {
          ...config,
          fullNameColor: config.fullNameColor ? config.fullNameColor : '#29235c',
          dateColor: config.dateColor ? config.dateColor : '#29235c',
        }
      )
    }
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: theme.spacing(5),
    },
    card: {
      padding: theme.spacing(2),
    },
    buttonsContainer: {
      "& button": {
        marginRight: theme.spacing(2),
      },
      marginBottom: theme.spacing(5),
      marginLeft: theme.spacing(2),
      primary: {
        textTransform: "capitalize",
      },
      textAlign: "right",
    },
  }));
  const classes = useStyles();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPositions({ ...positions, [name]: value ? value : "" });
  };

  const saveData = async (e) => {
    e.preventDefault();
    console.log(positions)
    let HTML = document.getElementById("html")?.innerHTML;
    if (HTML) {
      HTML = HTML.replace("Full Name", "%s");
      HTML = HTML.replace("Date", "%s");

      let parser = new DOMParser();
      let doc = parser.parseFromString(HTML, "text/html");
      doc.body.getElementsByTagName("img")[0].setAttribute("src", "%s");

      HTML = doc.body.innerHTML;
    }

    console.log("HTML", HTML)
    let user_id = Cookies.get("user_id"); // => get user_id
    let token = Cookies.get("token"); // => get token
    var bodyFormData = new FormData();
    if (image && name) {
      setLoading(true);
      bodyFormData.append("name", name.trim());
      bodyFormData.append(
        "twig_file",
        HTML ? HTML : ""
      );
      bodyFormData.append("html_conf", "'" + JSON.stringify(positions) + "'");
      bodyFormData.append("image_url", image);

      try {
        const response = await AsyncData.saveCertificateData(
          user_id,
          bodyFormData,
          token,
          id
        );
        if (response) Router.push("/certificates");
        setLoading(false);
      } catch (e) {
        console.log("e", e.response);
      }
    }
  };

  const closeButton = (e) => {
    e.preventDefault();
    Router.push("/certificates");
  };
  return (
    <Layout currentPage="certificates" AppBarTitle={"Certificate"}>
      <Container maxWidth="lg" className={classes.container}>
        <Card className={classes.card}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <TextField
                required
                type={"text"}
                margin="dense"
                value={name}
                variant="outlined"
                id="name"
                label="Name"
                name="name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography component="span" style={{ paddingRight: 20 }}>
                Certificate Image <sup>*</sup>
              </Typography>
              <input type="file" id="myfile" name="image" onChange={e => setImage(e.target.files[0])} />
            </Grid>
            <Grid item xs={12} md={2}>
              <div className={classes.buttonsContainer}>
                <Button onClick={saveData} color="primary" variant="outlined">
                  {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
                <Button
                  onClick={closeButton}
                  color="primary"
                  variant="contained"
                >
                  Close
                </Button>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ display: (initialImage && initialImage.includes("https://")) ? "unset" : "none" }}>
            <Grid item xs={12} md={6}>
              <Typography>Full Name :</Typography>
              <form noValidate>
                <TextField
                  type={"number"}
                  margin="dense"
                  value={positions.fullNameTop}
                  variant="outlined"
                  id="fullNameTop"
                  label="away from top"
                  name="fullNameTop"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  type={"number"}
                  margin="dense"
                  value={positions.fullNameLeft}
                  variant="outlined"
                  id="fullNameLeft"
                  label="away from left"
                  name="fullNameLeft"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  type={"number"}
                  margin="dense"
                  value={positions.fullNameFontSize}
                  variant="outlined"
                  id="fullNameFontSize"
                  label="font Size"
                  name="fullNameFontSize"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  type={"color"}
                  margin="dense"
                  value={positions.fullNameColor}
                  variant="outlined"
                  id="fullNameColor"
                  label="Color"
                  name="fullNameColor"
                  autoFocus
                  onChange={handleChange}
                />
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Date :</Typography>
              <form noValidate>
                <TextField
                  type={"number"}
                  margin="dense"
                  value={positions.dateTop}
                  variant="outlined"
                  id="dateTop"
                  label="away from top"
                  name="dateTop"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  type={"number"}
                  margin="dense"
                  value={positions.dateLeft}
                  variant="outlined"
                  id="dateLeft"
                  label="away from left"
                  name="dateLeft"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  type={"number"}
                  margin="dense"
                  value={positions.dateFontSize}
                  variant="outlined"
                  id="dateFontSize"
                  label="font Size"
                  name="dateFontSize"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  type={"color"}
                  margin="dense"
                  value={positions.dateColor}
                  variant="outlined"
                  id="dateColor"
                  label="Color"
                  name="dateColor"
                  autoFocus
                  onChange={handleChange}
                />
              </form>
            </Grid>
            <Grid item xs={12}>
              <div id="html">
                <page style={{ padding: "0", margin: "0" }}>
                  <style>
                    {`
                    .container{
                      width: fit-content;
                      position: relative;
                    }

                    .fullName{
                      color:${positions.fullNameColor ? positions.fullNameColor : "#29235c"};
                      position: absolute;
                      min-width: 400px;
                      text-align: center;
                      top: ${positions.fullNameTop ? positions.fullNameTop : 0
                      }px;
                      left: ${positions.fullNameLeft ? positions.fullNameLeft : 0
                      }px;
                      font-size: ${positions.fullNameFontSize
                        ? positions.fullNameFontSize
                        : 0
                      }px;
                    }

                    .date{
                      color:${positions.dateColor ? positions.dateColor : "#29235c"};
                      position: absolute;
                      padding: 10px 10px 2px;
                      min-width: 200px;
                      text-align: center;
                      top: ${positions.dateTop ? positions.dateTop : 0}px;
                      left: ${positions.dateLeft ? positions.dateLeft : 0}px;
                      font-size: ${positions.dateFontSize ? positions.dateFontSize : 0
                      }px;
                    }
                    `}
                  </style>
                  <div className="container">
                    <img src={initialImage} width={1050}></img>
                    <div className="fullName">Full Name</div>
                    <div className="date">Date</div>
                  </div>
                </page>
              </div>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Layout>
  );
}
Certificate.getInitialProps = async (ctx) => {
  if (!ctx.query.id) return {};

  const { user_id, token } = nextCookie(ctx);
  let props = {};
  props.user_id = user_id;
  props.token = token;

  try {
    const response = await AsyncData.fetchCertificate(
      user_id,
      token,
      ctx.query.id
    );

    let data = response.data;
    console.log("data", data)
    props = { ...props, ...data };
  } catch (error) {
    console.log("error in getInitialProps in getCategoriesData is : ", error);
  }

  return props;
};
