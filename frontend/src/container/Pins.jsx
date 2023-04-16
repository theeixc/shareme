import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Serach, CreatePin, Feed, PinDetail, NavBar } from '../components'

// 展示个人信息

const Pins = ({ user }) => {

  const [searchText, setSearchText] = useState("")

  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <NavBar searchText={searchText} setSearchText={setSearchText} user={user}></NavBar>
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />}></Route>
          <Route path='/category/:categoryId' element={<Feed />}></Route>
          <Route path='/pin-detail/:pinId' element={<PinDetail user={user} />}></Route>
          <Route path='/create-pin' element={<CreatePin user={user} />}></Route>
          <Route path='/search' element={<Serach searchText={searchText} setSearchText={setSearchText} />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default Pins