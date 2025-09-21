import About from '@/components/homePage/about/About'
import ContactUs from '@/components/homePage/contactUs/Contact'
import Footer from '@/components/homePage/footer/Footer'
import Getintouch from '@/components/homePage/getintouch/Getintouch'
import Header from '@/components/homePage/header/Header'
import Hero from '@/components/homePage/hero/Hero'
import Paraller1 from '@/components/homePage/parallerimg/Paraller1'
import Services from '@/components/homePage/services/Services'
import Testimonials from '@/components/homePage/testimonial/Testimonial'
import React from 'react'

const page = () => {
  return (
    <div>
     <Header/>
     <Hero/>
     <About/>
     <Services/>
     <Paraller1/>
     <Testimonials/>
     <Getintouch/>
     <ContactUs/>
     <Footer/>
    </div>
  )
}

export default page
