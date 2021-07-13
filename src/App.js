import "./App.css";

import Weather from "./components/Weather";
import Header from "./components/Header";
import Footer from "./components/Footer";

import React from "react";

/* App consists of three components which include information about
Header, Weather and Footer look and functionality  */

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
