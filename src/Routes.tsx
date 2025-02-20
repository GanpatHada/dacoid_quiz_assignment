import React from 'react'
import { Routes as AppRoutes, Route } from 'react-router-dom'
import Challenges from './pages/challenges/Challenges'
import Result from './pages/result/Result'
const Routes:React.FC= () => {
  return (
    <AppRoutes>
       <Route path='/' element={<Challenges/>}/>
       <Route path='/result' element={<Result/>}/>
    </AppRoutes>
  )
}

export default Routes