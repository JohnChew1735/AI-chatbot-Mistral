Chatbot with Speech Recognition & AI Response

This is a simple AI chatbot that uses speech-to-text recognition to take user input and text-to-speech to read out the bot's response. The chatbot is powered by the Mistral model from Ollama and supports both text input and voice commands for a seamless experience. 🛠 Features

✅ Speech Recognition (Voice Input) – Converts speech to text using webkitSpeechRecognition ✅ Text-to-Speech – Reads out the AI response using SpeechSynthesisUtterance ✅ Conversational AI – Uses the Mistral model to generate intelligent responses ✅ Real-Time AI Typing Effect – Displays bot responses as if they’re being typed ✅ Chat History – Stores and retrieves chat history using localStorage ✅ Direct API Call to Ollama – No backend required, directly calls localhost:11434/api/generate 🚀 Getting Started 1️⃣ Install & Run Ollama

Make sure you have Ollama installed on your system. If not, install it from: 🔗 Ollama Official Website

Run the following command to download and start the Mistral model:

ollama run mistral

2️⃣ Install Dependencies

Inside your project folder, install dependencies:

npm install

3️⃣ Start the React App

Run the development server:

npm start

📝 Usage 🗣️ Using Speech Recognition

Click the "Press to Speak 🔴" button.
Say your question out loud.
The chatbot will convert your speech to text and display it in the input box.
Once you stop speaking, the bot will automatically ask the AI and provide a response.

⌨️ Using Text Input

Type your question in the input box.
Click "Ask the Bot" to get a response.

🗣️ Text-to-Speech (Bot Reads the Answer)

Once the AI responds, the chatbot will automatically read out the answer using SpeechSynthesisUtterance.

🛠 Technologies Used

React.js – Frontend framework
Ollama – Runs AI models locally
Mistral Model – AI chatbot model
Speech Recognition API – Converts speech to text
Speech Synthesis API – Converts text to speech

💡 Future Improvements

🔹 Add support for multiple languages 🔹 Improve the UI with a chat bubble interface 🔹 Implement streaming responses for real-time AI interaction 📜 License

This project is open-source and free to use.
