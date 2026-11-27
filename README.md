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
| `infra/site-stack.yaml` | CloudFormation: private S3 bucket, CloudFront + OAC, security headers, URL-rewrite function, GitHub OIDC deploy role |
| `.github/workflows/deploy.yml` | Deploy to S3 + CloudFront |

## Edit the site

1. Edit the HTML file for the page (e.g. `site/about/index.html`).
2. Preview locally: `python -m http.server 8000 --directory site`, then open http://localhost:8000.
3. Commit and push to `main` (or open a pull request). The deploy runs automatically.

## Placeholders to fill in

- **Phone:** search for `PHONE:` in `site/` (footer on every page and the Contact page) and uncomment the line.
- **Contact form:** Formspree form `mgakqdrl`; change the recipient in the Formspree dashboard.
- **Images:** already in `site/images/` (web-sized). Add new ones there.

## AWS setup (one time)

1. CloudFormation (region **us-east-1**) → Create stack → upload `infra/site-stack.yaml`, stack name `indusvectorllc-site`.
   Leave `CertificateArn` empty on the first launch. If the account already has the GitHub identity provider, set `CreateGitHubOIDCProvider` to `false`.
2. Open the `TestUrl` output to check the site (after the first deploy).
3. In this repo: Settings → Secrets and variables → Actions → **Variables**: add `AWS_DEPLOY_ROLE_ARN` and `CF_DISTRIBUTION_ID` from the stack outputs.
4. Later, for the real domain: request an ACM certificate in us-east-1 for the domain and `www`, then update the stack with its ARN in `CertificateArn`.

Until the repo variables exist, the deploy job is skipped. Only the `main` branch of this repo can assume the deploy role.
