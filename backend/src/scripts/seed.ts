import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const roadmaps = [
  {
    slug: 'frontend',
    title: 'Frontend Developer',
    description: 'A comprehensive roadmap to become a modern frontend developer. Learn HTML, CSS, JavaScript, React and beyond.',
    category: 'role',
    icon: '🎨',
    estimated_weeks: 24,
    topic_count: 42,
    nodes: [
      { id: 'html', label: 'HTML', type: 'topic', position: { x: 400, y: 50 } },
      { id: 'css', label: 'CSS', type: 'topic', position: { x: 400, y: 150 } },
      { id: 'js', label: 'JavaScript', type: 'topic', position: { x: 400, y: 250 } },
      { id: 'dom', label: 'DOM Manipulation', type: 'topic', position: { x: 200, y: 350 } },
      { id: 'fetch', label: 'Fetch API / AJAX', type: 'topic', position: { x: 600, y: 350 } },
      { id: 'git', label: 'Git & GitHub', type: 'topic', position: { x: 400, y: 450 } },
      { id: 'npm', label: 'npm / Package Managers', type: 'topic', position: { x: 400, y: 550 } },
      { id: 'react', label: 'React', type: 'topic', position: { x: 400, y: 650 } },
      { id: 'hooks', label: 'React Hooks', type: 'topic', position: { x: 200, y: 750 } },
      { id: 'state', label: 'State Management', type: 'topic', position: { x: 600, y: 750 } },
      { id: 'typescript', label: 'TypeScript', type: 'topic', position: { x: 400, y: 850 } },
      { id: 'css-framework', label: 'CSS Framework (Tailwind)', type: 'topic', position: { x: 400, y: 950 } },
      { id: 'nextjs', label: 'Next.js', type: 'topic', position: { x: 400, y: 1050 } },
      { id: 'project-portfolio', label: 'Build Portfolio', type: 'project', position: { x: 400, y: 1150 } },
      { id: 'testing', label: 'Testing (Jest/Vitest)', type: 'topic', position: { x: 200, y: 1150 } },
      { id: 'performance', label: 'Web Performance', type: 'topic', position: { x: 600, y: 1150 } },
      { id: 'milestone-junior', label: 'Junior Frontend Ready', type: 'milestone', position: { x: 400, y: 1300 } },
    ],
    edges: [
      { id: 'e1', source: 'html', target: 'css' },
      { id: 'e2', source: 'css', target: 'js' },
      { id: 'e3', source: 'js', target: 'dom' },
      { id: 'e4', source: 'js', target: 'fetch' },
      { id: 'e5', source: 'dom', target: 'git' },
      { id: 'e6', source: 'fetch', target: 'git' },
      { id: 'e7', source: 'git', target: 'npm' },
      { id: 'e8', source: 'npm', target: 'react' },
      { id: 'e9', source: 'react', target: 'hooks' },
      { id: 'e10', source: 'react', target: 'state' },
      { id: 'e11', source: 'hooks', target: 'typescript' },
      { id: 'e12', source: 'state', target: 'typescript' },
      { id: 'e13', source: 'typescript', target: 'css-framework' },
      { id: 'e14', source: 'css-framework', target: 'nextjs' },
      { id: 'e15', source: 'nextjs', target: 'project-portfolio' },
      { id: 'e16', source: 'nextjs', target: 'testing' },
      { id: 'e17', source: 'nextjs', target: 'performance' },
      { id: 'e18', source: 'project-portfolio', target: 'milestone-junior' },
      { id: 'e19', source: 'testing', target: 'milestone-junior' },
      { id: 'e20', source: 'performance', target: 'milestone-junior' },
    ],
  },
  {
    slug: 'backend',
    title: 'Backend Developer',
    description: 'Master server-side development with Node.js, databases, REST APIs, and cloud deployment.',
    category: 'role',
    icon: '⚙️',
    estimated_weeks: 28,
    topic_count: 38,
    nodes: [
      { id: 'programming-lang', label: 'Pick a Language (Node.js)', type: 'topic', position: { x: 400, y: 50 } },
      { id: 'os-basics', label: 'OS Fundamentals & Linux CLI', type: 'topic', position: { x: 400, y: 150 } },
      { id: 'git-be', label: 'Version Control (Git)', type: 'topic', position: { x: 400, y: 250 } },
      { id: 'networking', label: 'HTTP & Networking Basics', type: 'topic', position: { x: 400, y: 350 } },
      { id: 'express', label: 'Express.js', type: 'topic', position: { x: 400, y: 450 } },
      { id: 'rest-api', label: 'REST API Design', type: 'topic', position: { x: 200, y: 550 } },
      { id: 'auth', label: 'Auth (JWT/OAuth)', type: 'topic', position: { x: 600, y: 550 } },
      { id: 'databases', label: 'Databases (SQL + NoSQL)', type: 'topic', position: { x: 400, y: 650 } },
      { id: 'postgresql', label: 'PostgreSQL', type: 'topic', position: { x: 200, y: 750 } },
      { id: 'redis', label: 'Redis & Caching', type: 'topic', position: { x: 600, y: 750 } },
      { id: 'project-api', label: 'Build a REST API Project', type: 'project', position: { x: 400, y: 850 } },
      { id: 'docker', label: 'Docker Basics', type: 'topic', position: { x: 400, y: 950 } },
      { id: 'testing-be', label: 'Testing APIs', type: 'topic', position: { x: 200, y: 1050 } },
      { id: 'security', label: 'Web Security Basics', type: 'topic', position: { x: 600, y: 1050 } },
      { id: 'deployment', label: 'Deploy to Cloud', type: 'topic', position: { x: 400, y: 1150 } },
      { id: 'milestone-backend', label: 'Junior Backend Ready', type: 'milestone', position: { x: 400, y: 1300 } },
    ],
    edges: [
      { id: 'e1', source: 'programming-lang', target: 'os-basics' },
      { id: 'e2', source: 'os-basics', target: 'git-be' },
      { id: 'e3', source: 'git-be', target: 'networking' },
      { id: 'e4', source: 'networking', target: 'express' },
      { id: 'e5', source: 'express', target: 'rest-api' },
      { id: 'e6', source: 'express', target: 'auth' },
      { id: 'e7', source: 'rest-api', target: 'databases' },
      { id: 'e8', source: 'auth', target: 'databases' },
      { id: 'e9', source: 'databases', target: 'postgresql' },
      { id: 'e10', source: 'databases', target: 'redis' },
      { id: 'e11', source: 'postgresql', target: 'project-api' },
      { id: 'e12', source: 'redis', target: 'project-api' },
      { id: 'e13', source: 'project-api', target: 'docker' },
      { id: 'e14', source: 'docker', target: 'testing-be' },
      { id: 'e15', source: 'docker', target: 'security' },
      { id: 'e16', source: 'testing-be', target: 'deployment' },
      { id: 'e17', source: 'security', target: 'deployment' },
      { id: 'e18', source: 'deployment', target: 'milestone-backend' },
    ],
  },
  {
    slug: 'devops',
    title: 'DevOps Engineer',
    description: 'Learn to automate, deploy, and scale infrastructure with Docker, Kubernetes, CI/CD pipelines, and cloud services.',
    category: 'role',
    icon: '🔧',
    estimated_weeks: 32,
    topic_count: 45,
    nodes: [
      { id: 'linux', label: 'Linux & Shell Scripting', type: 'topic', position: { x: 400, y: 50 } },
      { id: 'git-devops', label: 'Git & Version Control', type: 'topic', position: { x: 400, y: 150 } },
      { id: 'networking-devops', label: 'Networking Concepts', type: 'topic', position: { x: 400, y: 250 } },
      { id: 'docker', label: 'Docker', type: 'topic', position: { x: 400, y: 350 } },
      { id: 'docker-compose', label: 'Docker Compose', type: 'topic', position: { x: 200, y: 450 } },
      { id: 'ci-cd', label: 'CI/CD (GitHub Actions)', type: 'topic', position: { x: 600, y: 450 } },
      { id: 'kubernetes', label: 'Kubernetes', type: 'topic', position: { x: 400, y: 550 } },
      { id: 'cloud', label: 'Cloud (AWS/GCP/Azure)', type: 'topic', position: { x: 400, y: 650 } },
      { id: 'iac', label: 'IaC (Terraform)', type: 'topic', position: { x: 200, y: 750 } },
      { id: 'monitoring', label: 'Monitoring & Logging', type: 'topic', position: { x: 600, y: 750 } },
      { id: 'project-pipeline', label: 'Build a Full CI/CD Pipeline', type: 'project', position: { x: 400, y: 850 } },
      { id: 'security-devops', label: 'DevSecOps Basics', type: 'topic', position: { x: 400, y: 950 } },
      { id: 'milestone-devops', label: 'DevOps Engineer Ready', type: 'milestone', position: { x: 400, y: 1100 } },
    ],
    edges: [
      { id: 'e1', source: 'linux', target: 'git-devops' },
      { id: 'e2', source: 'git-devops', target: 'networking-devops' },
      { id: 'e3', source: 'networking-devops', target: 'docker' },
      { id: 'e4', source: 'docker', target: 'docker-compose' },
      { id: 'e5', source: 'docker', target: 'ci-cd' },
      { id: 'e6', source: 'docker-compose', target: 'kubernetes' },
      { id: 'e7', source: 'ci-cd', target: 'kubernetes' },
      { id: 'e8', source: 'kubernetes', target: 'cloud' },
      { id: 'e9', source: 'cloud', target: 'iac' },
      { id: 'e10', source: 'cloud', target: 'monitoring' },
      { id: 'e11', source: 'iac', target: 'project-pipeline' },
      { id: 'e12', source: 'monitoring', target: 'project-pipeline' },
      { id: 'e13', source: 'project-pipeline', target: 'security-devops' },
      { id: 'e14', source: 'security-devops', target: 'milestone-devops' },
    ],
  },
  {
    slug: 'python',
    title: 'Python Developer',
    description: 'Go from Python basics to building web APIs, data pipelines, and deploying ML models.',
    category: 'skill',
    icon: '🐍',
    estimated_weeks: 20,
    topic_count: 32,
    nodes: [
      { id: 'python-basics', label: 'Python Basics', type: 'topic', position: { x: 400, y: 50 } },
      { id: 'oop', label: 'OOP in Python', type: 'topic', position: { x: 400, y: 150 } },
      { id: 'data-structures', label: 'Data Structures & Algorithms', type: 'topic', position: { x: 400, y: 250 } },
      { id: 'file-io', label: 'File I/O & Exceptions', type: 'topic', position: { x: 200, y: 350 } },
      { id: 'libraries', label: 'Popular Libraries', type: 'topic', position: { x: 600, y: 350 } },
      { id: 'web-path', label: 'Web Dev Path: Django / FastAPI', type: 'topic', position: { x: 200, y: 500 } },
      { id: 'data-path', label: 'Data Path: NumPy, Pandas, Matplotlib', type: 'topic', position: { x: 600, y: 500 } },
      { id: 'databases-py', label: 'Databases (SQLAlchemy)', type: 'topic', position: { x: 200, y: 650 } },
      { id: 'ml-basics', label: 'ML Basics (scikit-learn)', type: 'topic', position: { x: 600, y: 650 } },
      { id: 'project-py', label: 'Build a Python Project', type: 'project', position: { x: 400, y: 800 } },
      { id: 'deployment-py', label: 'Deploy Python App', type: 'topic', position: { x: 400, y: 950 } },
      { id: 'milestone-python', label: 'Python Developer Ready', type: 'milestone', position: { x: 400, y: 1100 } },
    ],
    edges: [
      { id: 'e1', source: 'python-basics', target: 'oop' },
      { id: 'e2', source: 'oop', target: 'data-structures' },
      { id: 'e3', source: 'data-structures', target: 'file-io' },
      { id: 'e4', source: 'data-structures', target: 'libraries' },
      { id: 'e5', source: 'file-io', target: 'web-path' },
      { id: 'e6', source: 'libraries', target: 'data-path' },
      { id: 'e7', source: 'web-path', target: 'databases-py' },
      { id: 'e8', source: 'data-path', target: 'ml-basics' },
      { id: 'e9', source: 'databases-py', target: 'project-py' },
      { id: 'e10', source: 'ml-basics', target: 'project-py' },
      { id: 'e11', source: 'project-py', target: 'deployment-py' },
      { id: 'e12', source: 'deployment-py', target: 'milestone-python' },
    ],
  },
  {
    slug: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend to build complete web applications end-to-end.',
    category: 'role',
    icon: '🚀',
    estimated_weeks: 36,
    topic_count: 55,
    nodes: [
      { id: 'html-fs', label: 'HTML & CSS', type: 'topic', position: { x: 400, y: 50 } },
      { id: 'js-fs', label: 'JavaScript (ES6+)', type: 'topic', position: { x: 400, y: 150 } },
      { id: 'react-fs', label: 'React', type: 'topic', position: { x: 200, y: 300 } },
      { id: 'node-fs', label: 'Node.js', type: 'topic', position: { x: 600, y: 300 } },
      { id: 'ts-fs', label: 'TypeScript', type: 'topic', position: { x: 400, y: 400 } },
      { id: 'express-fs', label: 'Express.js / APIs', type: 'topic', position: { x: 400, y: 500 } },
      { id: 'database-fs', label: 'Database (PostgreSQL)', type: 'topic', position: { x: 400, y: 600 } },
      { id: 'auth-fs', label: 'Authentication (JWT/OAuth)', type: 'topic', position: { x: 400, y: 700 } },
      { id: 'project-fullstack', label: 'Build a Full Stack App', type: 'project', position: { x: 400, y: 850 } },
      { id: 'nextjs-fs', label: 'Next.js', type: 'topic', position: { x: 200, y: 950 } },
      { id: 'docker-fs', label: 'Docker & Deployment', type: 'topic', position: { x: 600, y: 950 } },
      { id: 'testing-fs', label: 'Testing (Frontend + Backend)', type: 'topic', position: { x: 400, y: 1050 } },
      { id: 'milestone-fullstack', label: 'Full Stack Developer Ready', type: 'milestone', position: { x: 400, y: 1200 } },
    ],
    edges: [
      { id: 'e1', source: 'html-fs', target: 'js-fs' },
      { id: 'e2', source: 'js-fs', target: 'react-fs' },
      { id: 'e3', source: 'js-fs', target: 'node-fs' },
      { id: 'e4', source: 'react-fs', target: 'ts-fs' },
      { id: 'e5', source: 'node-fs', target: 'ts-fs' },
      { id: 'e6', source: 'ts-fs', target: 'express-fs' },
      { id: 'e7', source: 'express-fs', target: 'database-fs' },
      { id: 'e8', source: 'database-fs', target: 'auth-fs' },
      { id: 'e9', source: 'auth-fs', target: 'project-fullstack' },
      { id: 'e10', source: 'project-fullstack', target: 'nextjs-fs' },
      { id: 'e11', source: 'project-fullstack', target: 'docker-fs' },
      { id: 'e12', source: 'nextjs-fs', target: 'testing-fs' },
      { id: 'e13', source: 'docker-fs', target: 'testing-fs' },
      { id: 'e14', source: 'testing-fs', target: 'milestone-fullstack' },
    ],
  },
];

