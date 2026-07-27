import React from 'react';
import './ExecutiveStandard.css';

export default function ExecutiveStandard({ formData }) {
  const { personal, summary, projects, hasExperience, experience, education, skills, certifications } = formData;

  return (
    <div className="executive-resume" id="resume-preview-content">
      
      <div className="exec-header">
        <h1>{personal.firstName} {personal.lastName}</h1>
        <div className="exec-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.email && personal.phone && <span>|</span>}
          {personal.phone && <span>{personal.phone}</span>}
        </div>
      </div>

      {summary && (
        <div className="exec-section">
          <div className="exec-section-title">Professional Summary</div>
          <div className="exec-summary">{summary}</div>
        </div>
      )}

      {hasExperience !== false && experience && experience.length > 0 && (
        <div className="exec-section">
          <div className="exec-section-title">Professional Experience</div>
          {experience.map(ex => (
            <div key={ex.id} className="exec-item">
              <div className="exec-item-header">
                <div>
                  <span className="exec-item-title">{ex.role}</span>
                  <span className="exec-item-subtitle">, {ex.company}</span>
                </div>
                <div className="exec-item-date">{ex.startDate} - {ex.current ? 'Present' : ex.endDate}</div>
              </div>
              <div className="exec-item-desc">{ex.description}</div>
            </div>
          ))}
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="exec-section">
          <div className="exec-section-title">Key Projects</div>
          {projects.map(p => (
            <div key={p.id} className="exec-item">
              <div className="exec-item-header">
                <div>
                  <span className="exec-item-title">{p.title}</span>
                  <span className="exec-item-subtitle"> | {p.technologies}</span>
                </div>
              </div>
              <div className="exec-item-desc">{p.description}</div>
            </div>
          ))}
        </div>
      )}

      <div className="exec-section">
        <div className="exec-section-title">Education</div>
        {education?.degree?.school && (
          <div className="exec-item">
            <div className="exec-item-header">
              <div>
                <span className="exec-item-title">{education.degree.degree} in {education.degree.field}</span>
                <span className="exec-item-subtitle">, {education.degree.school} (CGPA: {education.degree.cgpa})</span>
              </div>
              <div className="exec-item-date">{education.degree.startDate} - {education.degree.endDate}</div>
            </div>
          </div>
        )}
        {education?.twelfth?.school && (
          <div className="exec-item">
            <div className="exec-item-header">
              <div>
                <span className="exec-item-title">Class XII ({education.twelfth.board})</span>
                <span className="exec-item-subtitle">, {education.twelfth.school} ({education.twelfth.percentage}%)</span>
              </div>
              <div className="exec-item-date">{education.twelfth.year}</div>
            </div>
          </div>
        )}
        {education?.tenth?.school && (
          <div className="exec-item">
            <div className="exec-item-header">
              <div>
                <span className="exec-item-title">Class X ({education.tenth.board})</span>
                <span className="exec-item-subtitle">, {education.tenth.school} ({education.tenth.percentage}%)</span>
              </div>
              <div className="exec-item-date">{education.tenth.year}</div>
            </div>
          </div>
        )}
      </div>

      {certifications && certifications.length > 0 && (
        <div className="exec-section">
          <div className="exec-section-title">Certifications & Training</div>
          {certifications.map(c => (
            <div key={c.id} className="exec-item">
              <div className="exec-item-header">
                <div>
                  <span className="exec-item-title">{c.name}</span>
                  <span className="exec-item-subtitle">, {c.organization}</span>
                </div>
                <div className="exec-item-date">{c.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="exec-section">
          <div className="exec-section-title">Core Competencies</div>
          <div className="exec-skills-list">
            {skills.join(' • ')}
          </div>
        </div>
      )}

    </div>
  );
}
