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

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="resume-preview-page">

      {/* HEADER */}
      <header className="resume-preview-header">
        <div className="resume-heading-content">

          <div className="resume-heading-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8" />
              <path d="M8 17h8" />
              <path d="M8 9h2" />
            </svg>
          </div>

          <div className="resume-heading-text">
            <h1>
              Resume <span>Preview</span>
            </h1>

            <p>Review your resume before downloading.</p>

            <div className="resume-heading-underline" />
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <section className="resume-preview-container">

        {/* LEFT: RESUME */}
        <div className="resume-document-container">

          {isLoading ? (
            <div className="resume-preview-placeholder">
              <div className="resume-loading-spinner" />
              <p>Generating your resume...</p>
            </div>
          ) : error ? (
            <div className="resume-preview-placeholder resume-error">
              <p>{error}</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={`${pdfUrl}#view=FitH`}
              title="Resume PDF Preview"
              className="resume-pdf-frame"
            />
          ) : null}

        </div>

        {/* RIGHT: ACTIONS */}
        <aside className="resume-actions-panel">

          <div className="resume-action-content">

            <div className="resume-pdf-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 14h8" />
                <path d="M8 18h5" />
              </svg>

              <span>PDF</span>
            </div>

            <h2>Resume Actions</h2>

            <button
              type="button"
              className="resume-download-action"
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
                <path d="M12 15V3" />
              </svg>

              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="resume-open-action"
              onClick={handleOpenPDF}
              disabled={!pdfUrl}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 3h7v7" />
                <path d="M10 14 21 3" />
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
              </svg>

              <span>Open in New Tab</span>
            </button>

          </div>
        </aside>

      </section>
    </main>
  );
};

export default ResumePreview;
