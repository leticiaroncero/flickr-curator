# Flickr Curator

A simple node application to create Flickr galleries with a list of Flickr URLs, either from your Chrome tabs or pasted in the console.

## Pre-requisites

* Install Homebrew (paste this in a macOS Terminal or Linux shell prompt:)
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

* In the terminal type the following command to install Node:
`brew install node`

## Setup

1. Download this repo. Two ways to do this:

    a) On Github, click download & uncompress.

    b) Clone the repo to your machine.

2. Open the Folder in your Terminal. Two ways to do this:

    a) Open the Terminal, and run this command: `cd flickr-curator`

    b) Right-click in the Folder > Services > New Terminal at Folder.

3. Execute `npm install` in your Terminal.

4. Add [your API keys](https://www.flickr.com/services/api/) to the `auth.js` file.

## How to use it

1. Navigate to the repo in your terminal. (#2 in the [Setup](#Setup) section above)
2. Run `node flickr-curator.js`
3. Follow the prompts!
