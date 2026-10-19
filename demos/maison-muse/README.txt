MAISON MUSE — WEBSITE FILES

GET STARTED
Extract the ZIP, then open index.html in your browser.
For the most reliable browser features, serve this folder locally:
  python3 -m http.server 8000
Then open http://localhost:8000
No installation or build step is required.

FILES
index.html — page structure and text
styles.css — responsive layout, colours and typography
config.js — studio name, service categories, prices and durations
app.js — treatment selection, calendar, demo booking and studio personalisation
assets/ — both generated editorial images used in the website

PERSONALISE
Use the Personalise this studio link in the footer to try a name,
colour palette and service combination. These changes apply only in
that browser. Edit config.js to change the defaults for all visitors.
Edit index.html for the remaining copy and styles.css for styling.

HOSTING
Upload index.html, styles.css, config.js, app.js and assets/ together
to your web hosting directory, retaining the relative folder structure.
This is a standalone static site. No account-specific deployment files,
credentials or Git history are included.
Google Fonts loads the Italiana and DM Sans fonts over the internet.
If unavailable, the website uses its built-in font fallbacks.

BOOKING STATUS
The booking flow uses sample prices and example opening hours.
It does not connect to a real salon diary, send emails or accept payment.
Saved demo visits and studio preferences remain in the current browser.
Names and email addresses entered in the demo are not stored or sent.
The exported calendar event is labelled as a demo.
Connect a live scheduling service/backend before accepting real bookings.
Aesthetics and filler entries are consultation-only examples.

VERIFICATION
JavaScript syntax, file references and booking logic were checked.
Browser-based visual verification was unavailable when this version was built.
