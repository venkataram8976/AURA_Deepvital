# AURA Frontend — GitHub Pages

## Publish
This is a static HTML/CSS/JavaScript site. Keep `index.html`, `css/`, `js/`, and `assets/` directly in the repository root. Do not upload the whole project folder as a nested folder.

1. Upload the **contents** of this folder to the root of your GitHub repository.
2. Keep `.github/workflows/pages.yml` in place.
3. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
4. Push to the `main` branch (or use **Actions → Deploy AURA to GitHub Pages → Run workflow**).
5. Open the URL shown in the successful `deploy` job.

## Local preview
Open the folder in VS Code and use Live Server on `index.html`.

## Demo account behavior
Registration/login use browser `localStorage` only. Browser storage is isolated by origin, so an account created on `localhost` does not exist on the GitHub Pages domain. Register again on the deployed site when testing.

This localStorage login is for a frontend demonstration only. It stores demo credentials in the browser and is not secure production authentication. GitHub Pages cannot run backend APIs, databases, or server-side authentication. A real deployment needs a separately hosted backend/auth provider.

## Troubleshooting
- If the root URL returns 404, confirm `index.html` is at the repository root and Pages is configured to use GitHub Actions.
- If the site is under a repository path, keep all local links and asset paths relative (for example `css/base.css`, not `/css/base.css`).


## Recent UI updates
- The home-page **Get Started** button now scrolls to the Rewards & Value section instead of opening Login.
- Home recommendations and property/collaboration cards open detail dialogs with expanded demo information.
- Franchise and collaboration filters work independently by keyword, city and category; franchise cards also support an investment-range filter.
- Upload forms validate required fields and save clearly labelled local drafts only. They do not publish or transmit submissions.
- Nearby stores requests high-accuracy browser geolocation (`enableHighAccuracy`) after the user presses Allow Location, displays the browser-reported accuracy, sorts listings by straight-line distance, and provides a manual city fallback.

## Location accuracy
Geolocation accuracy depends on the device, operating-system location services, browser permissions, GPS/Wi-Fi availability and the reported accuracy radius. A desktop browser may provide an approximate location rather than GPS-level precision. On GitHub Pages, use the site controls beside the address bar → Site settings → Location → Allow, then retry.

## Demo limitations
The partner directory, franchise listings, authentication, rewards and saved drafts are frontend demonstration data stored in the browser. The site does not currently have a connected database or submission API. Do not enter real passwords or confidential information. Real submissions and secure authentication require a separately hosted backend or authentication provider.
