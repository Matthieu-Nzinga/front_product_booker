import React from 'react'
import Header from '../components/Header'
import UserList from '../components/UserList'

const Users = () => {
  return (
    <div>
      <Header text={"Les utilisateurs"}/>
      <UserList/>
    </div>
  )
}

export default Users