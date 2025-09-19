"use client";

import { useState, useEffect } from "react";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun} from "docx";
import { saveAs } from "file-saver";
import TinyMCEEditor from "./TinyMCEEditor";
import styles from "./PdfFile.module.css";
import Header from "./header";

export default function DocxEditor() {
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setUserId(parsedUser._id || parsedUser.id);
  }, []); 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);

    const arrayBuffer = await uploaded.arrayBuffer();
    const { value: html} = await mammoth.convertToHtml({ arrayBuffer });
    const sanitizedHtml = html
    .split(/\r?\n/)
    .map(line=>line.trim())
    .filter(line=>line)
    .map(line=>`<p>${line}</p>`)
    .join("");
    setContent(sanitizedHtml);
  };

const rebuildDocx = async () => {
  const parser = new DOMParser();
  const docHtml = parser.parseFromString(content, "text/html");
  const paragraphs: Paragraph[] = Array.from(docHtml.body.childNodes).map((node) => {
    const children: TextRun[] = [];

    node.childNodes.forEach((child) => {
      if (child.nodeName === "STRONG") {
        children.push(new TextRun({ text: child.textContent || "", bold: true }));
      } else if (child.nodeName === "EM") {
        children.push(new TextRun({ text: child.textContent || "", italics: true }));
      } else {
        children.push(new TextRun({ text: child.textContent || "" }));
      }
    });

    return new Paragraph({ children });
  });

  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  return new File([blob], "edited.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
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
      
      console.log(" issue with connected the mongodb");
      alert("Failed to save");
    }
  };

  const handleExport = async () => {
    const newFile = await rebuildDocx();
    saveAs(newFile, "exported.docx");
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.sides}>
        <div className={styles.subContainer}>
          <h2 className={styles.heading}>DOCX Editor</h2>
          <input type="file" accept=".docx" onChange={handleFileChange} />
          <button className={styles.btn} onClick={handleSave} disabled={!content || !userId}>Save</button>
          <button className={styles.btn} onClick={handleExport} disabled={!content}>Export</button>
        </div>
        <div className={styles.preview}>
          <h3>Editor</h3>
          <TinyMCEEditor content={content} setContent={setContent}  />
        </div>
      </div>
    </div>
  );
}
