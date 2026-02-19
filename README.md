# Mitchell Christian Assembly

Church website for **Mitchell Christian Assembly** in Mitchell, Manitoba. Built with React, Vite, and Bootstrap.

## Features

- **Home** – Hero section with scripture (Romans 5:8), service times, upcoming events, ministries overview, and giving CTA
- **Events** – Upcoming events carousel and monthly calendar
- **Ministries** – Sunday School, Gospel Meetings, Bible Study & Prayer, Missionary Support
- **Audio Downloads** – Sermon and Bible teaching recordings
- **About** – Assembly history, beliefs, and missionary info
- **Giving** – Information and links for donations
- **Contact** – Contact form and assembly location (Mitchell, MB)
- **Admin Panel** – Protected dashboard to manage events, ministries, sermons, services, staff, content, site settings, and 9 selectable color themes

## Tech Stack

- **Frontend:** React 19, React Router, React Bootstrap, React Icons
- **Styling:** Bootstrap 5, custom CSS variables with 9 selectable color themes, Inter font
- **Build:** Vite
- **Backend API:** Serverless functions (Vercel) backed by GitHub as a JSON data store
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server (API + Vite)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  components/    # Navbar, Footer
  contexts/      # Auth, Theme
  layouts/       # Admin, Public
  pages/         # Public pages + admin/
  services/      # API helpers
api/             # Vercel serverless functions
db/              # JSON data files
public/data/     # Static fallback data
```
