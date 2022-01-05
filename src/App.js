//import logo from './logo.svg';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import DataTable from './DataTable/DataTable';

function App() {
  return (
    <div className="App">
       <h1>Table in React js </h1> 
      <DataTable />
    </div>
  );
}

export default App;
