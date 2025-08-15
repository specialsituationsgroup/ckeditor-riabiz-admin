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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Editor } from "riabiz-ckeditor/build/ckeditor";

export function RiabizEditor({ articleBody, register, setValue }) {
  // register the field manually
  useEffect(() => {
    register("body");
  }, []);
  const onChange = (event, editor) => {
    const data = editor.getData();
    setValue("body", data);
  };
  return (
    <div className="mt-6 min-h-screen">
      <div className="hidden">
        <input type="hidden" id="uploadcare-widget" />
      </div>
      <div className="">
            <CKEditor
              id="editor"
              editor={Editor}
              config={{
                link: {
                  addTargetToExternalLinks: true
                },
                alignment: {
                  options: [ 'left', 'right', 'center' ]
                },
                indentBlock: {
                  offset: 1,
                  unit: 'em'
                },
                toolbar: {
                  items: [
                    "undo",
                    "redo",
                    "|",
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "outdent",
                    "indent",
                    "alignment",
                    "|",
                    "uploadcareWidget",
                    "blockQuote",
                    "insertTable",
                    "horizontalLine",
                    "|",
                    "wproofreader",
                    "|",
                    "removeFormat",
                    "sourceEditing",
                    "|",
                    "saveBtn",
                    "previewBtn"
                  ],
                  shouldNotGroupWhenFull: true,
                },
                table: {
                  contentToolbar: [
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
                    "tableProperties",
                    "tableCellProperties",
                    "toggleTableCaption",
                  ],
                  tableProperties: {
                    defaultProperties: {
                      borderStyle: "solid",
                      borderColor: "hsl(0, 0%, 70%)",
                      borderWidth: "1px",
                      alignment: "right",
                      width: "350px",
                      height: "450px",
                    },
                  },
                  tableCellProperties: {
                    defaultProperties: {
                      horizontalAlignment: "center",
                      verticalAlignment: "top",
                      padding: "3px",
                    },
                  },
                },
                image: {
                  toolbar: [
                    "imageStyle:alignLeft",
                    "imageStyle:block",
                    "imageStyle:alignRight",
                    "|",
                    "toggleImageCaption",
                    "imageTextAlternative",
                    "resizeImage",
                  ],
                  resizeUnit: "%",
                  resizeOptions: [
                    {
                      name: "resizeImage:original",
                      label: "Original",
                      value: null,
                    },
                    {
                      name: "resizeImage:25",
                      label: "Headshot",
                      value: "25",
                    },
                    {
                      name: "resizeImage:66",
                      label: "2/3 Width",
                      value: "66",
                    },
                    {
                      name: "resizeImage:100",
                      label: "Full Width",
                      value: "100",
                    },
                  ],
                },
                uploadcareWidget: {
                  config: {
                    apiKey: process.env.NEXT_PUBLIC_UPLOADCARE,
                  },
                },
                wproofreader: {
                  serviceId: process.env.NEXT_PUBLIC_WP_SERVICEID,
                  disableDictionariesPreferences: true,
                  userDictionaryName: 'riabiz-dictionary',
                  srcUrl:
                    "https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js",
                },
              }}
              data={articleBody}
              onChange={onChange}
            />
      </div>
    </div>
  );
}

export default RiabizEditor;
