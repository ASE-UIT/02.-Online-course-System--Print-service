const express = require("express");
const jsreport = require("jsreport")();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const convertDocxToPdf = require("docx-pdf");

const { Readable } = require("stream");
const temp = require("temp");

// Initialize the express app
const app = express();
const port = 3000;

const cors = require("cors");

// Enable CORS for all origins (or set up a specific origin if needed)
app.use(cors());

// Middleware to parse JSON request body
app.use(express.json());

// Register handlebars extension
jsreport.use(require("@jsreport/jsreport-handlebars")());

// Register docx extension
jsreport.use(require("@jsreport/jsreport-docx")());

// Initialize JSReport
jsreport
  .init()
  .then(() => {
    console.log("JSReport is initialized and running");
  })
  .catch((e) => {
    console.error("Error during JSReport initialization", e);
    process.exit(1);
  });

// POST route to generate report
app.post("/generate-certificate", async (req, res) => {
  const { studentName, courseName, date, instructor, appFounder } = req.body;

  try {
    // Define the template configuration
    const report = await jsreport.render({
      template: {
        name: "BlueProfessionalCertificateOfCompletion", // Replace with your actual template name
        recipe: "docx",
      },
      data: { studentName, courseName, date, instructor, appFounder },
    });

    const uniqueId = uuidv4();
    const wordPath = path.join(__dirname, `${uniqueId}.docx`);
    const pdfPath = path.join(__dirname, `${uniqueId}.pdf`);
    const jpegPath = path.join(__dirname, `${uniqueId}final.jpg`);

    console.log("jpegPath", jpegPath);

    // Lưu file Word ra đĩa
    fs.writeFileSync(wordPath, report.content);

    // Chuyển từ Word sang PDF (dùng LibreOffice)
    exec(
      `libreoffice --headless --convert-to pdf ${wordPath} --outdir ${__dirname}`,
      async (err) => {
        if (err) {
          console.error("Error converting Word to PDF:", err);
          return res.status(500).send("Error generating PDF");
        }

        // Chuyển từ PDF sang JPEG
        exec(
          `pdftoppm -jpeg ${pdfPath} ${jpegPath.replace(".jpg", "")}`,
          (err) => {
            if (err) {
              console.error("Error converting PDF to JPEG:", err);
              return res.status(500).send("Error generating JPEG");
            }

            // Gửi file JPEG làm phản hồi
            res.setHeader("Content-Type", "image/jpeg");
            const resultPath = `${jpegPath.replace(".jpg", "")}-1.jpg`;
            // res.sendFile(resultPath);

            res.sendFile(resultPath, (sendErr) => {
              if (sendErr) {
                console.error("Error sending JPEG:", sendErr);
              }

              // Clean up temporary files
              [wordPath, pdfPath, resultPath].forEach((file) => {
                fs.unlink(file, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error(`Error deleting file ${file}:`, unlinkErr);
                  }
                });
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
