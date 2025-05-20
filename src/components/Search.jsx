import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {

  return (
    <div className='text-white text-3xl'>
      <div className='search'>
        <div>
            <img src='/src/assets/search.svg' alt='search'/>

            <input
            type='text'
            placeholder='Search for a movie, tv show, person...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
    </div>
  )
}

export default Search
