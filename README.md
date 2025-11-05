You're going to build AI agents and hook them up to Telex.im. We want to see how you design intelligent systems, handle integrations, and structure your code.
Getting Access to Telex.im
You need access to the Telex organisation first.
Run this command: /telex-invite your-email@example.com  (same way you make submissions)
Swap in your actual email. You'll get added to the organisation and can start testing.
What You're Building
Create an AI agent that does something useful. Pick a task, solve a problem, help users.
Ideas:
Code helper that assists developers on Telex
Task tracker that reminds people about their projects
Bot that summarises data or automates chat responses
Build it. Connect it to Telex.im. Make it talk to users on the platform.
Technical Requirements
TypeScript / JavaScript Developers:
You're required to use Mastra. This isn't optional.
What you need to do:
Set up a Mastra agent
Define what it does and how it behaves
Connect it to Telex.im using the A2A protocol with proper JSON formatting
To view the interactions with your agents go to https://api.telex.im/agent-logs/{channel-id}.txt
The channel-id is the first UUID on the address bar https://telex.im/telex-im/home/colleagues/01989dec-0d08-71ee-9017-00e4556e1942/01989dec-01be-71ee-a273-7744838298d6
Example
https://api.telex.im/agent-logs/01989dec-0d08-71ee-9017-00e4556e1942.txt
Note on workflow JSON: For node positions in your workflow, use any positive integers. Example:
"position": [
  816,
  -112  // any integer works
]
SAMPLE WORKFLOW JSON
 
 {
   "active": false,
   "category": "utilities",
   "description": "A workflow that gives weather information",
   "id": "sGC3u7y4vBaZww0G",
   "long_description": "\n      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.\n\n      Your primary function is to help users get weather details for specific locations. When responding:\n      - Always ask for a location if none is provided\n      - If the location name isn't in English, please translate it\n      - If giving a location with multiple parts (e.g. \"New York, NY\"), use the most relevant part (e.g. \"New York\")\n      - Include relevant details like humidity, wind conditions, and precipitation\n      - Keep responses concise but informative\n      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.\n      - If the user asks for activities, respond in the format they request.\n\n      Use the weatherTool to fetch current weather data.\n",
   "name": "phoenix_agent",
   "nodes": [
     {
       "id": "weather_agent",
       "name": "weather agent",
       "parameters": {},
       "position": [
         816,
         -112
       ],
       "type": "a2a/mastra-a2a-node",
       "typeVersion": 1,
       "url": "https://telex-mastra.mastra.cloud/a2a/agent/weatherAgent"
     }
   ],
   "pinData": {},
   "settings": {
     "executionOrder": "v1"
   },
   "short_description": "someting"
 }

{
  "active": false,
  "category": "utilities",
  "description": "A workflow that gives weather information",
  "id": "sGC3u7y4vBaZww0G",
  "long_description": "\n      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.\n\n      Your primary function is to help users get weather details for specific locations. When responding:\n      - Always ask for a location if none is provided\n      - If the location name isn't in English, please translate it\n      - If giving a location with multiple parts (e.g. \"New York, NY\"), use the most relevant part (e.g. \"New York\")\n      - Include relevant details like humidity, wind conditions, and precipitation\n      - Keep responses concise but informative\n      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.\n      - If the user asks for activities, respond in the format they request.\n\n      Use the weatherTool to fetch current weather data.\n",
  "name": "phoenix_agent",
  "nodes": [
    {
      "id": "weather_agent",
      "name": "weather agent",
      "parameters": {},
      "position": [
        816,
        -112
      ],
      "type": "a2a/mastra-a2a-node",
      "typeVersion": 1,
      "url": "https://telex-mastra.mastra.cloud/a2a/agent/weatherAgent"
    }
  ],
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "short_description": "something"
}
Other Languages (Python, Go, Java, Rust, C#, PHP, etc.):
Build your agent from scratch. Pick any framework or library you want.
What you need to do:
Write the core logic
Handle incoming messages
Create endpoints that work with Telex.im
Your API needs to be clean and talk to the platform without breaking.
Integration Requirements
Your agent needs to:
Respond to messages or events from Telex.im
Send back valid responses or actions
Use REST or WebSocket (keep it simple and consistent)
Handle errors properly and validate responses
You need to provide:
A public endpoint or repo we can test
Deliverables
Working AI agent
Telex.im integration (fully connected)
Live demo or API endpoint we can hit
Documentation explaining what it does and how to run it
Blog post about your integration process (especially if you used Mastra - walk through how you did it, what worked, what didn't)
Tweet about your agent and share what you built
TypeScript/JavaScript developers: Tag @mastra in your tweet
All other languages: Tag @hnginternship and @teleximapp in your tweet
How We'll Evaluate This
Does your agent work well? Is it smart?
Integration quality with Telex.im
Code structure and documentation
Creativity (build something interesting)
Error handling and testing
Quality of your blog post and how well you explain your process
Submission
You can implement this in any language of your choice (eg Fortran, C, Assembly etc)
Use the command /submit in stage-3-backend and fill in the requirements