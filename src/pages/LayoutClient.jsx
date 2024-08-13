import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'

const LayoutClient = () => {
  return (
    <div>
        <NavBar/>
        <Outlet/>
    </div>
  )
}

export default LayoutClient