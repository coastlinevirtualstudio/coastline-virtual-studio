PLATINUM JETS — WEBSITE FILES

GET STARTED
Extract the ZIP, then open index.html in your browser.
For the most reliable browser features (it uses JavaScript modules), serve
this folder locally rather than double-clicking index.html:
  python3 -m http.server 8000
Then open http://localhost:8000
No installation or build step is required.

FILES
index.html — page shell, header, footer and routing mount point
styles.css — responsive layout, colours and typography
app.js — client-side router, journey planner, aircraft catalogue and booking demo
data.js — the 16-airport dataset, six-aircraft fleet and five destination stories
assets/ — self-hosted fonts and imagery (hero, helicopter, cabin and destination shots)

EXPERIENCE
One-way, return and up to four-leg journeys across a curated 16-airport
dataset. Six illustrative aircraft with search, filtering, a three-way
comparison, favourites and detail pages. Simplified distance, capacity and
range matching, with illustrative fixed-rate estimates shown in GBP, EUR or
USD. Five destination stories with prefilled routes, an "our approach" page
and FAQs.

PERSONALISE
There is no personalisation panel on this demo — edit data.js to change the
aircraft, airports or destination copy, and index.html/app.js for the
remaining structure and behaviour.

HOSTING
Upload index.html, styles.css, app.js, data.js and assets/ together to your
web hosting directory, retaining the relative folder structure. This is a
standalone static site — no build step, API keys or Git history are needed.
Fonts are self-hosted (no external font request).

BOOKING STATUS
Enquiries, saved journeys, favourites and preferences are simulated. Nothing
is sent to a real booking system, no email is sent and no payment is taken.
Saved records use this browser's local storage only; "Reset Demo" clears
them. Exported itineraries are a local text file, not a real travel document.
Aircraft characteristics, costs, currencies, imagery and availability are
illustrative — generated images are not photographs of the named aircraft,
and no feasibility assessment is represented.

VERIFICATION
Calculation and validation unit tests pass (see the original package's
tests/ folder, not included in this copy). Desktop and 390px layouts were
inspected; journey search, capacity filtering, comparison, enquiry
confirmation, return trips and saved-itinerary persistence were checked.
Physical-device and Lighthouse audits have not been performed.
