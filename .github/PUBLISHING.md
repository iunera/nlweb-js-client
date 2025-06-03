# Publishing to npm

This repository is set up with GitHub Actions workflows to automate the process of publishing to npm and creating GitHub releases.

## Required GitHub Secrets

For the publishing workflow to function properly, you need to set up the following GitHub secret:

### NPM_TOKEN

This token is used to authenticate with npm when publishing the package.

To create and add this secret:

1. **Generate an npm Access Token**:
   - Log in to your npm account at [npmjs.com](https://www.npmjs.com/)
   - Go to your profile settings
   - Select "Access Tokens"
   - Click "Generate New Token"
   - Select the "Automation" token type (which has publish permissions)
   - Copy the generated token

2. **Add the Token to GitHub Secrets**:
   - Go to your GitHub repository
   - Click on "Settings"
   - Select "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste the npm token you generated
   - Click "Add secret"

## Workflows

### 1. Version Bump and Tag

This workflow allows you to bump the version in package.json and create a git tag.

- **Trigger**: Manual (workflow_dispatch)
- **Options**: patch, minor, major version bump
- **File**: `.github/workflows/version-bump.yml`

### 2. Publish Package to NPM and Create GitHub Release

This workflow publishes the package to npm and creates a GitHub release.

- **Trigger**: Automatically when a tag matching the pattern 'v*' is pushed
- **File**: `.github/workflows/publish.yml`

## Manual Publishing

If you prefer to publish manually, you can follow these steps:

```bash
# Make sure you're logged in to npm
npm login

# Build the package
npm run build

# Publish to npm
npm publish
```

For more detailed information, refer to the "Publishing to npm" section in the README.md file.