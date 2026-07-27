import React from 'react';
import './CreativePortfolio.css';

export default function CreativePortfolio({ formData }) {
  const { personal, summary, projects, hasExperience, experience, education, skills, certifications } = formData;

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase() || 'P';
  };

  return (
    <div className="creative-resume" id="resume-preview-content">
      
      <div className="creative-hero">
        <div className="creative-avatar">
          {getInitials(personal.firstName, personal.lastName)}
        </div>
        <div className="creative-header-info">
          <h1>{personal.firstName} {personal.lastName}</h1>
          <div className="creative-contact">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
          </div>
        </div>
      </div>

      <div className="creative-body">
        
        {/* Main Column */}
        <div>
          {summary && (
            <div className="mb-6">
              <div className="creative-section-title">About Me</div>
              <div className="creative-summary">{summary}</div>
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="mb-6">
              <div className="creative-section-title">Featured Projects</div>
              {projects.map(p => (
                <div key={p.id} className="creative-item">
                  <div className="creative-item-header">
                    <div>
                      <div className="creative-item-title">{p.title}</div>
                      <div className="creative-item-subtitle">{p.technologies}</div>
                    </div>
                  </div>
                  <div className="creative-item-desc">{p.description}</div>
                </div>
              ))}
            </div>
          )}

          {hasExperience !== false && experience && experience.length > 0 && (
            <div className="mb-6">
              <div className="creative-section-title">Work Experience</div>
              {experience.map(ex => (
                <div key={ex.id} className="creative-item">
                  <div className="creative-item-header">
                    <div>
                      <div className="creative-item-title">{ex.role}</div>
                      <div className="creative-item-subtitle">{ex.company}</div>
                    </div>
                    <div className="creative-item-date">{ex.startDate} - {ex.current ? 'Present' : ex.endDate}</div>
                  </div>
                  <div className="creative-item-desc">{ex.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Column */}
        <div>
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <div className="creative-section-title">Skills</div>
              <div className="creative-skills">
                {skills.map((skill, idx) => (
                  <span key={idx} className="creative-skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="creative-section-title">Education</div>
            {education?.degree?.school && (
              <div className="creative-edu-item">
                <div className="creative-edu-title">{education.degree.degree} in {education.degree.field}</div>
                <div className="creative-edu-sub">{education.degree.school} • {education.degree.startDate}-{education.degree.endDate}</div>
              </div>
            )}
            {education?.twelfth?.school && (
              <div className="creative-edu-item">
                <div className="creative-edu-title">Class XII ({education.twelfth.board})</div>
                <div className="creative-edu-sub">{education.twelfth.school} • {education.twelfth.year}</div>
              </div>
            )}
            {education?.tenth?.school && (
              <div className="creative-edu-item">
                <div className="creative-edu-title">Class X ({education.tenth.board})</div>
                <div className="creative-edu-sub">{education.tenth.school} • {education.tenth.year}</div>
              </div>
            )}
          </div>

          {certifications && certifications.length > 0 && (
            <div className="mb-6">
              <div className="creative-section-title">Certifications</div>
              {certifications.map(c => (
                <div key={c.id} className="creative-edu-item">
                  <div className="creative-edu-title">{c.name}</div>
                  <div className="creative-edu-sub">{c.organization} • {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
