# Publishing to npm

This repository is set up with a GitHub Actions workflow to automate the process of publishing to npm and creating GitHub releases.

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

## Automated Release Workflows

The repository uses two separate workflows for release-related tasks:

### Release Workflow

This workflow handles version checking, publishing to npm, and creating GitHub releases for the main branch.

- **File**: `.github/workflows/release.yml`
- **Trigger**: Automatically when package.json is modified on the main branch

When the version in package.json is updated on the main branch:

1. The workflow checks if the version already exists as a tag
   - If the version already exists, the workflow stops
   - If the version is new, the workflow continues
2. The package is built
3. A Git tag is created for the version
4. The package is published to npm
5. A GitHub release is created

### Prerelease Workflow

This workflow handles building and publishing prereleases for non-main branches.

- **File**: `.github/workflows/prerelease.yml`
- **Trigger**: Automatically when package.json is modified on any branch except main

When package.json is modified on any branch other than main:

1. The package is built
2. A prerelease version is generated using the branch name and a timestamp
3. The package is published to npm with the "next" tag
4. A Git tag is created for the prerelease version
5. A GitHub release is created and marked as a prerelease

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
