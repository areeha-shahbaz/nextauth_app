"use client";

import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEProps {
  content: string;
  setContent: (html: string) => void;
}

export default function TinyMCEEditor({ content, setContent }: TinyMCEProps) {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={content}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline strikethrough | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={(newContent) => setContent(newContent)}
    />
  );
}

