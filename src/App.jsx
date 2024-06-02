// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [dbStatus, setDbStatus] = useState('');

  useEffect(() => {
    
    axios.get('http://localhost:3000/checkdb')
      .then(response => {
        setDbStatus(response.data); 
      })
      .catch(error => {
        setDbStatus('Error al conectar con la base de datos');
      });
  }, []);

  return (
    <div>
      <h1>Estado de la conexión a la base de datos:</h1>
      <p>{dbStatus}</p>
    </div>
  );
}

export default App;

