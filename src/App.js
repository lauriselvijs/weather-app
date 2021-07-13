import "./App.css";

import Weather from "./components/Weather";
import Header from "./components/Header";
import Footer from "./components/Footer";

import React from "react";

function App() {
  return (
    <div className="App">
      <Header />
      <Weather />
      <Footer />
    </div>
  );
}

export default App;
