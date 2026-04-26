import React from 'react'
import "./Home.css"
import Navbar from "../../components/navbar/Navbar"
import Article from "../../components/article/Article"

const Home = () => {
  return (
    <div className="Home">
      <Navbar />
      <Article />
    </div>
  )
}

export default Home
