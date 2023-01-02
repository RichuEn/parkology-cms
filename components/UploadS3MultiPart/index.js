import React from "react";
import { withStyles } from "@material-ui/core/styles";
import DropzoneS3Uploader from "react-dropzone-s3-uploader";
import UploadDisplay from "./UploadDisplay";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const BorderLinearProgress = withStyles(theme => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main
  }
}))(LinearProgress);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired
};

const UploadS3 = props => {
  // specify upload params and url for your files

  const [progress, setProgress] = React.useState(0);
  const [fileName, setFileName] = React.useState("");

  const handleFinishedUpload = info => {
    props.finishedProgress(info);
    setFileName(info.file.name);
  };

  const uploadOptions = {
    server: process.env.api,
    // server: `http://192.168.1.205/sscc_slim/v1/`,
    signingUrl: `admin/${props.admin_id}/sign_url`,
    // signingUrlQueryParams: { uploadType: "avatar" },
    signingUrlHeaders: {
      Authorization: "token " + props.token
    },
    uploadRequestHeaders: {}
  };
  const onProgress = progress => {
    setProgress(progress);
  };

  return (
    <div>
      <DropzoneS3Uploader
        className="d-flex flex-column justify-content-center align-items-center"
        onFinish={handleFinishedUpload}
        upload={uploadOptions}
        s3Url={"https://tmp-thediabeats-com.s3.eu-west-1.amazonaws.com"}
        filename={"ur/tmp.jpg"}
        onProgress={onProgress}
        accept={props.accept ?? "*"}
      >
        <UploadDisplay />
      </DropzoneS3Uploader>
      <p>{fileName}</p>
      {progress > 0 ? <LinearProgressWithLabel value={progress} /> : null}
    </div>
  );
};

export default UploadS3;
