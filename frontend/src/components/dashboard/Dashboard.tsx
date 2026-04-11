import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import RoadmapCard from '../roadmap/RoadmapCard';

export default function Dashboard({ token }: { token: string }) {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ done: 0, total: 0, progress: 0 });
    const [personalRoadmap, setPersonalRoadmap] = useState<any>(null);
    const [recentRoadmaps, setRecentRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getProfile(token),
            api.getPersonalizedRoadmap(token),
            api.getRoadmaps()
        ]).then(([profile, personalized, allRoadmaps]) => {
            if (profile.success) setUser(profile.data);
            if (personalized.success) setPersonalRoadmap(personalized.data);
            if (allRoadmaps.success) setRecentRoadmaps(allRoadmaps.data.slice(0, 3));
            setLoading(false);
        });
    }, [token]);

    if (loading) return (
        <div className="container" style={{ paddingTop: '8rem' }}>
            <div className="skeleton" style={{ height: 40, width: 200, marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: 200, borderRadius: 20 }} />
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            {/* Header */}
            <header style={{ padding: '4rem 0 3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name || 'Developer'} 👋</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>You're currently mastering your personalized path.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    
                    {/* Active Roadmap Section */}
                    <section>
                      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <span style={{ color: 'var(--color-accent)' }}>✨</span> Your AI Roadmap
                      </h2>
                      
                      {personalRoadmap ? (
                        <div className="roadmap-card" style={{ display: 'flex', gap: '2rem', padding: '2.5rem', alignItems: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.625rem', marginBottom: '0.75rem' }}>{personalRoadmap.roadmap_data.title}</h3>
                            <p style={{ fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{personalRoadmap.roadmap_data.description}</p>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                               <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Focus Area</span>
                                  <span style={{ fontWeight: 600 }}>Frontend Web</span>
                               </div>
                               <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Time Spent</span>
                                  <span style={{ fontWeight: 600 }}>12.4 Hours</span>
                               </div>
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                              <a href="/dashboard/roadmap" className="btn btn-primary">Resume Learning</a>
                            </div>
                          </div>
                          
                          {/* Circular Progress (CSS only) */}
                          <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <svg width="140" height="140" viewBox="0 0 140 140">
                               <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                               <circle cx="70" cy="70" r="64" fill="none" stroke="var(--color-accent)" strokeWidth="8" strokeDasharray="402" strokeDashoffset="280" strokeLinecap="round" transform="rotate(-90 70 70)" />
                             </svg>
                             <div style={{ position: 'absolute', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>30%</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Done</div>
                             </div>
                          </div>
                        </div>
                      ) : (
                        <div className="roadmap-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
                          <h3 style={{ marginBottom: '0.5rem' }}>No personalized roadmap yet</h3>
                          <p style={{ marginBottom: '2rem' }}>Answer a few questions and let AI build your perfect path.</p>
                          <a href="/onboarding" className="btn btn-primary">Start Onboarding</a>
                        </div>
                      )}
                    </section>

                    {/* Explore More Section */}
                    <section>
                      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recommended for you</h2>
                      <div className="grid-roadmaps" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                        {recentRoadmaps.map(rm => (
                           <RoadmapCard key={rm.slug} roadmap={rm} />
                        ))}
                      </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   {/* Streak/Mini Stats */}
                   <div className="roadmap-card" style={{ padding: '2rem' }}>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Daily Consistency</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        {[...Array(7)].map((_, i) => (
                           <div key={i} style={{ width: 30, height: 30, borderRadius: 8, background: i < 3 ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <span style={{ fontSize: '0.6rem', color: i < 3 ? '#fff' : 'var(--color-text-muted)' }}>{['M','T','W','T','F','S','S'][i]}</span>
                           </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>🔥 <strong style={{color:'#fff'}}>3 Day Streak</strong></p>
                   </div>

                   {/* AI Library Snapshot */}
                   <div className="roadmap-card" style={{ padding: '2rem' }}>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Your Library</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <a href="/ai/library" style={{ display: 'flex', justifyContent: 'space-between', color: 'inherit', textDecoration: 'none', padding: '0.5rem', borderRadius: 8 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                           <span>Saved Courses</span>
                           <span style={{ opacity: 0.5 }}>4</span>
                         </a>
                         <a href="/ai/library" style={{ display: 'flex', justifyContent: 'space-between', color: 'inherit', textDecoration: 'none', padding: '0.5rem', borderRadius: 8 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                           <span>Quiz History</span>
                           <span style={{ opacity: 0.5 }}>12</span>
                         </a>
                      </div>
                   </div>

                   {/* Pro Banner */}
                   <div className="roadmap-card" style={{ background: 'linear-gradient(45deg, #1e3a8a 0%, #1e1b4b 100%)', padding: '2rem', border: 'none' }}>
                      <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Unlock Pro Features</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Get group roadmaps, expert-level paths, and ad-free learning.</p>
                      <button className="btn" style={{ background: '#fff', color: '#000', width: '100%', fontSize: '0.8125rem' }}>Upgrade Now</button>
                   </div>
                </aside>
            </div>
        </div>
    );
}
