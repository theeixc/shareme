import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

// 搜索组件

const Search = ({ searchText }) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchText) {
      setLoading(true);
      const query = searchQuery(searchText.toLowerCase());
      client.fetch(query)
        .then((data) => {
          setPins(data);

          setLoading(false);
        })
    } else {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);

          setLoading(false);
        })
    }
  }, [searchText])


  return (
    <div>
      {loading && <Spinner msg='Search for Pins' />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} ></MasonryLayout>}
      {pins?.length === 0 && searchText !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>No Pins Found!</div>
      )}
    </div>
  )
}

export default Search