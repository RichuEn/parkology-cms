import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import cn from "classnames";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { Typography } from "@material-ui/core";

export default function Editor(props) {
  const [value, setValue] = useState(props.value ?? "");

  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    ["bold", "italic", "underline", "strike", "link"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ align: [] }],
    [{ direction: "rtl" }], // text direction

    [{ script: "sub" }, { script: "super" }], // superscript/subscript

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    props.removeImage ? [] : ["image"],
  ];

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (value) => {
    setValue(value);
    props.handleChange(props.name, value);
  };
  return (
    <Typography
      component="div"

    >
      <Typography
        component="span"
        style={{ color: props.error ? "#ff1744" : "gray", fontSize: "17px" }}
      >
        {props.title}{" "}
        {props.required ? <span className="required">*</span> : ""}
      </Typography>
      <ReactQuill
        id={props.name}
        value={value}
        className={cn(props.className ?? "", props.error ? "error" : "")}
        style={props.style ? props.style : undefined}
        modules={{ toolbar: props.readOnly ? [] : toolbarOptions }}
        onChange={handleChange}
        onBlur={() => props.handleChange(props.name, value)}
        readOnly={props.readOnly ? true : false}
      />
    </Typography>
  );
}
