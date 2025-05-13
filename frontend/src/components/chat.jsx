import { useState, useEffect, useRef } from "react";
import axios from "axios";

function chat({ socket, user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [rooms, setRooms] = useState(["public"]);
  const [currentRoom, setCurrentRoom] = useState("public");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/${currentRoom}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching message", error);
      }

      setMessages(response.data);
    };
    fetchMessages();
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => socket.off("message");
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const messageData = {
      content: newMessage,
      roomsId: currentRoom,
      senderId: user.id,
    };

    socket.emit("chatMessage", messageData);
    setNewMessage("");
  };

  const handleRoomSwitch = (roomId) => {
    setCurrentRoom(roomId);
    socket.emit("joinRoom", roomId);
  };

  const handleAddRoom = () => {
    const roomName = prompt("ชื่อห้องใหม่:");
    if (roomName && !rooms.includes(roomName)) {
      setRooms([...rooms, roomName]);
      handleRoomSwitch(roomName);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-500 text-while p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">แชทเรียลไทล์</h1>
        <div className="flex items-center space-x-4">
          <span>สวัสดี, {user.username}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-1/4 bh-while border-r p-4">
          <h2 className="text-lg fort-semibold mb-4">ห้องแชท</h2>
          <ul>
            {rooms.map((room) => (
              <li
                key={room}
                onClick={() => handleRoomSwitch(room)}
                className={`p-2 cursor-pointer rounded ${
                  currentRoom === room ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                {room}
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddRoom}
            className="mt-4 w-full bg-green-500 text-while p-2 rounded hover:bg-green-600"
          >
            + สร้างห้องใหม่
          </button>
        </aside>
        <main className="flex-1 p-4 flex flex-col">
          <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  msg.senderId === user.id
                    ? "bg-blue-100 ml-auto"
                    : "bg-gray-100 mr-auto"
                } max-w-md`}
              >
                <p className="text-sm text-gray-500">
                  {msg.senderId?.username || "Unknown"} -{" "}
                  {new Date(msg.createdAt).toLocaleTimeString("th-TH")}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setMessages(e.target.value)}
              placeholder="พิมข้อความ......"
              className="flex-1 p-3 border rounded-l"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-r hover:bg-blue-600"
            >
              ส่ง
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default chat;
