import React from 'react'
import Navbar from './cmponents/navbar/Navbar'
import './utils/common.css'
import Footer from './cmponents/footer/Footer'
import './App.css'
import Routes from './Routes'

const AppContent:React.FC=()=>{
  return (
    <main id='app-content'>
        <Routes/>
    </main>
  )
}

const App:React.FC = () => {
  return (
    <div id='app'>
        <Navbar/>
        <AppContent/>
        <Footer/>
    </div>
  )
}

export default App

