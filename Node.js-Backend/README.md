Node.js-Backend/
└── index.js

What We've Done

- Setup Express server
- Created POST route `/api/generate-plan`
- Forwards request to Flask
- Returns Flask response to React

1-Initialize a Node project
npm init -y

2-Install required packages
npm install express cors node-fetch@2

3-Run the server
node index.js