import { useState } from 'react'
import './App.css'
import axios from "axios";

function App() {
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [date, setDate] = useState('');
  const [instructor, setInstructor] = useState('');
  const [appFounder, setAppFounder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/generate-certificate', {
        studentName,
        courseName,
        date,
        instructor,
        appFounder
      }, { responseType: 'arraybuffer' });

      // Create a link to download the file
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'certificate.docx';
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
      setError('There was an error generating the certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Generate Certificate</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Instructor:</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>App Founder:</label>
          <input
            type="text"
            value={appFounder}
            onChange={(e) => setAppFounder(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Certificate'}
          </button>
        </div>
      </form>

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App
