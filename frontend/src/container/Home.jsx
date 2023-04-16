import React, { useState, useEffect, useRef } from 'react'

import { SideBar, UserProfile } from '../components'
import Pins from './Pins'
import { client } from '../client'
import logo from '../assets/logo.png'

import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'

import { Link, Routes, Route } from 'react-router-dom'

import { userQuery } from '../utils/data'
import { fetchUser } from '../utils/fetchUser'


// 主页

const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);


  // 获取 Login 组件存的用户（看是否存在）
  const userInfo = fetchUser();
  // 获取 User（查询后台）
  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, [])

  useEffect(() => {
    // 进入页面时，滚动态位于首部
    scrollRef.current.scrollTo(0, 0);
  })


  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transation-height duration-75 ease-out'>
      {/* 两个侧边连，一个用于移动设备，一个用于其他 */}
      <div className="hidden md:flex h-screen flex-initial">
        <SideBar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="user-pic" className="w-9 h-9 rounded-full" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            {/* 离开侧边栏时将 user 传递出去 */}
            <SideBar closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}
      </div>
      <div className='pd-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          {/* 注册路由，携带 search 参数 */}
          <Route path='/user-profile/:userId' element={<UserProfile />}></Route>
          {/* 其他路由，直接去详情页 Pins，并携带user信息 */}
          <Route path='/*' element={<Pins user={user && user} />}></Route>
        </Routes>
      </div>
    </div>
  )
}

// 1:30:25 

export default Home