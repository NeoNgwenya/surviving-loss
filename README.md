# Surviving Loss

Responsive event landing page, built with HTML and CSS using the original event artwork.

Run `node server.js`, then open http://localhost:3000. No dependencies or installation step required. Run `node --check server.js` to check the preview server syntax. If npm is available, `npm run dev` and `npm run check` are also supported.

Publish `index.html`, `styles.css`, and `images/` on a static web host. The Node server is for local preview only. Fonts load from Google Fonts with local fallbacks. Speaker portraits use CSS positioning of the original event poster.

Ticket buttons open a WhatsApp enquiry to Topsy; telephone links initiate a call. No online payment or booking backend is included. Event details are transcribed from the supplied posters.

Development branch: `feature/dev`.
