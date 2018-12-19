import React, { Component } from "react";
import "./App.css";
import ClientsData from "./ClientsData";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ClientsData />
      </div>
    );
  }
}

export default App;
