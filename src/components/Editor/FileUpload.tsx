import { Input } from "@nextui-org/input";
import React from "react";

const FileUpload = ({
  setFile,
  file,
  fileError,
  setFileError,
}: {
  setFile: (file: File | null) => void;
  file: File | null;
  fileError: boolean;
  setFileError: (fileError: boolean) => void;
}) => {
  const [fileSizeError, setFileSizeError] = React.useState(false);
  return (
    <Input
      onChange={(e) => {
        if (e.target.files) {
          const selectedFile = e.target.files?.[0];
          const fileSize = selectedFile?.size / 1024 / 1024;

          if (!selectedFile) {
            // If no file is selected, set the file error to true
            setFileError(true);
            setFileSizeError(false);
          } else if (fileSize > 2) {
            // If the file size is greater than 2MB, set the file size error to true
            setFileError(true);
            setFileSizeError(true);
          } else {
            // If there is a file and the file size is valid, set the file errors and the file size error to false
            setFileError(false);
            setFileSizeError(false);
          }
          setFile(selectedFile);
        }
      }}
      onBlur={() => {
        if (!file || fileSizeError) setFileError(true);
        else {
          setFileError(false);
          setFileSizeError(false);
        }
      }}
      isRequired
      size="md"
      variant="faded"
      isInvalid={fileError}
      errorMessage={
        fileSizeError
          ? "File size should not exceed 2MB"
          : "Please choose an image"
      } // Conditionally showing error message based on fileSizeError state
      className="lg:w-60 cursor-pointer lg:mt-2 file:bg-blue-800"
      type="file"
      accept="image/png, image/jpeg" // Accepting only PNG and JPEG files
    />
  );
};

export default FileUpload;
