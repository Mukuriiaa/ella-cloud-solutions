# CMS User Manual

This website does not use a traditional CMS dashboard. Authorized users update the site by editing the HTML files in this repository and then publishing the changes through GitHub Pages.

## What you can safely edit

- Page text and headings in `index.html`, `about.html`, `cloud-services.html`, `equipment.html`, `it-support.html`, and `contact.html`
- Contact details such as phone numbers, email addresses, and office location
- Service descriptions, team/about copy, and footer links
- Image or video references, as long as the replacement file is added to the repo

## How to edit basic content

1. Open the website files in VS Code.
2. Find the section you want to change by searching for the visible text on the page.
3. Edit only the content you need.
4. Save the file.
5. Preview the page locally if needed.

## Publishing changes to the live site

1. Save your changes.
2. Run `git status` to confirm the files you changed.
3. Stage and commit your changes.
4. Push to the `main` branch.
5. Wait for GitHub Pages to rebuild the live site.

Example:

```bash
git add .
git commit -m "Update website content"
git push origin main
```

## Important notes

- Do not edit backend files unless you are updating contact form behavior or database settings.
- Keep the wording consistent with the rest of the site.
- If you change a file name, update any links pointing to it.
- If the live site does not update, check the GitHub Pages deployment settings in the repository.

## Recommended workflow for next-week edits

- Make one section of changes at a time.
- Review the page in a browser before publishing.
- Commit each finished set of edits with a clear message.