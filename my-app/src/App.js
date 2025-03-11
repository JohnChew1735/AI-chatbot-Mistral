import { useState, useEffect } from "react";

export default function App() {
  const [userQuestion, setUserQuestion] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionHistory, setQuestionHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("questionHistory")) || [];
  });

  const [answerHistory, setAnswerHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("answerHistory")) || [];
  });
  const [openHistory, setOpenHistory] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  //user speech to text input
  const startListening = () => {
    console.log("started listening");
    const speechRecognition = window.webkitSpeechRecognition;

    if (!speechRecognition) {
      alert(
        "Your browser does not support speech regonition. Try using Google Chrome instead."
      );
    }
    const recognitionInstance = new speechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event) => {
      console.log(event.results);
      const transcript = event.results[0][0].transcript;
      setUserQuestion(transcript);
      console.log("Speech to text question", event.results[0][0].transcript);

      setTimeout(() => {
        setIsListening(false);
        console.log("Recording ended, asking question", transcript);
        askQuestion(transcript);
      }, 100);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      console.log("Recording ended, asking question", userQuestion);
    };

    setRecognition(recognitionInstance);
    setIsListening(true);
    recognitionInstance.start();
  };

  //stop listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  //bot reads out the answer
  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  //speak response
  useEffect(() => {
    if (botResponse.trim()) {
      speakResponse(botResponse);
    }
  }, [botResponse]);

  //ask AI questions
  async function askQuestion(userQuestion) {
    if (!userQuestion.trim()) {
      console.log("User question is empty");
      return;
    }
    console.log("Throwing question to backend");
    setIsLoading(true);
    setQuestionHistory((prevHistory) => [...prevHistory, userQuestion]);
    try {
      const getAnswerResponse = await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "mistral",
            prompt: userQuestion,
            stream: false,
          }),
        }
      );

      if (getAnswerResponse.ok) {
        const data = await getAnswerResponse.json();
        console.log("Answer acquired", data);
        setBotResponse(data.response);
        setIsLoading(false);
        setAnswerHistory((prevHistory) => [...prevHistory, data.response]);
      } else {
        console.log("Failed to acquire answer.");
      }
    } catch (error) {
      console.error("Error getting answer from AI");
    }
  }

  //set item locally
  useEffect(() => {
    localStorage.setItem("questionHistory", JSON.stringify(questionHistory));
    console.log("question history", questionHistory);
    localStorage.setItem("answerHistory", JSON.stringify(answerHistory));
    console.log("answer history", answerHistory);
  }, [questionHistory, answerHistory]);

  //get history saved locally
  useEffect(() => {
    const savedQuestions =
      JSON.parse(localStorage.getItem("questionHistory")) || [];
    const savedAnswer = JSON.parse(localStorage.getItem("answerHistory")) || [];
    if (savedQuestions.length > 0) {
      console.log("saved questions", savedQuestions);
      setQuestionHistory(savedQuestions);
    }
    if (savedAnswer.length > 0) {
      console.log("saved answers", savedAnswer);
      setAnswerHistory(savedAnswer);
    }
  }, []);

  //AI typing effect
  useEffect(() => {
    if (!botResponse) return; // Prevent running when botResponse is empty

    let index = 0; // Start from 0
    setDisplayedResponse(botResponse[0] || ""); // Set the first character immediately

    let interval = setInterval(() => {
      index++;
      if (index < botResponse.length) {
        setDisplayedResponse((prev) => prev + botResponse[index]);
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [botResponse]);

  return (
    <center>
      <p></p>
      <div>
        <h1>Question</h1>
        <h3>Please input your question here</h3>
        {isLoading === true ? (
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            disabled
          ></input>
        ) : (
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
          ></input>
        )}
        &nbsp;
        {isLoading === true ? (
          <button disabled>Ask the bot</button>
        ) : (
          <button onClick={() => askQuestion(userQuestion)}>Ask the bot</button>
        )}
        <p></p>
        <h3>Please use the below button to speak to the bot</h3>
        {isLoading === true ? (
          <button disabled>Press to speak 🔴</button>
        ) : (
          <button onClick={() => startListening()} disabled={isListening}>
            {" "}
            Press to speak 🔴
          </button>
        )}
        &nbsp;
        {isLoading === true ? (
          <button disabled>Stop recording ⏹️</button>
        ) : (
          <button onClick={() => stopListening()} disabled={!isListening}>
            Stop recording ⏹️
          </button>
        )}
        <p></p>
        <h3>Bot Response:</h3>
        <p></p>
        {isLoading ? (
          <p>Bot is typing...</p>
        ) : (
          <textarea
            style={{ width: "266px", height: "101px" }}
            value={displayedResponse}
            disabled
          />
        )}
      </div>
      <p></p>
      {openHistory === false ? (
        <button onClick={() => setOpenHistory(true)}> See history</button>
      ) : (
        <button onClick={() => setOpenHistory(false)}> Hide history</button>
      )}
      &nbsp;{" "}
      <button
        onClick={() => {
          setQuestionHistory([]);
          setAnswerHistory([]);
          localStorage.removeItem("questionHistory");
          localStorage.removeItem("answerHistory");
        }}
      >
        Clear chat history
      </button>
      <p></p>
      {openHistory === true ? (
        <table
          style={{
            width: "80%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <td style={{ border: "1px solid black" }}>User question</td>
              <td style={{ border: "1px solid black" }}>Bot response</td>
            </tr>
          </thead>
          <tbody>
            {openHistory === true
              ? (() => {
                  let questionsAnswers = [];
                  for (let index = 0; index < questionHistory.length; index++) {
                    questionsAnswers.push(
                      <tr key={index}>
                        <td style={{ border: "1px solid black" }}>
                          {questionHistory[index]}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {answerHistory[index]}
                        </td>
                      </tr>
                    );
                  }
                  return questionsAnswers;
                })()
              : null}
          </tbody>
        </table>
      ) : null}
    </center>
  );
}
