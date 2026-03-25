# Skill Exchange

A front-end skill-sharing platform where users can teach what they know, learn new skills, and connect through exchange requests.

## Features

- User authentication (signup/login) with localStorage
- Skill discovery and category-based filtering
- AI-style skill matching based on teach/learn overlap
- Exchange request flow (incoming, sent, accepted)
- Personalized dashboard with stats and progress bars
- Profile pages with achievements and skill tags
- Community area with challenges, leaderboard, and discussions
- Light/Dark theme toggle

## Project Structure

- `index.html` – Landing page
- `login.html` – Login and signup
- `explore.html` – Browse skills and users
- `match.html` – Suggested matches
- `requests.html` – Manage exchange requests
- `dashboard.html` – User dashboard
- `profile.html` – User profile
- `community.html` – Challenges, leaderboard, discussions
- `css/styles.css` – All app styling
- `js/script.js` – Core app logic and localStorage data handling

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Browser `localStorage` for persistence

## Run Locally

Because this is a static front-end app, no build step is required.

1. Open the project folder.
2. Launch `index.html` in your browser.

> Tip: For best navigation behavior, run with a local static server (for example, VS Code Live Server).

## Demo Login

Use any seeded user email with password `pass123`.

Examples:
- `alex@example.com`
- `priya@example.com`
- `sofia@example.com`

## Data Storage

All app data is stored in the browser under localStorage keys like:

- `se_users`
- `se_current_user`
- `se_requests`
- `se_challenges`
- `se_discussions`
- `se_notifications`
- `se_theme`

To reset demo data, clear localStorage in your browser dev tools.
