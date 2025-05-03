import React from "react";
import Image from "next/image";

// INTERNAL IMPORT
import { Delete, UploadIcon, File } from "../SVG/index";
import Style from "./Upload.module.css";

const Upload = ({ onImageChange, display, retrieveFile }) => {
  return (
    <div className={Style.container}>
      <div className={Style.header}>
        {display == null ? (
          <>
            <UploadIcon />
            <p>Browse File to upload!</p>
          </>
        ) : (
          <Image
            className={Style.image}
            src={display}
            alt="image"
            width={200}
            height={200}
          />
        )}
      </div>
      
      <label htmlFor="file" className={Style.footer}>
        <File />
        <p>Not selected file</p>
        <Delete />
      </label>
      
      <input
        id="file"
        onChange={(e) => {
          onImageChange(e);
          retrieveFile(e);
        }}
        className={Style.file}
        type="file"
      />
    </div>
  );
};

export default Upload;
