import { useMarkdownStore } from "@/store/useStore";
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
  return (
    <Input
      onChange={(e) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
          if (fileError || !e.target.files[0]) setFileError(false);
        }
      }}
      onBlur={() => {
        if (!file) setFileError(true);
        else setFileError(false);
      }}
      isRequired
      size="md"
      variant="faded"
      isInvalid={fileError}
      errorMessage="Please choose an image"
      className="lg:w-60 cursor-pointer lg:mt-2 file:bg-blue-800"
      type="file"
      accept="image/*"
    />
  );
};

export default FileUpload;
