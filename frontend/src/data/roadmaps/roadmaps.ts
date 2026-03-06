/** Roadmap data used across the site */
export interface Roadmap {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'role' | 'skill' | 'best-practice' | 'project';
    contributors: number;
    isNew?: boolean;
    isUpdated?: boolean;
}

export const roadmaps: Roadmap[] = [
    // Role-based
    { id: 'frontend', title: 'Frontend Developer', description: 'Step by step guide to becoming a modern frontend developer.', icon: '🌐', category: 'role', contributors: 420 },
    { id: 'backend', title: 'Backend Developer', description: 'Step by step guide to becoming a backend developer in 2024.', icon: '⚙️', category: 'role', contributors: 380 },
    { id: 'devops', title: 'DevOps Engineer', description: 'Step by step guide for DevOps, SRE or any other Operations Role.', icon: '🚀', category: 'role', contributors: 310 },
    { id: 'full-stack', title: 'Full Stack Developer', description: 'Step by step guide to becoming a full stack web developer.', icon: '💻', category: 'role', contributors: 295 },
    { id: 'android', title: 'Android Developer', description: 'Step by step guide to becoming an Android developer.', icon: '📱', category: 'role', contributors: 188, isUpdated: true },
    { id: 'ios', title: 'iOS Developer', description: 'Step by step guide to becoming an iOS developer.', icon: '🍎', category: 'role', contributors: 172 },
    { id: 'ai-data-scientist', title: 'AI & Data Scientist', description: 'Step by step guide to becoming an AI/ML engineer.', icon: '🤖', category: 'role', contributors: 264, isNew: true },
    { id: 'qa', title: 'QA Engineer', description: 'Step by step guide to becoming a QA engineer.', icon: '🧪', category: 'role', contributors: 143 },

    // Skill-based
    { id: 'react', title: 'React', description: 'Step by step guide to learn React in 2024.', icon: '⚛️', category: 'skill', contributors: 350, isUpdated: true },
    { id: 'vue', title: 'Vue', description: 'Step by step guide to learn Vue in 2024.', icon: '💚', category: 'skill', contributors: 201 },
    { id: 'angular', title: 'Angular', description: 'Step by step guide to learn Angular in 2024.', icon: '🔺', category: 'skill', contributors: 178 },
    { id: 'nodejs', title: 'Node.js', description: 'Step by step guide to learn Node.js in 2024.', icon: '🟢', category: 'skill', contributors: 289 },
    { id: 'python', title: 'Python', description: 'Step by step guide to learn Python in 2024.', icon: '🐍', category: 'skill', contributors: 312 },
    { id: 'typescript', title: 'TypeScript', description: 'Step by step guide to learn TypeScript in 2024.', icon: '🔷', category: 'skill', contributors: 234 },
    { id: 'docker', title: 'Docker', description: 'Step by step guide to learn Docker.', icon: '🐳', category: 'skill', contributors: 198 },
    { id: 'kubernetes', title: 'Kubernetes', description: 'Step by step guide to learn Kubernetes.', icon: '☸️', category: 'skill', contributors: 156 },

    // Best Practices
    { id: 'api-security', title: 'API Security', description: 'Common API security pitfalls and how to avoid them.', icon: '🔐', category: 'best-practice', contributors: 127 },
    { id: 'aws', title: 'AWS Best Practices', description: 'Best practices for using AWS in production.', icon: '☁️', category: 'best-practice', contributors: 98 },
    { id: 'backend-perf', title: 'Backend Performance', description: 'How to identify and fix backend performance issues.', icon: '⚡', category: 'best-practice', contributors: 112 },
    { id: 'code-review', title: 'Code Review', description: 'What to look for in a code review.', icon: '👁️', category: 'best-practice', contributors: 89 },

    // Project Ideas
    { id: 'projects-frontend', title: 'Frontend Projects', description: 'Beginner to advanced frontend project ideas to enhance your skills.', icon: '🎨', category: 'project', contributors: 74 },
    { id: 'projects-backend', title: 'Backend Projects', description: 'Beginner to advanced backend project ideas to enhance your skills.', icon: '🛠️', category: 'project', contributors: 68 },
];

export const getRoadmapsByCategory = (category: Roadmap['category']) =>
    roadmaps.filter(r => r.category === category);
