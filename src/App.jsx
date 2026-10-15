import { useState } from "react";

import "./App.css";
import Header from "./components/Header/Header.jsx";
import Banner from "./components/Banner/Banner";
import DisplayRow from "./components/DisplayRow/DisplayRow";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Banner />
      <DisplayRow />
      <Footer />
    </>
  );
}

export default App;
