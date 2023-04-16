import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

const Spinner = ({ msg }) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <ThreeCircles
        color="#00BFFF"
        height='100'
        width='100'
        className='m-5'
        visible={true}
      />
      <p className='text-lg text-center px-2'>{msg}</p>
    </div>
  )
}

export default Spinner