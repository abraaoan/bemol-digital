# Bemol Digital challenger
[Live example](http://api.abraaoan.com:8188/)  

I did an application using node express as API and serving a Vue application.  
Basically we have a login View, a register and a Home.  
To acess home first you have to create a user in Register page and then loggin.

## Setup
You'll need a node, npm and pm2.  
[Downloading and installing Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
[Donwloading and installing PM2](https://pm2.io/docs/runtime/guide/installation/)  

#### Steps to setup
1. First in the main folder run `npm install`  to install all the API dependency.
2. Second step is enter in front-end/ and the run the command `npm run build` to create the Applicaiton.
3. And then to test just run the command `npm run dev`
4. In your browser open `http://localhost:8188/` to see the Application
5. In your browser open `http://localhost:8188/hello` to see an example of the API

#### Deploy
Unfortunally it's impossible to deploy outside my enviroment for secury reason.  
But with you have acess, just run the command `PM2 deploy production`

## Code Architecture
Overview how the micro service is structure.  
![plot](./assets/CodeSystem.jpeg)

## Project Architecture
Macro view how everything works.
![plot](./assets/system.jpeg)


That's It.  
Thank you!
