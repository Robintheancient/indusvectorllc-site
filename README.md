# indusvectorllc.com

Static website for Indus Vector LLC. Plain HTML and CSS: no WordPress, no build step, no database.

**Hosting:** Amazon S3 (private bucket) → CloudFront (HTTPS, CDN) → Route 53 DNS.
**Deploys:** every push to `main` that changes `site/` runs `.github/workflows/deploy.yml`. It gets short-lived AWS credentials through GitHub OIDC (no stored keys), syncs `site/` to S3, and refreshes CloudFront.

## Layout

| Path | What |
| --- | --- |
| `site/` | The website. Each page is `folder/index.html` so URLs match the old WordPress URLs |
| `site/css/style.css` | All styles |
| `site/images/` | Images (see `site/images/README.md` for the files to copy from the WordPress backup) |
| `infra/cloudfront-function.js` | Viewer-request function: www → apex redirect, `/path/` → `/path/index.html`, old-URL redirects |
| `infra/*.json` | IAM trust policy, deploy permissions, S3 bucket policy (fill in account and distribution IDs) |
| `.github/workflows/deploy.yml` | Deploy to S3 + CloudFront |

## Edit the site

1. Edit the HTML file for the page (e.g. `site/about/index.html`).
2. Preview locally: `python -m http.server 8000 --directory site`, then open http://localhost:8000.
3. Commit and push to `main` (or open a pull request). The deploy runs automatically.

## Placeholders to fill in

- **Phone:** search for `PHONE:` in `site/` (footer on every page and the Contact page) and uncomment the line.
- **Contact form:** Formspree form `mgakqdrl`; change the recipient in the Formspree dashboard.
- **Images:** copy the files listed in `site/images/README.md`.

## Turn on deploys (one time, in AWS + GitHub)

1. AWS IAM → Identity providers → add OpenID Connect provider `https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com`.
2. Create role `github-deploy-indusvector` with trust policy `infra/github-oidc-trust-policy.json` and inline policy `infra/github-deploy-permissions.json` (replace the placeholders). Only the `main` branch of this repo can assume it.
3. In this repo: Settings → Secrets and variables → Actions → **Variables**: add `AWS_DEPLOY_ROLE_ARN` and `CF_DISTRIBUTION_ID`.

Until those variables exist, the deploy job is skipped.
