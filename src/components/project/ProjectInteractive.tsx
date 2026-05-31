import React, { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface ProjectInteractiveProps {
  projectId: string;
  requirements: string[];
  checklist: string[];
}

export default function ProjectInteractive({ projectId, requirements, checklist }: ProjectInteractiveProps) {
  const [projectStatus, setProjectStatus] = useState<'not-started' | 'started' | 'submitted'>('not-started');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [githubUrl, setGithubUrl] = useState('');
  const [solutions, setSolutions] = useState<Array<{ id: string; url: string; upvotes: number; user: string }>>([]);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  useEffect(() => {
    // Load project status
    const savedStatus = localStorage.getItem(`project-status:${projectId}`) as any;
    if (savedStatus) setProjectStatus(savedStatus);

    // Load checklist
    const savedChecklist = JSON.parse(localStorage.getItem(`project-checklist:${projectId}`) || '{}');
    setCompletedItems(savedChecklist);

    // Load solutions
    const savedSolutions = JSON.parse(localStorage.getItem(`project-solutions:${projectId}`) || '[]');
    setSolutions(savedSolutions);
  }, [projectId]);

  const handleStartProject = () => {
    localStorage.setItem(`project-status:${projectId}`, 'started');
    setProjectStatus('started');
  };

  const handleToggleChecklist = (item: string) => {
    const next = { ...completedItems, [item]: !completedItems[item] };
    setCompletedItems(next);
    localStorage.setItem(`project-checklist:${projectId}`, JSON.stringify(next));
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl) return;

    const newSolution = {
      id: Math.random().toString(36).substr(2, 9),
      url: githubUrl,
      upvotes: 0,
      user: 'Anonymous Guest'
    };

    const nextSolutions = [newSolution, ...solutions];
    setSolutions(nextSolutions);
    localStorage.setItem(`project-solutions:${projectId}`, JSON.stringify(nextSolutions));
    localStorage.setItem(`project-status:${projectId}`, 'submitted');
    setProjectStatus('submitted');
    setGithubUrl('');
    setIsSubmitOpen(false);
  };

  const handleUpvote = (id: string) => {
    const nextSolutions = solutions.map(s => {
      if (s.id === id) {
        return { ...s, upvotes: s.upvotes + 1 };
      }
      return s;
    }).sort((a, b) => b.upvotes - a.upvotes);
    setSolutions(nextSolutions);
    localStorage.setItem(`project-solutions:${projectId}`, JSON.stringify(nextSolutions));
  };

  // Checklist completion percentage
  const totalChecklist = checklist.length;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content: Requirements & Checklist */}
      <div className="lg:col-span-2 space-y-8">
        {/* Milestone Strip */}
        <section className="bg-bg-secondary border border-border-default rounded-xl p-6">
          <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">Milestone Progress</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-default/30 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                projectStatus !== 'not-started' ? 'bg-accent-green text-white' : 'bg-bg-tertiary text-text-secondary'
              }`}>
                1
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Start Project</p>
                <p className="text-[10px] text-text-muted">Initialize repository</p>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-[2px] bg-border-default" />

            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                projectStatus === 'submitted' ? 'bg-accent-green text-white' : 'bg-bg-tertiary text-text-secondary'
              }`}>
                2
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Submit Solution</p>
                <p className="text-[10px] text-text-muted">Link public repository</p>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-[2px] bg-border-default" />

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-bg-tertiary text-text-secondary flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <p className="text-xs font-semibold text-white">5 Upvotes</p>
                <p className="text-[10px] text-text-muted">Receive upvotes</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {projectStatus === 'not-started' && (
              <Button onClick={handleStartProject}>Start Project</Button>
            )}
            {projectStatus === 'started' && (
              <div className="flex gap-2">
                <Button variant="outline" disabled>Project Started</Button>
                <Button onClick={() => setIsSubmitOpen(true)}>Submit Solution</Button>
              </div>
            )}
            {projectStatus === 'submitted' && (
              <div className="flex gap-2">
                <Badge variant="beginner" className="py-1 px-3">Completed & Submitted</Badge>
                <Button onClick={() => setIsSubmitOpen(true)}>Submit Another</Button>
              </div>
            )}
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-bg-secondary border border-border-default rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Requirements</h2>
          <ul className="space-y-3 list-disc pl-5 text-sm text-text-secondary leading-relaxed">
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>

        {/* Interactive Checklist */}
        <section className="bg-bg-secondary border border-border-default rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Interactive Checklist</h2>
            <span className="text-xs font-semibold text-text-secondary">{progressPercent}% Done</span>
          </div>
          
          <div className="w-full h-1 bg-bg-tertiary rounded-full overflow-hidden mb-6">
            <div className="h-full bg-accent-yellow transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div 
                key={i} 
                onClick={() => handleToggleChecklist(item)}
                className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                  completedItems[item]
                    ? 'bg-bg-primary/20 border-accent-green/30 text-green-400/90'
                    : 'bg-bg-primary/40 border-border-default hover:border-border-hover text-text-primary'
                }`}
              >
                <button
                  className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                    completedItems[item]
                      ? 'bg-accent-green border-accent-green text-white'
                      : 'border-border-hover bg-bg-tertiary/30'
                  }`}
                >
                  {completedItems[item] && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
                <span className={`text-sm select-none ${completedItems[item] ? 'line-through opacity-70' : ''}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar: Submissions & Solutions */}
      <div className="space-y-8">
        <section className="bg-bg-secondary border border-border-default rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Community Solutions</h2>
          
          {solutions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted mb-4">No solutions submitted yet. Be the first!</p>
              {projectStatus !== 'not-started' && (
                <Button size="sm" onClick={() => setIsSubmitOpen(true)}>Submit Solution</Button>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {solutions.map((sol) => (
                <div key={sol.id} className="border border-border-default rounded-lg p-3 bg-bg-primary/30 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted truncate">{sol.user}</p>
                    <a 
                      href={sol.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-semibold text-white hover:text-accent-yellow transition-colors truncate block"
                    >
                      {sol.url.replace('https://github.com/', '')}
                    </a>
                  </div>
                  <button 
                    onClick={() => handleUpvote(sol.id)}
                    className="flex items-center gap-1 py-1 px-2 rounded bg-bg-tertiary hover:bg-border-hover transition-colors text-xs text-text-secondary hover:text-white"
                  >
                    <span>▲</span>
                    <span>{sol.upvotes}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSubmitOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-bg-secondary border border-border-default rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Submit Solution</h3>
            <p className="text-xs text-text-secondary mb-4">Provide the link to your public GitHub repository containing the project files.</p>
            
            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-username/your-repo"
                  className="w-full bg-bg-tertiary/50 border border-border-default rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-border-hover transition-colors"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSubmitOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
