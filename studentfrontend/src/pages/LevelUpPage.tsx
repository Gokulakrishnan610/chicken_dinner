import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


const LevelUpPage = () => {
  const { user } = useAuth();
  const demoProfile = {
    name: user ? `${user.first_name} ${user.last_name}` : "Sarah",
    major: "Computer Science",
    interests: ["Web Development", "AI/ML", "Cloud Computing"],
    skills: ["React", "Python", "AWS"],
    level: "Intermediate",
  };

const initialMessages = [
  { sender: "ai", text: "Hi! I'm Aadhi, your study and career assistant. How can I help you level up today?" },
];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmapInput, setRoadmapInput] = useState("");
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);



  // Call Gemini API for AI response (chat)
  const fetchGeminiResponse = async (userMessage: string) => {
    const prompt = `
You are an expert study and career assistant. The user's profile:
Name: ${demoProfile.name}
Major: ${demoProfile.major}
Level: ${demoProfile.level}
Skills: ${demoProfile.skills.join(", ")}
Interests: ${demoProfile.interests.join(", ")}

User's request: ${userMessage}

If the user asks for a roadmap, generate a step-by-step personalized roadmap for their goal or skill, using their profile data if relevant. Otherwise, answer as a helpful study/career assistant.
    `.trim();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
  };

  // Call Gemini API for roadmap JSON
  const fetchGeminiRoadmap = async (skill: string) => {
    const prompt = `
Generate a detailed learning roadmap for the following skill or topic as a JSON array. Each step should have a 'title' and 'description'.
Skill: ${skill}
User profile: Name: ${demoProfile.name}, Major: ${demoProfile.major}, Level: ${demoProfile.level}, Skills: ${demoProfile.skills.join(", ")}, Interests: ${demoProfile.interests.join(", ")}

Return ONLY the JSON array, no extra text.
    `.trim();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    // Try to extract and parse JSON from the response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    try {
      // Find the first [ and last ] to extract the JSON array
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      }
    } catch (e) {}
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "me", text: input }]);
    setLoading(true);

    try {
      const aiText = await fetchGeminiResponse(input);
      setMessages(msgs => [...msgs, { sender: "ai", text: aiText }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: "ai", text: "Sorry, there was an error connecting to Gemini." }]);
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Level Up</h1>
      </div>
      {/* Chatbot Section */}
      <div className="max-w-2xl mx-auto w-full">
        <Card className="p-8 shadow-xl mb-8">
         <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            AI ChatBot
          </h2>
          <div className="bg-white rounded-xl shadow-inner p-6 mb-3 flex flex-col gap-3 min-h-[200px] max-h-80 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === "me" ? "flex justify-end" : "flex justify-start"}>
                <span
                  className={
                    msg.sender === "me"
                      ? "bg-blue-500 text-white px-4 py-2 rounded-2xl inline-block max-w-xs text-base"
                      : "bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl inline-block max-w-xs text-base"
                  }
                >
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl inline-block max-w-xs text-base opacity-70">Thinking...</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-auto">
            <input
              className="flex-1 border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Ai for a roadmap, study help, or advice..."
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              className="px-6 py-3 rounded-lg text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow"
              disabled={loading}
            >
              Send
            </Button>
          </div>
        </Card>
      </div>

      {/* Roadmap Generator Section */}
      <div className="max-w-2xl mx-auto w-full">
        <Card className="p-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            AI Roadmap Generator
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              value={roadmapInput}
              onChange={e => setRoadmapInput(e.target.value)}
              placeholder="Enter a skill or topic (e.g. React, Data Science)"
              disabled={roadmapLoading}
            />
            <Button
              onClick={async () => {
                if (!roadmapInput.trim()) return;
                setRoadmapLoading(true);
                setRoadmap(null);
                const result = await fetchGeminiRoadmap(roadmapInput);
                setRoadmap(result);
                setRoadmapLoading(false);
              }}
              className="px-6 py-3 rounded-lg text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow"
              disabled={roadmapLoading}
            >
              Generate
            </Button>
          </div>
          {roadmapLoading && (
            <div className="text-muted-foreground text-center py-4">Generating roadmap...</div>
          )}
          {roadmap && Array.isArray(roadmap) && (
            <div className="space-y-4 mt-4">
              {roadmap.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg bg-accent/30">
                  <div className="font-bold text-lg text-primary">{idx + 1}</div>
                  <div>
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-muted-foreground text-sm mt-1">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LevelUpPage;
