"use client";

import { useState, useEffect } from "react";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import TinyMCEEditor from "./TinyMCEEditor";
import html2pdf from "html2pdf.js";
import styles from "./DocFile.module.css";
import Header from "./header";

export default function DocxEditor() {
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("edited");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setUserId(parsedUser._id || parsedUser.id);
  }, []);

  useEffect(() => {
    if (file) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExt);
    }
  }, [file]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);

    const arrayBuffer = await uploaded.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    const sanitizedHtml = html
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => `<p>${line}</p>`)
      .join("");
    setContent(sanitizedHtml);
  };
const buildTextRuns = (
  node: ChildNode,
  opts: { bold?: boolean; italics?: boolean } = {}
): TextRun[] => {
  if (node.nodeName === "#text") {
    return [
      new TextRun({
        text: node.textContent || "",
        bold: opts.bold,
        italics: opts.italics,
      }),
    ];
  }

  if (node.nodeName === "STRONG") {
    return Array.from(node.childNodes).flatMap((child) =>
      buildTextRuns(child, { ...opts, bold: true })
    );
  }

  if (node.nodeName === "EM") {
    return Array.from(node.childNodes).flatMap((child) =>
      buildTextRuns(child, { ...opts, italics: true })
    );
  }

  return Array.from(node.childNodes).flatMap((child) =>
    buildTextRuns(child, opts)
  );
};

const rebuildDocx = async () => {
  const parser = new DOMParser();
  const docHtml = parser.parseFromString(content, "text/html");

  const paragraphs: Paragraph[] = Array.from(docHtml.body.childNodes).map(
    (node) => new Paragraph({ children: buildTextRuns(node) })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);

  return new File([blob], `${fileName || "document"}.docx`, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
};


  const handleSave = async () => {
    if (!file || !userId) return;
    const newFile = await rebuildDocx();
    const arrayBuffer = await newFile.arrayBuffer();

    const res = await fetch(`/api/docx?userId=${userId}`, {
      method: "POST",
      body: arrayBuffer,
    });

    if (res.ok) {
      alert("Word file saved successfully");
    } else {
      console.log("Issue with connecting to MongoDB");
      alert("Failed to save");
    }
  };

  const handleExport = async () => {
    const newFile = await rebuildDocx();
    saveAs(newFile, `${fileName}.docx`);
  };
const exportAsPdf = () => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<div style="font-family: Arial; font-size: 14px;">${content}</div>`;

  const opt: any = {
    margin: 0.5,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(opt).from(wrapper).save();
};

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.sides}>
        <div className={styles.preview}>
        <h3
        contentEditable
           suppressContentEditableWarning={true}
           onBlur={(e)=> setFileName(e.currentTarget.textContent||"edited")}
           style={{cursor:"text"}}> 
           {file ?` ${file.name}`:" " }
      </h3>

          <TinyMCEEditor
            content={content}
            setContent={setContent}
            handleExport={handleExport}
            handleSave={handleSave}
            handleFileChange={handleFileChange}
            exportAsPdf={exportAsPdf}
          />
        </div>
      </div>
    </div>
  );
}



