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

export function RiabizEditor({ articleBody, articlePk, register, setValue }) {
  // register the field manually
  useEffect(() => {
    register("body");
  }, []);
  const onChange = (event, editor) => {
    const data = editor.getData();
    setValue("body", data);
  };
  const editorContainerElementRef = React.createRef();
  const revisionViewerContainerElementRef = React.createRef();
  const revisionViewerEditorElementRef = React.createRef();
  const revisionViewerSidebarElementRef = React.createRef();
  const sidebarElementRef = React.createRef();

  return (
    <div className="min-h-screen mt-6">
      <div className="hidden">
        <input type="hidden" id="uploadcare-widget" />
      </div>
      <div className="">
        <div className="grid grid-cols-4">
          <div className="col-span-3" ref={editorContainerElementRef}>
            <CKEditor
              id="editor"
              editor={ClassicEditor}
              // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html#component-properties
              // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html
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

          <div
            className="h-full col-span-1 border bg-gray-50 "
            ref={sidebarElementRef}
            id="sidebar"
          ></div>
        </div>

        <div
          className="revision-viewer-container"
          ref={revisionViewerContainerElementRef}
        >
          <div className="grid grid-cols-4">
            <div className="col-span-3">
              <div
                id="revision-viewer-editor"
                ref={revisionViewerEditorElementRef}
              ></div>
            </div>
            <div className="h-full col-span-1 border bg-gray-50">
              <div
                id="revision-viewer-sidebar"
                ref={revisionViewerSidebarElementRef}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiabizEditor;
