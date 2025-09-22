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

async function searchWithAI(query: string): Promise<string> {
  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.answer || "No answer from AI.";
  } catch (err) {
    console.error("searching error", err);
    return "Error connecting to AI.";
  }
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


const handleAIRequest = async (editor: any, promptText: string) => {
  const selectedText = editor.selection.getContent({ format: "text" });
  const  placeholderId="ai-loading-placeholder"; 
  if( selectedText){
    editor.selection.setContent(`<span id="${placeholderId}">updating...</span>`)
  } else{
    editor.insertContent(`<span id = "${placeholderId}"> loading response...</span>`);}
  const instruction = selectedText
    ? `Please rewrite the following subject line as instructed, and only return the updated text without questions:\n"${selectedText}"\nInstruction: ${promptText}`
    : promptText;

  const result = await searchWithAI(instruction);
  const placeholder = editor.getDoc().getElementById(placeholderId);
  if (placeholder) {
    placeholder.outerHTML = selectedText
      ? result.trim() 
      : `<div><br/>${result.trim()}
        </div>`;
  }
};
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
          contextmenu: "aiSearchSelected link image table",
          menubar: "file edit view insert format tools table help",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount contextmenu",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | aiSearch",
          menu: {
            file: {
              title: "File",
              items: "newdocument | chooseFile saveDoc exportDocx exportPdf | print",
            },
          },
          setup: (editor: any) => {
            editor.ui.registry.addMenuItem("chooseFile", {
              text: "Choose File",
              onAction: () => document.getElementById("fileInput")?.click(),
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

            // editor.ui.registry.addIcon(
            //   "aiSearchIcon",
            //   `<svg width="24" height="24" viewBox="0 0 24 24">
            //     <path d="M21.71 20.29l-3.388-3.388A8.962 8.962 0 0 0 19 11a9 9 0 1 0-9 9 8.962 8.962 0 0 0 5.902-2.678l3.388 3.388a1 1 0 0 0 1.414-1.414zM4 11a7 7 0 1 1 14 0 7 7 0 0 1-14 0z"/>
            //   </svg>`
            // );

            const openAIDialog = (prefill: string = "") => {
              editor.windowManager.open({
                title: "Ask AI",
                body: {
                  type: "panel",
                  items: [{ type: "input", name: "prompt", label: "Enter your query", value: prefill }],
                },
                buttons: [
                  { type: "cancel", text: "Close" },
                  { type: "submit", text: "Submit", primary: true },
                ],
                onSubmit: async (api: any) => {
                  const data = api.getData();
                  api.close();
                  await handleAIRequest(editor, data.prompt);
                },
              });
            };
            
             editor.ui.registry.addContextToolbar("aiSearchToolbar", {
              predicate: () => !!editor.selection.getContent({ format: "text" }),
              items: "aiSearch",
              position: "selection",
              scope: "node",
            });
            editor.ui.registry.addButton("aiSearch", {  
                    text: "✨Search with AI",
                    onAction: () => openAIDialog(""),
                    tooltip: "Search with AI",                 
  onPostRender: (btnApi: any) => btnApi.getEl().classList.add("my-ai-button"),
            });
  },
}}
         
        onEditorChange={(html) => setContent(html)}
      />
    </>
  );
}
