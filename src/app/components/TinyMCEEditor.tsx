"use client";

import { useRef, useEffect } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface TinyMCEProps {
  content: string;
  setContent: (html: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleExport: () => void;
  exportAsPdf: () => void;
}

export default function TinyMCEEditorWrapper({
  content,
  setContent,
  handleFileChange,
  handleSave,
  handleExport,
  exportAsPdf,
}: TinyMCEProps) {
  const saveRef = useRef(handleSave);
  const exportRef = useRef(handleExport);
  const pdfRef = useRef(exportAsPdf);

  useEffect(() => {
    saveRef.current = handleSave;
    exportRef.current = handleExport;
    pdfRef.current = exportAsPdf;
  }, [handleSave, handleExport, exportAsPdf]);

  return (
    <>
      <input
        type="file"
        accept=".docx"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <TinyMCEEditor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={content}
        init={{
          height: 500,
          menubar: "file edit view insert format tools table help",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat",
          setup: (editor: any) => {
            editor.ui.registry.addMenuItem("chooseFile", {
              text: "Choose File",
              onAction: () =>
                document.getElementById("fileInput")?.click(),
            });

            editor.ui.registry.addMenuItem("saveDoc", {
              text: "Save",
              onAction: () => saveRef.current?.(),
            });

            editor.ui.registry.addMenuItem("exportDocx", {
              text: "Export as DOCX",
              onAction: () => exportRef.current?.(),
            });

            editor.ui.registry.addMenuItem("exportPdf", {
              text: "Export as PDF",
              onAction: () => pdfRef.current?.(),
            });
          },
          menu: {
            file: {
              title: "File",
              items:
                "newdocument | chooseFile saveDoc exportDocx exportPdf | print",
            },
          },
        }}
        onEditorChange={(html) => setContent(html)}
      />
    </>
  );
}
