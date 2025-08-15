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
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
              editor={ClassicEditor}
              config={{
                toolbar: {
                  items: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "blockQuote",
                    "insertTable",
                    "mediaEmbed",
                    "undo",
                    "redo"
                  ]
                },
                image: {
                  toolbar: [
                    "imageStyle:inline",
                    "imageStyle:block",
                    "imageStyle:side",
                    "|",
                    "toggleImageCaption",
                    "imageTextAlternative"
                  ]
                },
                table: {
                  contentToolbar: [
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells"
                  ]
                }
              }}
              data={articleBody}
              onChange={onChange}
            />
      </div>
    </div>
  );
}

export default RiabizEditor;
