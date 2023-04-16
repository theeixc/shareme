import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom';
import Spinner from './Spinner';
import MasonryLayout from './MasonryLayout'
import { pinDetailQuery, pinDetailMoreQuery } from '../utils/data'
import { client, urlFor } from '../client';

import { MdDownloadForOffline } from 'react-icons/md'

import { v4 as uuidv4 } from 'uuid'

// 每个图像的详情页

const PinDetail = ({ user }) => {

  const [pins, setPins] = useState(null);
  // 详情
  const [pinDetail, setPinDetail] = useState(null)
  //  评论
  const [comment, setComment] = useState("")
  // 是否正在添加评论
  const [isAddingComment, setIsAddingComment] = useState(false)

  const { pinId } = useParams();



  const fetchPinDetail = () => {
    // 先获取指定 id 的 pin
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0]);

          // 获取相关的 pins
          if (data[0]) {
            query = pinDetailMoreQuery(data[0]);
            client.fetch(query)
              .then((res) => {
                setPins(res);
              })
          }
        })
    }
  }

  useEffect(() => {
    fetchPinDetail();
  }, [pinId])


  // 添加评论的回调
  const addComment = () => {
    if (comment) {
      setIsAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetail();

          // 重置input和isAddingComment状态
          setComment('');
          setIsAddingComment(false);
        });
    }
  };

  // 获取 pinDetail 前展示加载 Spinner
  if (!user || !pinDetail) return <Spinner msg='Loading pin...' />

  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            {/* 上传的图片 */}
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
              alt="user-post"
            />
          </div>
          <div className='w-full p-5 flex-1 xl:min-w-620'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                {/* 图片的下载按钮 */}
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* 用户的url */}
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination?.slice(8)}
              </a>
            </div>
            <div>
              {/* 展示 title 信息 */}
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              {/* 展示 about 信息 */}
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            {/* 展示上传Pin的用户信息 */}
            <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>
            {/* pin 的评论区 */}
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className='max-h-370 overflow-y-auto'>
              {pinDetail?.comments?.map((item) => {
                return (
                  <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
                    <img src={item.postedBy?.iamge} alt="user-profile" className="w-10 h-10 rounded-full cursor-pointer" />
                    <div className='flex flex-col'>
                      <p className='font-bold'>{item.postedBy?.userName}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* 评论区左侧头像 */}
            <div className='flex flex-wrap mt-6 gap-3'>
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              {/* 输入框 */}
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder='Add a comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {/* 提交评论按钮 */}
              <button
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {isAddingComment ? 'Posting' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 展示类别相同的 pins */}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  )
}

export default PinDetail