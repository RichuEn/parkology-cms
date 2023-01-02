import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  mainSection: {
    width: "100%",
    borderWidth: 1,
    marginTop: "25%",
    marginLeft: "25%"
  }
});

const UploadDisplay = props => {
  const classes = useStyles();
  const renderFileUpload = (uploadedFile, i) => {
    const {
      filename, // s3 filename
      fileUrl, // full s3 url of the file
      file, // file descriptor from the upload,
      preview
    } = uploadedFile;

    return (
      <div key={i}>
        <CloudUploadIcon
          color="disabled"
          style={{
            fontSize: 65,
            color: "#c7c7c7",
            alignSelf: "center",
            marginLeft: "5%"
          }}
        />
        <p style={{ color: "#c7c7c7" }}>Drag and drop</p>
      </div>
    );
  };

  const { uploadedFiles, s3Url } = props;
  return (
    <div className={classes.mainSection}>
      {uploadedFiles.map(renderFileUpload)}
    </div>
  );
};

export default UploadDisplay;
