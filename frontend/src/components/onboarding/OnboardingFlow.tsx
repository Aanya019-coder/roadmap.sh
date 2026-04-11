import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Answers {
  name: string;
  college: string;
  studyYear: string;
  hometown: string;
  country: string;
  currentSkills: string[];
  codingLevel: string;
  mainGoal: string;
  interestArea: string;
  weeklyHours: string;
  biggestConstraint: string;
  learningStyles: string[];
  resourcePreference: string;
  preparingFor: string;
  dreamProject: string;
  linkedinUrl: string;
  githubUsername: string;
}

const TOTAL_STEPS = 6;

const SKILLS = ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C/C++', 'React', 'Node.js', 'SQL', 'Git', 'None of these'];
const LEARNING_STYLES = ['Reading articles and docs', 'Watching video tutorials', 'Doing hands-on projects', 'Following structured courses', 'Learning by building real things', 'Peer learning / study groups'];

// ─── Step Components ──────────────────────────────────────────────────────────
function StepCard({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="animate-slide-up" style={{ maxWidth: 640, width: '100%' }}>
      <h2 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>{subtitle}</p>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }: any) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{label}</label>
      <input className="input" type={type} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function RadioOption({ label, value, selected, onChange }: any) {
  return (
    <button type="button" onClick={() => onChange(value)} style={{
      width: '100%', textAlign: 'left', padding: '0.875rem 1rem', borderRadius: 10,
      border: `2px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
      background: selected ? 'var(--color-green-bg)' : 'var(--color-bg-secondary)',
      color: 'var(--color-text-primary)', cursor: 'pointer', marginBottom: '0.625rem',
      fontFamily: 'inherit', fontSize: '0.9375rem', transition: 'all 0.15s ease',
      display: 'flex', alignItems: 'center', gap: '0.75rem'
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
        background: selected ? 'var(--color-accent)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
      </span>
      {label}
    </button>
  );
}

function CheckboxOption({ label, checked, onChange }: any) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      padding: '0.625rem 1rem', borderRadius: 8,
      border: `2px solid ${checked ? 'var(--color-accent)' : 'var(--color-border)'}`,
      background: checked ? 'var(--color-green-bg)' : 'var(--color-bg-secondary)',
      color: checked ? 'var(--color-green-light)' : 'var(--color-text-secondary)',
      cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
      transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4, border: `2px solid ${checked ? 'var(--color-accent)' : 'var(--color-border)'}`,
        background: checked ? 'var(--color-accent)' : 'transparent', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      </span>
      {label}
    </button>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function GeneratingScreen() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)', animation: 'spin 1s linear infinite', margin: '0 auto'
        }} />
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
        Generating your personalized roadmap
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
        Our AI is analyzing your background, goals, and learning style to create a roadmap that's uniquely yours. This takes about 10-15 seconds.
      </p>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
        {['Analyzing your profile...', 'Mapping skill dependencies...', 'Curating resources...'].map((txt, i) => (
          <span key={txt} className="badge badge-gray" style={{ animationDelay: `${i * 0.5}s` }}>{txt}</span>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Onboarding Flow ─────────────────────────────────────────────────────
function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    name: '', college: '', studyYear: '', hometown: '', country: '',
    currentSkills: [], codingLevel: '', mainGoal: '', interestArea: '',
    weeklyHours: '', biggestConstraint: '', learningStyles: [],
    resourcePreference: '', preparingFor: '', dreamProject: '', linkedinUrl: '', githubUsername: '',
  });

  const update = (key: keyof Answers) => (val: any) => setAnswers(prev => ({ ...prev, [key]: val }));
  const toggleArray = (key: 'currentSkills' | 'learningStyles', val: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val]
    }));
  };

  const progress = ((step - 1) / TOTAL_STEPS) * 100;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      await api.generateRoadmap(answers, session.access_token);
      window.location.href = '/dashboard?new=1';
    } catch (e) {
      console.error(e);
      setGenerating(false);
    }
  };

  if (generating) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}><GeneratingScreen /></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', padding: '0 1rem' }}>
      {/* Progress Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)', padding: '1.25rem 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: 'var(--color-accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.875rem' }}>R</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>roadmap.sh</span>
            </a>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--color-border)', borderRadius: 999 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s',
              background: i + 1 < step ? 'var(--color-accent)' : i + 1 === step ? 'var(--color-green-bg)' : 'var(--color-bg-elevated)',
              color: i + 1 <= step ? i + 1 < step ? '#fff' : 'var(--color-green-light)' : 'var(--color-text-muted)',
              border: `2px solid ${i + 1 === step ? 'var(--color-accent)' : 'transparent'}`
            }}>{i + 1}</div>
          ))}
        </div>

        {/* Step 1 — Personal Background */}
        {step === 1 && (
          <StepCard title="Tell us about yourself" subtitle="This helps us personalize your roadmap for your unique situation.">
            <InputField label="Full name" value={answers.name} onChange={update('name')} placeholder="Alex Johnson" />
            <InputField label="College / University" value={answers.college} onChange={update('college')} placeholder="e.g. IIT Delhi, Self-taught, Bootcamp..." />
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Current year of study</label>
              {['1st year', '2nd year', '3rd year', '4th year', 'Graduated', 'Not in college'].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.studyYear === opt} onChange={update('studyYear')} />
              ))}
            </div>
            <InputField label="Hometown / City" value={answers.hometown} onChange={update('hometown')} placeholder="Mumbai, Delhi, New York..." />
            <InputField label="Country" value={answers.country} onChange={update('country')} placeholder="India, USA, UK..." />
          </StepCard>
        )}

        {/* Step 2 — Current Skills */}
        {step === 2 && (
          <StepCard title="What do you already know?" subtitle="Select everything you're comfortable with — no need to exaggerate!">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Technologies & tools you know (select all that apply)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {SKILLS.map(skill => (
                  <CheckboxOption key={skill} label={skill} checked={answers.currentSkills.includes(skill)} onChange={() => toggleArray('currentSkills', skill)} />
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>How comfortable are you with coding overall?</label>
              {['Complete beginner', 'Know the basics', 'Intermediate', 'Advanced'].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.codingLevel === opt} onChange={update('codingLevel')} />
              ))}
            </div>
          </StepCard>
        )}

        {/* Step 3 — Career Goals */}
        {step === 3 && (
          <StepCard title="What are you trying to achieve?" subtitle="Be honest — this is what makes your roadmap truly personalized.">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>What is your main goal right now?</label>
              {[
                'Get my first developer job', 'Switch careers into tech', 'Freelance and earn money',
                'Build my own product/startup', 'Improve skills at my current job',
                'Just learning for fun', 'Crack a FAANG/top-tier interview'
              ].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.mainGoal === opt} onChange={update('mainGoal')} />
              ))}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>What type of work excites you most?</label>
              {[
                'Building what users see (Frontend)', 'Building servers and databases (Backend)',
                'Both frontend and backend (Full Stack)', 'DevOps and cloud infrastructure',
                'Data science and AI/ML', 'Mobile apps', 'Cybersecurity', 'Game development', "I'm not sure yet"
              ].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.interestArea === opt} onChange={update('interestArea')} />
              ))}
            </div>
          </StepCard>
        )}

        {/* Step 4 — Time & Constraints */}
        {step === 4 && (
          <StepCard title="Time and constraints" subtitle="We'll build a realistic roadmap that fits your actual life.">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>How many hours per week can you dedicate to learning?</label>
              {['Less than 5 hours', '5-10 hours', '10-20 hours', 'More than 20 hours'].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.weeklyHours === opt} onChange={update('weeklyHours')} />
              ))}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>What is your biggest constraint right now?</label>
              {[
                'Very limited time', 'Lack of structured guidance', "Don't know where to start",
                'Struggling with motivation', 'Financial constraints', 'English is not my first language', 'No laptop / slow internet'
              ].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.biggestConstraint === opt} onChange={update('biggestConstraint')} />
              ))}
            </div>
          </StepCard>
        )}

        {/* Step 5 — Learning Style */}
        {step === 5 && (
          <StepCard title="How do you learn best?" subtitle="We'll recommend resources that match your learning style.">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>How do you learn best? (select all that apply)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {LEARNING_STYLES.map(style => (
                  <CheckboxOption key={style} label={style} checked={answers.learningStyles.includes(style)} onChange={() => toggleArray('learningStyles', style)} />
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Do you prefer:</label>
              {['Free resources only', 'Mix of free and paid', 'Happy to pay for quality'].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.resourcePreference === opt} onChange={update('resourcePreference')} />
              ))}
            </div>
          </StepCard>
        )}

        {/* Step 6 — Specific Interests */}
        {step === 6 && (
          <StepCard title="Almost done! A few more details" subtitle="These are optional but help us make your roadmap really specific.">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Are you preparing for anything specific?</label>
              {[
                'Campus placement / college recruitment', 'Hackathons', 'Open source contributions',
                'Internship applications', 'Building a specific project', 'Nothing specific'
              ].map(opt => (
                <RadioOption key={opt} label={opt} value={opt} selected={answers.preparingFor === opt} onChange={update('preparingFor')} />
              ))}
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Describe your dream project or goal in one line <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
              </label>
              <input className="input" type="text" value={answers.dreamProject} onChange={e => update('dreamProject')(e.target.value)} placeholder="e.g. Build a SaaS product that helps students..." />
            </div>
            <InputField label={<>LinkedIn URL <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></>} value={answers.linkedinUrl} onChange={update('linkedinUrl')} placeholder="https://linkedin.com/in/yourname" />
            <InputField label={<>GitHub username <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></>} value={answers.githubUsername} onChange={update('githubUsername')} placeholder="your-github-username" />
          </StepCard>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {step > 1 && (
              <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            {step === 1 && (
              <a href="/dashboard" className="btn btn-ghost" style={{ textDecoration: 'none' }}>Skip for now</a>
            )}
          </div>
          <div>
            {step < TOTAL_STEPS ? (
              <button className="btn btn-primary btn-lg" onClick={() => setStep(s => s + 1)}>
                Continue →
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleGenerate} style={{ gap: '0.5rem' }}>
                <span>✨</span> Generate My Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function mountOnboarding(el: HTMLElement) {
  const root = createRoot(el);
  root.render(<OnboardingFlow />);
}

export default OnboardingFlow;
