import React from 'react';
import './App.css';
import MainTable from './MainTable';
import ChatOpenAI from './ChatOpenAI';




function App() {
  return (
    <div>
      <MainTable/>
      <div>
        <ChatOpenAI/>
      </div>
    </div>
  );
}

export default App;
