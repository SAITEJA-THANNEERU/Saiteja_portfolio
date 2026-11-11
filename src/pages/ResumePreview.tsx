import { useEffect, useState } from "react";
import { generateResumePDF } from "../utils/resumeGenerator";
import "../components/styles/ResumePreview.css";

const ResumePreview = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl = "";

    try {
      const pdfBlob = generateResumePDF();

      objectUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(objectUrl);
    } catch (err) {
      console.error("Resume PDF generation failed:", err);
      setError("Unable to generate your resume. Please try again.");
    } finally {
      setIsLoading(false);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Sai_Teja_Thanneeru_Resume.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPDF = () => {
    if (!pdfUrl) return;

    window.open(pdfUrl, "_blank");
  };

  return (
    <main className="resume-preview-page">
      <header className="resume-preview-header">
        <div>
          <h1>Resume Preview</h1>
          <p>Review your professional resume before downloading.</p>
        </div>
      </header>

      <div className="resume-preview-container">
        <section className="resume-document-container">
          {isLoading ? (
            <div className="resume-preview-placeholder">
              <p>Generating your resume...</p>
            </div>
          ) : error ? (
            <div className="resume-preview-placeholder">
              <p>{error}</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Resume PDF Preview"
              className="resume-pdf-frame"
            />
          ) : null}
        </section>

        <aside className="resume-information-panel">
          <h2>Your Professional Resume</h2>

          <p>
            Your resume is generated using the professional information,
            skills, education, projects, and certifications available in
            your portfolio.
          </p>

          <ul className="resume-feature-list">
            <li>ATS-friendly structure</li>
            <li>Professional one-page layout</li>
            <li>PDF format</li>
            <li>Clickable contact links</li>
          </ul>

          <div className="resume-actions">
            <button
              type="button"
              className="resume-download-action"
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              Download PDF Resume
            </button>

            <button
              type="button"
              className="resume-open-action"
              onClick={handleOpenPDF}
              disabled={!pdfUrl}
            >
              Open PDF in New Tab
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ResumePreview;