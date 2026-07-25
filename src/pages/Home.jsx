import React from 'react'
import Navbar from "../components/Navbar"
import HomeSlider from "../components/HomeSlider"
import TopRecommendations from "../components/TopRecommendations"
import InnovationSection from "../components/InnovationSection"
import ProductShowcase from "../components/ProductShowcase"
import NewLaunches from "../components/NewLaunches"
import WhyChoose from "../components/WhyChoose"
import LegacySection from "../components/LegacySection"
import waveImg from "../assets/water_waves.webp"
import {CommunitySection} from "../components/CommunitySection"

const Home = () => {
  return (
    <>
      <Navbar/>
      <HomeSlider/>
      <TopRecommendations/>
      <InnovationSection />
      <ProductShowcase />
      <NewLaunches />
      <WhyChoose />
      <LegacySection />
      <CommunitySection />
    </>
  )
}

export default Home
