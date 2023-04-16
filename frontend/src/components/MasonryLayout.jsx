import React from 'react'
import Masonry from 'react-masonry-css'
import Pin from './Pin'

const obj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3
}

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={obj}>
      {pins?.map((pin) => <Pin key={pin._id} pin={pin} />)}
    </Masonry>
  )
}

export default MasonryLayout