# Version Control with Git

Version control tracks changes to code over time, enabling collaboration and the ability to roll back mistakes. **Git** is the industry-standard version control system.

## Core Git Concepts

- **Repository (repo)** — The project directory tracked by Git
- **Commit** — A snapshot of your project at a point in time
- **Branch** — An independent line of development
- **Merge** — Combining changes from different branches
- **Remote** — A copy of the repo hosted online (GitHub, GitLab, etc.)

## Essential Commands

```bash
# Initialize & clone
git init
git clone https://github.com/user/repo.git

# Stage and commit changes
git add .
git commit -m "feat: add login form"

# Branches
git checkout -b feature/navbar
git merge main

# Remote syncing
git push origin main
git pull origin main

# View history
git log --oneline --graph
git diff HEAD~1
```

## Branching Workflows

### Feature Branch Workflow
```
main ─── hotfix-101
  └─── develop ─── feature/auth
                └─── feature/dashboard
```

## Commit Message Convention (Conventional Commits)

```
feat: add user authentication
fix: resolve navbar overflow issue
docs: update API documentation
style: format with prettier
refactor: extract useAuth hook
test: add unit tests for utils
chore: upgrade dependencies
```

## Resources

- [Pro Git Book — Free](https://git-scm.com/book/en/v2)
- [Learn Git Branching — Interactive](https://learngitbranching.js.org/)
- [The Conventional Commits Specification](https://www.conventionalcommits.org/)
