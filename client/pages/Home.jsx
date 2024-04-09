import React from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
const Home = () => {
  const auth = useAuthUser();

  console.log(auth)



  return (
    <div className=''>
      home
    </div>

  )
}

export default Home