// app/api/generateReport/route.js

import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  const { name, className, comments, grades } = data;

  // Load the PDF template
  const pdfPath = path.join(
    process.cwd(),
    "public",
    "report-template-fields.pdf"
  );
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const form = pdfDoc.getForm();

  // Fill out the form fields with data
  form.getTextField("name").setText(name);
  form.getTextField("classname").setText(className);
  //   form.getTextField("comments").setText(comments);

  // Set each grade in its corresponding form field
  Object.entries(grades).forEach(([subject, grade]) => {
    form.getTextField(subject).setText(grade);
  });
  form.flatten();

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}_ReportCard.pdf"`,
    },
  });
}
