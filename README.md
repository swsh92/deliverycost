Requires Node installed (a Node install also installs npm package manager)

First do `npm install ` to install required packages

`npm test` will run the Jest tests

`npm start` will spin up the http-server to serve the ./public directory on localhost:8080

Important note about the webserver: If you change any files and aren't getting the updates reflected in your browser, do a hard refresh (ctrl f5) since it seems to cache the content, or try stopping and restarting the server in the terminal (ctrl + c) followed by a hard refresh in the browser.
