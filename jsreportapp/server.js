const express = require('express');
const jsreport = require('jsreport')();

// Initialize the express app
const app = express();
const port = 3000;

const cors = require('cors');

// Enable CORS for all origins (or set up a specific origin if needed)
app.use(cors());

// Middleware to parse JSON request body
app.use(express.json());

// Register handlebars extension
jsreport.use(require('@jsreport/jsreport-handlebars')())

// Register docx extension
jsreport.use(require('@jsreport/jsreport-docx')())

// Initialize JSReport
jsreport.init().then(() => {
  console.log('JSReport is initialized and running');
}).catch((e) => {
  console.error('Error during JSReport initialization', e);
  process.exit(1);
});

// POST route to generate report
app.post('/generate-certificate', async (req, res) => {
  const { studentName, courseName, date, instructor, appFounder } = req.body;

  try {
    // Define the template configuration
    const report = await jsreport.render({
      template: {
        name: 'BlueProfessionalCertificateOfCompletion',  // Replace with your actual template name
        recipe: 'docx',
      },
      data: { studentName, courseName, date, instructor, appFounder },
    });

    // Set response header to indicate file download type
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(report.content);  // Send the generated report as the response
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});