import React, { useEffect } from "react";
import { Widget } from "@uploadcare/react-widget";

export function AdminUploadcareWidget({
  name,
  widgetRef,
  cdnUrl,
  register,
  setValue,
  setError,
}) {
  // register the field manually
  useEffect(() => {
    register(name);
  }, []);
  const onChange = (info) => {
    setValue("newImageUploaded", true);
    setValue(name, {
      uuid: info.uuid,
      cdn_url: info.cdnUrl,
    });
  };
  return (
    <div className="flex">
      <Widget
        ref={widgetRef}
        publicKey={process.env.NEXT_PUBLIC_UPLOADCARE}
        imagesOnly
        previewStep
        crop="1:1, free"
        tabs="file url gdrive"
        value={cdnUrl}
        onFileSelect={(file) => {
          if (file) {
            file.done((info) => onChange(info));
          }
        }}
      />
    </div>
  );
}
