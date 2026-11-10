import React, { useState } from "react";
import {
  FiExternalLink,
  FiAward,
  FiEye,
  FiStar,
} from "react-icons/fi";

import { Certification } from "../data/certifications";

interface CertificationCardProps {
  certification: Certification;
  onPreview: (certification: Certification) => void;
}

const CertificationCard = ({
  certification,
  onPreview,
}: CertificationCardProps) => {
  const [previewFailed, setPreviewFailed] = useState(false);

  return (
    <article className="cert-card">

      {/* Featured badge */}
      {certification.featured && (
        <span className="cert-featured-badge">
          <FiStar />
          Featured
        </span>
      )}

      {/* Certificate image */}
      <button
        type="button"
        className="cert-preview"
        onClick={() => onPreview(certification)}
        aria-label={`Preview ${certification.title}`}
      >
        {!previewFailed ? (
          <img
            src={certification.certificateImage}
            alt={`${certification.title} certificate`}
            className="cert-preview-image"
            loading="lazy"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <div className="cert-preview-fallback">
            <FiAward />
            <span>Preview unavailable</span>
          </div>
        )}

        <span className="cert-preview-action">
          <FiEye />
          Preview
        </span>
      </button>

      {/* Card content */}
      <div className="cert-content">

        <div className="cert-organization">
          <img
            src={certification.organizationLogo}
            alt=""
            className="organization-logo"
          />

          <div className="cert-heading">
            <p className="organization-name">
              {certification.issuingOrganization}
            </p>

            <h3 className="certificate-title">
              {certification.title}
            </h3>
          </div>
        </div>

        <p className="certificate-description">
          {certification.description}
        </p>

        <div className="certificate-meta">
          <div className="meta-item">
            <span className="meta-label">Issued</span>
            <span className="meta-value">
              {certification.issueDate}
            </span>
          </div>
        </div>

        <div className="certificate-category">
          {certification.category}
        </div>

        <div className="certificate-skills">
          {certification.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="skill-pill">
              {skill}
            </span>
          ))}

          {certification.skills.length > 3 && (
            <span className="skill-pill skill-more">
              +{certification.skills.length - 3}
            </span>
          )}
        </div>

        <button
          type="button"
          className="certificate-button"
          onClick={() => onPreview(certification)}
        >
          <span>View Certificate</span>
          <FiExternalLink />
        </button>

      </div>
    </article>
  );
};

export default CertificationCard;