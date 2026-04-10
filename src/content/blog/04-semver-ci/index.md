---
title: Setting up semantic version release in your GitHub repository
description: Utilising github actions to streamline your ci workflow for semantic versioning and releases.
date: 2026-04-01
tags:
  - github
  - ci/cd
---
I've been tinkering around nowadays with how I can reduce the amount of repeated manual setup required for certain things. One use-case that I've implemented is how you can make your software releases automatic, based on the changes that you commit. It's an interesting concept where the changes being introduced are handled by analyzing your commit messages and generating release notes along with a `changelog`.

So now, the big question is: **"How can you achieve the same?"**

To answer that question, I'll be walking you through the steps on how you can set up your own release CI using GitHub Actions.

The steps are as follows:

1. Identify what kind of package manager you use. Different package managers will have different configurations. I'll be providing examples for npm and pnpm, as I've set those up in two of my projects. 
   >_(trivia: one for this blog repo itself. )_

2. Create a `.releaserc.json` file in your root directory. This will be used to manage and install the packages and plugins required in the workflow.

For npm:
```js
{
  "branches": [
    "main",
    {
      "name": "next",
      "prerelease": true
    }
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json",
          "package-lock.json",
          "CHANGELOG.md"
        ],
        "message": "chore(release): ${nextRelease.version} \n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

For pnpm:
```js
{
  "branches": [
    "main",
    {
      "name": "next",
      "prerelease": true
    }
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@anolilab/semantic-release-pnpm",
      {
        "npmPublish": false
      }
    ],
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "pnpm install --no-frozen-lockfile"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json",
          "pnpm-lock.yaml",
          "CHANGELOG.md"
        ],
        "message": "chore(release): ${nextRelease.version} \n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

If we breakdown this config down we have
- This tells us on which branch we want our releases to be triggered.  
```js
"branches": [
    "main",
    {
      "name": "next",
      "prerelease": true
    }
],
```
- We have also a pre-releases config also which will be done on a `next` branch (if you decide to make it). This is achieved by this code block:
```js
{
  "name": "next",
  "prerelease": true
}
```

- After which we have the 'plugins' part:
```js
"plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json",
          "package-lock.json",
          "CHANGELOG.md"
        ],
        "message": "chore(release): ${nextRelease.version} \n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
```

- These plugins *(as per their names itself)* are used to analyze the commit messages and produce the release notes.
```js
"@semantic-release/commit-analyzer",
"@semantic-release/release-notes-generator",
```

- This plugin is used to generate a '**CHANGELOG.md**' which tracks your all your releases in one file in case you decide to go over them. You can change the name of the file according to you needs by replacing the text for the `changelogFile` field.
```js
[
  "@semantic-release/changelog",
  {
	"changelogFile": "CHANGELOG.md"
  }
]
```

- Used in case you decide to publish you packages to npm
```js
"@semantic-release/npm",
```

- Git plugin to 'what' to include in you releases *(assets field)* and what to write in the commit *(message field)*
```js
"@semantic-release/git",
  {
	"assets": [
	  "package.json",
	  "package-lock.json",
	  "CHANGELOG.md"
	],
	"message": "chore(release): ${nextRelease.version} \n\n${nextRelease.notes}"
      }
```

- Used to acutally publish the release and comment on released issues and/or issues being worked upon.
```js
"@semantic-release/github"
```

3. After creating the `.releaserc.json` file, create a `release.yaml` file in this location: `.github/workflows/release.yaml` _(create the `.github` folder if not present)_. This will serve as the source of truth for your GitHub Action, which will run on every commit.

