import React from 'react';
import './ModernTech.css';
import { Mail, Phone } from 'lucide-react';

export default function ModernTech({ formData }) {
  const { personal, summary, projects, hasExperience, experience, education, skills, certifications } = formData;

  return (
    <div className="modern-tech-resume" id="resume-preview-content">
      {/* Left Column */}
      <div className="modern-tech-left">
        <div className="mt-profile">
          <h1>{personal.firstName} {personal.lastName}</h1>
        </div>

        <div className="mt-contact">
          <h2 className="section-title-left">Contact</h2>
          {personal.email && (
            <div className="mt-contact-item">
              <Mail size={14} /> <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="mt-contact-item">
              <Phone size={14} /> <span>{personal.phone}</span>
            </div>
          )}
          {/* Add more contacts if available in future, e.g. linkedin, location */}
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-skills-section">
            <h2 className="section-title-left">Tech Skills</h2>
            {skills.map((skill, idx) => (
              <div key={idx} className="mt-skill-bar">
                <div className="mt-skill-name">{skill}</div>
                <div className="mt-bar-bg">
                  <div className="mt-bar-fill" style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="mt-cert-section">
            <h2 className="section-title-left">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mt-cert-item">
                <span className="mt-cert-name">{cert.name}</span>
                <span className="mt-cert-org">{cert.organization} | {cert.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="modern-tech-right">
        {summary && (
          <div className="mt-summary-section">
            <h2 className="section-title-right">Profile Summary</h2>
            <div className="mt-summary">{summary}</div>
          </div>
        )}

        {hasExperience !== false && experience && experience.length > 0 && (
          <div className="mt-exp-section">
            <h2 className="section-title-right">Experience</h2>
            {experience.map(ex => (
              <div key={ex.id} className="mt-item">
                <div className="mt-item-header">
                  <div>
                    <div className="mt-item-title">{ex.role}</div>
                    <div className="mt-item-subtitle">{ex.company}</div>
                  </div>
                  <div className="mt-item-date">{ex.startDate} - {ex.current ? 'Present' : ex.endDate}</div>
                </div>
                <div className="mt-item-desc">{ex.description}</div>
              </div>
            ))}
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="mt-proj-section">
            <h2 className="section-title-right">Projects</h2>
            {projects.map(p => (
              <div key={p.id} className="mt-item">
                <div className="mt-item-header">
                  <div>
                    <div className="mt-item-title">{p.title}</div>
                    <div className="mt-project-tech">{p.technologies}</div>
                  </div>
                  <div className="flex gap-2">
                    {p.githubUrl && <a href={p.githubUrl} className="mt-item-date">GitHub</a>}
                    {p.demoUrl && <a href={p.demoUrl} className="mt-item-date">Demo</a>}
                  </div>
                </div>
                <div className="mt-item-desc">{p.description}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-edu-section">
          <h2 className="section-title-right">Education</h2>
          {education?.degree?.school && (
            <div className="mt-item">
              <div className="mt-item-header">
                <div>
                  <div className="mt-item-title">{education.degree.degree} in {education.degree.field}</div>
                  <div className="mt-item-subtitle">{education.degree.school} (CGPA: {education.degree.cgpa})</div>
                </div>
                <div className="mt-item-date">{education.degree.startDate} - {education.degree.endDate}</div>
              </div>
            </div>
          )}
          {education?.twelfth?.school && (
            <div className="mt-item">
              <div className="mt-item-header">
                <div>
                  <div className="mt-item-title">Class XII ({education.twelfth.board})</div>
                  <div className="mt-item-subtitle">{education.twelfth.school} ({education.twelfth.percentage}%)</div>
                </div>
                <div className="mt-item-date">{education.twelfth.year}</div>
              </div>
            </div>
          )}
          {education?.tenth?.school && (
            <div className="mt-item">
              <div className="mt-item-header">
                <div>
                  <div className="mt-item-title">Class X ({education.tenth.board})</div>
                  <div className="mt-item-subtitle">{education.tenth.school} ({education.tenth.percentage}%)</div>
                </div>
                <div className="mt-item-date">{education.tenth.year}</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