const projects = [
  { roadmap_slug: 'frontend', title: 'Personal Portfolio Website', description: 'Build a portfolio showcasing your projects with responsive design, dark mode, and animations.', difficulty: 'beginner', tags: ['HTML', 'CSS', 'JavaScript'] },
  { roadmap_slug: 'frontend', title: 'React Task Manager', description: 'A full-featured task manager with drag-and-drop, filtering, and localStorage persistence.', difficulty: 'intermediate', tags: ['React', 'TypeScript', 'Tailwind'] },
  { roadmap_slug: 'frontend', title: 'Real-time Chat UI', description: 'Build a chat interface with WebSocket integration, emoji support, and message reactions.', difficulty: 'advanced', tags: ['React', 'WebSockets', 'Next.js'] },
  { roadmap_slug: 'backend', title: 'REST API for a Blog', description: 'Build a complete blog API with CRUD, pagination, auth, and rate limiting.', difficulty: 'beginner', tags: ['Node.js', 'Express', 'PostgreSQL'] },
  { roadmap_slug: 'backend', title: 'URL Shortener Service', description: 'Create a URL shortener with analytics, custom slugs, and expiry.', difficulty: 'intermediate', tags: ['Node.js', 'Redis', 'PostgreSQL'] },
  { roadmap_slug: 'backend', title: 'Microservices E-commerce Backend', description: 'Build a microservices architecture with order, inventory, and payment services.', difficulty: 'advanced', tags: ['Node.js', 'Docker', 'RabbitMQ'] },
  { roadmap_slug: 'devops', title: 'Dockerize a Node.js App', description: 'Containerize a full-stack app with Docker Compose, including app, database, and reverse proxy.', difficulty: 'beginner', tags: ['Docker', 'Nginx'] },
  { roadmap_slug: 'devops', title: 'CI/CD with GitHub Actions', description: 'Set up automated testing, building, and deployment pipeline for a Node.js app.', difficulty: 'intermediate', tags: ['GitHub Actions', 'Docker', 'AWS'] },
  { roadmap_slug: 'python', title: 'Web Scraper with Python', description: 'Build a concurrent web scraper with rate limiting and CSV export.', difficulty: 'beginner', tags: ['Python', 'BeautifulSoup', 'asyncio'] },
  { roadmap_slug: 'python', title: 'FastAPI REST API', description: 'Create a production-ready FastAPI app with auth, tests, and PostgreSQL.', difficulty: 'intermediate', tags: ['FastAPI', 'Python', 'PostgreSQL'] },
  { roadmap_slug: 'fullstack', title: 'Full Stack Blog Platform', description: 'Complete blog with Next.js frontend, Node.js API, PostgreSQL, and Stripe subscriptions.', difficulty: 'advanced', tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'] },
];

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Seed pre-built roadmaps
  console.log('📍 Seeding roadmaps...');
  for (const roadmap of roadmaps) {
    const { error } = await supabase
      .from('prebuilt_roadmaps')
      .upsert(roadmap, { onConflict: 'slug' });

    if (error) {
      console.error(`  ❌ Failed to seed ${roadmap.slug}:`, error.message);
    } else {
      console.log(`  ✅ ${roadmap.title}`);
    }
  }

  // Seed projects
  console.log('\n🔨 Seeding projects...');
  const { error: projectError } = await supabase
    .from('roadmap_projects')
    .upsert(projects, { onConflict: 'roadmap_slug, title' } as any);

  if (projectError) {
    console.error('  ❌ Failed to seed projects:', projectError.message);
  } else {
    console.log(`  ✅ ${projects.length} projects seeded`);
  }

  console.log('\n✨ Seed complete!');
}

seed().catch(console.error);
