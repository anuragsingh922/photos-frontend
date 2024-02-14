import React from 'react'
import "./Home.css"

function Home() {
  return (
    <div className='homepage'>
        <h1>
            Welcome to my Zomato Blinkit Assignment WebAPP
        </h1>

        <h3>
            You can upload you images here. Start with creating your account
        </h3>

        <div className='imageU'>
            <img src='https://os-wordpress-media.s3.ap-south-1.amazonaws.com/blog/wp-content/uploads/2022/06/27203058/zomato-blinkit-750x375.jpeg'/>
        </div>
    </div>
  )
}

export default Home