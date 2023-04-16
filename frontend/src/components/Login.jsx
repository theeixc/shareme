import React from 'react'
import { useNavigate } from 'react-router-dom'
// 谷歌登录
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// 解码 
import jwt_decode from 'jwt-decode'
// 背景视频和logo
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png';

// 导入 sanity 客户端
import { client } from '../client'

const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = (response) => {
    // 将 token 放在前端存储
    const decoded = jwt_decode(response.credential);
    localStorage.setItem('user', JSON.stringify(decoded))
    const { name, picture, sub } = decoded;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    // 创建用户，如果不存在的话
    client.createIfNotExists(doc)
      .then(() => {
        navigate("/", { replace: true })
      })

  }

  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
      <div className='flex justify-start items-center flex-col h-screen'>
        {/* 背景视频 */}
        <div className='realtive w-full h-full'>
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />

          <div className='absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay'>
            {/* logo */}
            <div className='p-5'>
              <img src={logo} alt="logo" width='150px' />
            </div>
            {/* 登录 */}
            <div className='shadow-2xl'>
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login