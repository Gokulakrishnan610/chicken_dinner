
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockPeers = [
  { id: 1, name: "Alice Lee", skills: ["React", "Python"], specialization: "Web Development" },
  { id: 2, name: "Bob Smith", skills: ["AWS", "Node.js"], specialization: "Cloud Computing" },
];
const mockMentors = [
  { id: 101, name: "Dr. Emily Carter", skills: ["Machine Learning", "Python"], specialization: "AI/ML" },
  { id: 102, name: "Prof. David Kim", skills: ["React", "Node.js"], specialization: "Full Stack" },
];

const MatchPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: "them", text: "Hi! Ready to collaborate?" },
    { sender: "me", text: "Yes, let's get started!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { sender: "me", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Find Peers & Mentors</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Match List */}
        <Card className="portal-card p-8 shadow-xl">
          {!selectedChat ? (
            <>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Matched Peers</h2>
              <ul className="mb-8 space-y-4">
                {mockPeers.map(peer => (
                  <li key={peer.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-accent transition">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{peer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-base">{peer.name}</div>
                        <div className="text-xs text-muted-foreground">{peer.specialization}</div>
                        <div className="text-xs text-muted-foreground">Skills: {peer.skills.join(", ")}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedChat({ ...peer, type: 'peer' })}>Chat</Button>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-6 mt-2">
                <h2 className="text-xl font-semibold mb-4">Matched Mentors</h2>
                <ul className="space-y-4">
                  {mockMentors.map(mentor => (
                    <li key={mentor.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-accent transition">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-base">{mentor.name}</div>
                          <div className="text-xs text-muted-foreground">{mentor.specialization}</div>
                          <div className="text-xs text-muted-foreground">Skills: {mentor.skills.join(", ")}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedChat({ ...mentor, type: 'mentor' })}>Chat</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <Button variant="link" size="sm" className="mb-2 px-0 self-start" onClick={() => setSelectedChat(null)}>&larr; Back to matches</Button>
              <h3 className="font-bold mb-4 text-lg">Chat with <span className="font-extrabold">{selectedChat.name}</span> ({selectedChat.type})</h3>
              <div className="flex-1 flex flex-col justify-end">
                <div className="bg-white rounded-xl shadow-md p-6 mb-3 flex flex-col gap-3 min-h-[240px] max-h-72 overflow-y-auto">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={msg.sender === "me" ? "flex justify-end" : "flex justify-start"}>
                      <span
                        className={
                          msg.sender === "me"
                            ? "bg-blue-500 text-white px-4 py-2 rounded-2xl inline-block max-w-xs text-base"
                            : "bg-gray-200 text-gray-500 px-4 py-2 rounded-2xl inline-block max-w-xs text-base"
                        }
                        style={msg.sender !== "me" ? { opacity: 0.7 } : {}}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-auto">
                  <input
                    className="flex-1 border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="px-6 py-3 rounded-lg text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MatchPage;
