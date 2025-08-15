/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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
