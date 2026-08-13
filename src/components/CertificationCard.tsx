import { useState } from "react";
import { FiExternalLink, FiAward } from "react-icons/fi";
import { Certification } from "../data/certifications";
import "./styles/Certifications.css";

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard = ({ certification }: CertificationCardProps) => {
  const [previewFailed, setPreviewFailed] = useState(false);

  return (
    <article
      className={`cert-card ${
        certification.featured ? "featured-card" : ""
      }`}
    >
      {/* Featured Badge */}
      {certification.featured && (
        <div className="cert-featured-badge">
          <FiAward />
          <span>Featured</span>
        </div>
      )}

      {/* Certificate Image */}
      <div className="cert-preview">
        {previewFailed ? (
          <div
            className="cert-preview-fallback"
            role="img"
            aria-label={`${certification.title} preview unavailable`}
          >
            <FiAward />
            <span>Certificate preview unavailable</span>
          </div>
        ) : (
          <img
            src={certification.certificateImage}
            alt={`${certification.title} certificate`}
            className="cert-preview-image"
            loading="lazy"
            onError={() => setPreviewFailed(true)}
          />
        )}
      </div>

      {/* Certificate Content */}
      <div className="cert-content">

        {/* Organization + Certificate Name */}
        <div className="cert-organization">
          <img
            src={certification.organizationLogo}
            alt={certification.issuingOrganization}
            className="organization-logo"
          />

          <div>
            <p className="organization-name">
              {certification.issuingOrganization}
            </p>

            <h3 className="certificate-title">
              {certification.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="certificate-description">
          {certification.description}
        </p>

        {/* Issue Date */}
        <div className="certificate-meta">
          <div className="meta-item">
            <span className="meta-label">
              Issued
            </span>

            <span className="meta-value">
              {certification.issueDate}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="certificate-category">
          {certification.category}
        </div>

        {/* Skills */}
        <div className="certificate-skills">
          {certification.skills.map((skill) => (
            <span
              key={skill}
              className="skill-pill"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* View Certificate */}
        <a
          href={certification.certificatePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="certificate-button"
          aria-label={`View ${certification.title} certificate`}
        >
          <span>View Certificate</span>
          <FiExternalLink />
        </a>

      </div>
    </article>
  );
};

export default CertificationCard;