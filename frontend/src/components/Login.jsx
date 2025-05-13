import { useState } from 'react';

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      await onRegister(username, password);
      setIsRegistering(false);
    } else {
      await onLogin(username, password);
    }
    setUsername('');
    setPassword('');
  };

  return (
    <div className="bg-slate-300 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{isRegistering ? 'สมัครสมาชิก' : 'ล็อกอิน'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          {isRegistering ? 'สมัคร' : 'ล็อกอิน'}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isRegistering ? 'มีบัญชีแล้ว? ล็อกอิน' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
      </button>
    </div>
  );
}

export default Login;