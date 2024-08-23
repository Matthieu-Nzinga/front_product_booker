import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'

const LayoutClient = () => {
  return (
    <div>
        <NavBar/>
        <div className='lg:px-[20%]'>

        <Outlet/>
        </div>
    </div>
  )
}

export default LayoutClient