import React from 'react';
import './MinimalistClean.css';

export default function MinimalistClean({ formData }) {
  const { personal, summary, projects, hasExperience, experience, education, skills, certifications } = formData;

  return (
    <div className="minimalist-resume" id="resume-preview-content">
      
      <div className="min-header">
        <h1>{personal.firstName} {personal.lastName}</h1>
        <div className="min-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
        </div>
      </div>

      {summary && (
        <div className="min-section">
          <div className="min-section-title">Summary</div>
          <div className="min-summary">{summary}</div>
        </div>
      )}

      {hasExperience !== false && experience && experience.length > 0 && (
        <div className="min-section">
          <div className="min-section-title">Experience</div>
          {experience.map(ex => (
            <div key={ex.id} className="min-item">
              <div className="min-item-header">
                <div>
                  <span className="min-item-title">{ex.role}</span>
                  <span className="min-item-subtitle">{ex.company}</span>
                </div>
                <div className="min-item-date">{ex.startDate} - {ex.current ? 'Present' : ex.endDate}</div>
              </div>
              <div className="min-item-desc">{ex.description}</div>
            </div>
          ))}
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="min-section">
          <div className="min-section-title">Projects</div>
          {projects.map(p => (
            <div key={p.id} className="min-item">
              <div className="min-item-header">
                <div>
                  <span className="min-item-title">{p.title}</span>
                  <span className="min-item-subtitle">{p.technologies}</span>
                </div>
              </div>
              <div className="min-item-desc">{p.description}</div>
            </div>
          ))}
        </div>
      )}

      <div className="min-section">
        <div className="min-section-title">Education</div>
        {education?.degree?.school && (
          <div className="min-item">
            <div className="min-item-header">
              <div>
                <span className="min-item-title">{education.degree.degree} in {education.degree.field}</span>
                <span className="min-item-subtitle">{education.degree.school}</span>
              </div>
              <div className="min-item-date">{education.degree.startDate} - {education.degree.endDate}</div>
            </div>
          </div>
        )}
        {education?.twelfth?.school && (
          <div className="min-item">
            <div className="min-item-header">
              <div>
                <span className="min-item-title">Class XII ({education.twelfth.board})</span>
                <span className="min-item-subtitle">{education.twelfth.school}</span>
              </div>
              <div className="min-item-date">{education.twelfth.year}</div>
            </div>
          </div>
        )}
        {education?.tenth?.school && (
          <div className="min-item">
            <div className="min-item-header">
              <div>
                <span className="min-item-title">Class X ({education.tenth.board})</span>
                <span className="min-item-subtitle">{education.tenth.school}</span>
              </div>
              <div className="min-item-date">{education.tenth.year}</div>
            </div>
          </div>
        )}
      </div>

      {skills && skills.length > 0 && (
        <div className="min-section">
          <div className="min-section-title">Skills</div>
          <div className="min-skills-list">
            {skills.join(' • ')}
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="min-section">
          <div className="min-section-title">Certifications</div>
          {certifications.map(c => (
            <div key={c.id} className="min-item">
              <div className="min-item-header">
                <div>
                  <span className="min-item-title">{c.name}</span>
                  <span className="min-item-subtitle">{c.organization}</span>
                </div>
                <div className="min-item-date">{c.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
