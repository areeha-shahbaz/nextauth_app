"use client";

import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEProps {
  content: string;
  setContent: (html: string) => void;
}

export default function TinyMCEEditor({ content, setContent }: TinyMCEProps) {
  return (
    <Editor
      apiKey="svi5y888bj4f608asqdioobjk9gq4p3rp3k84cy34qxjbs7q"
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

