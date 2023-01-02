import { createMuiTheme } from "@material-ui/core/styles";
import { createTheme } from '@material-ui/core/styles';
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#033572"
    },
    secondary: {
      main: "#009ad8"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#fafafa"
    }
  }
});

export default theme;
