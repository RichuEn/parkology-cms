import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

class CropImage extends PureComponent {
  state = {
    src: null,
    spinner: false,
    openModal: false,
    crop: {
      unit: "%",
      width: 50,
      aspect: 16 / 9
    },
    croppedImageUrl: null
  };

  handleFileSelect = e => {
    e.preventDefault();

    this.photo.click();
  };
  handleModalClose = () => {
    this.setState({
      src: null,
      spinner: false,
      openModal: false,
      crop: {
        unit: "%",
        width: 50,
        aspect: 16 / 9
      }
    });
  };
  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result, openModal: true })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }

        blob.name = fileName;

        // window.URL.revokeObjectURL(this.fileUrl);
        // this.fileUrl = window.URL.createObjectURL(blob);
        resolve(blob);
      }, "image/jpeg");
    });
  }

  render() {
    const { crop, croppedImageUrl, src, openModal, spinner } = this.state;

    return (
      <div className="App">
        <Dialog
          open={openModal}
          onClose={this.handleModalClose}
          aria-labelledby="form-dialog-title"
          scroll={"body"}
        >
          <DialogTitle id="form-dialog-title">Crop Image</DialogTitle>
          <ReactCrop
            className="imageContainer"
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
          {/* {croppedImageUrl && (
            <img
              alt="Crop"
              style={{ maxWidth: "100%" }}
              src={croppedImageUrl}
            />
          )} */}

          <DialogActions>
            <Button onClick={this.handleModalClose} color="disabled">
              Cancel
            </Button>
            {/* {spinner ? (
              <CircularProgress color="primary" />
            ) : ( */}
            <Button
              onClick={() => {
                this.setState({ openModal: false });
                this.props.SubmitImage({ src: this.state.croppedImageUrl });
              }}
              color="primary"
            >
              Submit
            </Button>
            {/* )} */}
          </DialogActions>
        </Dialog>

        <div>
          {React.cloneElement(this.props.children, {
            onClick: this.handleFileSelect
          })}

          <input
            ref={ref => (this.photo = ref)}
            id="group_image"
            type="file"
            style={{ display: "none" }}
            className="filetype inputFilestyle"
            accept="image/*"
            onChange={this.onSelectFile}
          />
          <style global jsx>{`
            inputfilestyle: {
              display: none;
              outline: none;
            }

            .mainDialogContainer {
              outline: none;
            }
            .imageContainer {
              outline: none;
            }
          `}</style>
        </div>
      </div>
    );
  }
}

export default CropImage;
