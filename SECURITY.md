# Security Policy

## Supported versions

Only the latest commit on the `main` branch is supported. Fixes are not backported.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report them privately through GitHub's
[private vulnerability reporting](https://github.com/Charannsai/finelikewine/security/advisories/new)
for this repository. Include what you found, the steps to reproduce it, and the impact you expect.

You can expect an acknowledgement within a few days. Once the issue is confirmed and fixed, you will be
credited in the release notes unless you would rather stay anonymous.

## Scope

FineLikeWine is a set of client-side UI components and a static demo site. The components themselves
send no data anywhere: the Dropzone component reads only file names and sizes in the browser. The
hosted demo site uses Vercel Web Analytics to count page views; it sets no cookies. Issues in Next.js,
React, Tailwind or Vercel Analytics themselves should be reported to those projects.
