import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/Header';
import StartPage from './views/StartPage';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <StartPage />
      <Footer />
    </>
  );
}

export default App;
