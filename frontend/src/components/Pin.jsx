import React, { useState } from 'react'
import { urlFor, client } from '../client'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {

  // 图片是否 hover
  const [postHovered, setPostHovered] = useState(false)
  const navigate = useNavigate()

  const user = fetchUser()
  // 是否保存（喜欢）该图片
  const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub))?.length

  const savePin = (id) => {
    if (!alreadySaved) {

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [{
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: {
            _type: "postedBy",
            _ref: user?.sub
          }
        }])
        .commit()
        .then(() => {
          // 重新加载页面
          window.location.reload();
        })
    }
  }

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      })
  }

  return (
    <div className='m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        {/* 图片 */}
        <img className='rounded-lg w-full' src={urlFor(image).width(250).url()} alt="url-post" />
        {/* 图片 hover 要出现3个按钮 */}
        {postHovered && (
          // 下载按钮
          <div
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50'
            style={{ height: '100%' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                {/* 点击下载（防止触发navigate(`/pin-detail/）， 需调用stopPropagation */}
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  {/* 图片中的下载按钮 */}
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* saved 按钮 */}
              {
                alreadySaved ? (
                  <button className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl hover:shadow-md outline-none'>{save?.length} Saved</button>
                ) : (
                  <button
                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl hover:shadow-md outline-none'
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                  >
                    Save
                  </button>
                )
              }
            </div>
            <div className='flex justify-between items-center gap-2 w-full'>
              {/* Pin 左侧链接 */}
              {destination && (
                <a
                  href={destination}
                  rel="noreferrer"
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'>
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 8 ? destination.slice(8) : destination}
                </a>
              )}
              {/* Pin 右侧删除按钮 */}
              {postedBy?._id === user?.sub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-base text-dark px-5 py-1 rounded-3xl hover:shadow-md outline-none'
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* 图片下方的头像链接 */}
      <Link
        to={`user-profile/${user?.sub}`}
        className='flex gap-2 mt-2 items-center'
      >
        <img src={postedBy?.image} alt="user-profile" className='w-8 h-8 rounded-lg object-cover' />
        <p className='font-semibold capitalize mt-2'>{postedBy?.userName}</p>
      </Link>
    </div >
  )
}

export default Pin