For npm:
```yaml
name: Semantic Release

on:
  push:
    branches:
      - main
      - next
      - next-major
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  packages: write
  issues: write


jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm ci

      # Step 4: Run tests (optional but recommended)
      - name: Run tests
        run: npm run test --if-present

      # Step 5: Build the project
      - name: Build
        run: npm run build --if-present

      # Step 6: Run semantic-release
      - name: Release
        uses: cycjimmy/semantic-release-action@v5
        id: semantic
        with:
          semantic_version: 24
          extra_plugins: |
            @semantic-release/changelog@v6
            @semantic-release/git@v10
            @semantic-release/github@v12
          branches: |
            [
              '+([0-9])?(.{+([0-9]),x}).x',
              'main',
              'next',
              {name: 'next-major', prerelease: 'major'},
              {name: 'beta', prerelease: true},
              {name: 'alpha', prerelease: true}
            ]
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          RUNNER_DEBUG: 1

      - name: Output release info
        if: steps.semantic.outputs.new_release_published == 'true'
        run: |
          echo "Release Version: ${{ steps.semantic.outputs.new_release_version }}"
          echo "Release Published: ${{ steps.semantic.outputs.new_release_published }}"
          echo "Release Notes: ${{ steps.semantic.outputs.new_release_notes }}"

      # using vercel to deploy
      # - name: Deploy to production
      #   if: steps.semantic.outputs.new_release_published == 'true'
      #   run: npm run deploy --if-present
      #   env:
      #     DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

For pnpm:
```yaml
name: Semantic Release

on:
  push:
    branches:
      - main
      - next
      - next-major
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  packages: write
  issues: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: "10.30.3"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "pnpm"

      # Step 3: Install dependencies
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Step 4: Run semantic-release
      - name: Release
        uses: cycjimmy/semantic-release-action@v5
        id: semantic
        with:
          semantic_version: 24
          extra_plugins: |
            @semantic-release/changelog@v6
            @semantic-release/git@v10
            @semantic-release/github@v12
            @semantic-release/exec@v6
            @anolilab/semantic-release-pnpm@v5
          branches: |
            [
              '+([0-9])?(.{+([0-9]),x}).x',
              'main',
              'next',
              {name: 'next-major', prerelease: 'major'},
              {name: 'beta', prerelease: true},
              {name: 'alpha', prerelease: true}
            ]
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          RUNNER_DEBUG: 1

      - name: Output release info
        if: steps.semantic.outputs.new_release_published == 'true'
        run: |
          echo "Release Version: ${{ steps.semantic.outputs.new_release_version }}"
          echo "Release Published: ${{ steps.semantic.outputs.new_release_published }}"
          echo "Release Notes: ${{ steps.semantic.outputs.new_release_notes }}"

      # using vercel to deploy
      # - name: Deploy to production
      #   if: steps.semantic.outputs.new_release_published == 'true'
      #   run: npm run deploy --if-present
      #   env:
      #     DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

> By the time you're reading this, some packages may have newer versions, so kindly update them accordingly.

4. Enable this setting in your repository settings:
	  - Repo settings --> Actions --> General --> Scroll down to `Workflow Permissions` and select `Read and write permissions`. This will allow your GitHub Action runner to write comments on your PRs/issues about releases, and update the `CHANGELOG.md` file.

5. Now your workflow is ready to be tested. Push all your changes to your GitHub repository.
6. Open the `Actions` tab on GitHub to see the workflow running. Watch for any errors and debug as per the error messages.
7. Voila! Enjoy your seamless workflow!

---

Re-iterating _(in short)_ what the documentation says about how to write your commit messages: 

MAJOR.MINOR.PATCH

e.g., 2.0.6
1. MAJOR: Any breaking changes. The commit description must have the phrase "BREAKING CHANGE".
2. MINOR: For any feature release. Use the format "feat: your commit msg" to trigger a feature release.
3. PATCH: For any quick fixes. Use the format "fix: pipeline".

For a more detailed read about these, [refer here](https://github.com/semantic-release/semantic-release#commit-message-format).

Happy tinkering!
> If you get stuck on any step/error feel free to [contact](mailto:kumaranimesh923@gmail.com). I would love to help you out!