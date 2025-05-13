import { useState, useEffect } from 'react'; // useState จำสถานะ useEffect ทำเมือเปลี่ยนวถานะ 
import axios from 'axios';
import io from 'socket.io-client';
import Login from './components/Login';

//ส่ง Token ไป backend ด้วย socket.Io
const socket = io('http://localhost:3000');

function App() {
  //เก็บ token ใน state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      setToken(response.data.token);
      setUser({ id: response.data.userId, username: response.data.username });
      socket.emit('joinRoom', 'public');
    } catch (error) {
      alert(error.response?.data?.message || 'Error logging in');
    }
  };

  const handleRegister = async (username, password) => {
    try {
      await axios.post('http://localhost:3000/register', { username, password });
      alert('สมัครสมาชิกสำเร็จ กรุณาล็อกอิน');
    } catch (error) {
      alert(error.response?.data?.message || 'Error registering');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {token ? (
        <Chat socket={socket} user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}

export default App;