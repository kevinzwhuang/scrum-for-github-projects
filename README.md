# Scrum for GitHub Projects

Scrum for GitHub Projects is a tool that helps automate calculation tasks needed to manage and monitor Scrum projects.

## Installation
---

Scrum for GitHub Projects is not available on Chrome webstore yet! I will be publishing on the Chrome webstore soon, so stay tuned for it.

For now, you can install the extension by cloning this repo and loading the `scrum-for-github-projects` repo folder as an [unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked).

Once installed, Scrum for GitHub Projects will automatically be active whenever you navigate to a GitHub project.

## Usage
---

### Card Titles
Scrum for GitHub Projects works by looking for estimation and consumption points at the beginning and end of card titles by using the following notation:

Estimation points = The number inside of parenthesis at the beginning of the card title
`.5` is the amount of estimation points set for `(.5) Start README.md [.2]`.

Consumption points = The number inside of square brackets at the end of the card title
`.2` is the amount of consumption points set for `(.5) Start README.md [.2]`

If an estimation point or consumption point is not detected on the card title, it's skipped for purposes of summing the point totals.

### Column Headers & Point Totals

Column headers have total estimation points in red surrounded by parentheses and total consumption points in green surrounded by square brackets.

Whenever cards a moved across columns or deleted, the point total for the column is recalculated and reflected on the point total on the column header.

## Prior Art
---

Scrum for GitHub Projects is inspired by [Scrum for Trello](https://github.com/Q42/TrelloScrum), which is a Chrome extension for adding Scrum to Trello projects. This project was born out of the lack of a similar Scrum extension for GitHub Projects.
