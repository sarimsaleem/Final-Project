import React from 'react'
import "./crousel.css"
import video from "../../assets/crousel.mp4"
const Crousel = () => {
    return (
        <div className="video-container">
            <video className="video" autoPlay muted loop>
                <source src={video} type="video/mp4" />
            </video>
            {/* <div className="video-overlay"></div> */}
            {/* <div className="video-content"> */}
                {/* <div data-aos="zoom-out-up" data-aos-duration="4000">
                    <h4>لَبَّيْكَ اللَّهُمَّ لَبَّيْك</h4>
                    <h1>Umrah with Ease, Faith with Peace</h1>
                    <button>GET STARTED</button>
                </div> */}
            {/* </div> */}
        </div>
    )
}

export default Crousel