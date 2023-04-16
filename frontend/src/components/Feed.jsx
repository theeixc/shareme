import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
// 布局组件（非对齐的网格）
import MasonryLayout from './MasonryLayout'
// 加载时组件
import Spinner from './Spinner'


// Pins 中的图像组件
const Feed = () => {

  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)

  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true)

    if (categoryId) {
      // 搜索特定的类别
      const query = searchQuery(categoryId);
      client.fetch(query)
        .then((data) => {
          setPins(data);
          // 数据获取完毕后，加载组件消失
          setLoading(false);
        })
    } else {
      // 搜索所有
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
    }
  }, [categoryId])

  if (loading) return <Spinner msg={`We are adding new ideas to your feed !`} />

  if (!pins?.length) return (<h2>No Pins available</h2>)

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed