"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// Modules : Card, Residency, Flight, Motorbike, Slef-Transportation, Public-Transportation with slider for traversing the page forward and backword.
// Along with the pursistent storage of the data in local browser storage and data will be cleared after visiting the home page 

const usePersistentState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key); 
    console.log("Local stored : ",storedValue);   
    return storedValue !== null ? storedValue : defaultValue;
  });
  
  const handleChange = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, handleChange];
};

const get_all_data = () =>{  
  const localStorageData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const parsedValue = !isNaN(value) ? parseInt(value, 10) : value;
    localStorageData[key] = parsedValue;
  }

  console.log("Local : ",localStorageData);
  return (localStorageData);

}

const sendData = async(e) =>{  
  const datas=get_all_data();
  console.log("Flight data : ",datas);
    const resUserExists = await fetch("../api/survey-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ datas }),
  });
  
}



const Blogs = () => {
  const [Flight_Radio, setSelectedRadio] = usePersistentState('Flight_Radio', '');
  const [Flight_Range, setSelectedRange] = usePersistentState('Flight_Range', 1);
  
  const router = useRouter();

  const handleShowResult = async (e) => {
    e.preventDefault();
    sendData();
    router.replace('/ShowResultModule');
  };


  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
  };

  const {data: session } = useSession();
  localStorage.setItem('username',session?.user?.name);
  console.log("Data session : ",session?.user?.name);
  // usePersistentState('username',session?.user?.name);

  const handleRangeChange = (e) => {
    setSelectedRange(parseInt(e.target.value, 10));
  };


  return (
    <>
      {/* <div
        className="p-6 md:10 lg:p-12"
        style={{
          background:
            "linear-gradient(rgba(48, 129, 195, 0.7), rgba(17, 136, 184, 0.8))",
        }}
      >
        <div className="p-1 md:p-3">
          <h2 className="text-center font-semibold text-xl md:text-2xl xl:text-3xl text-white  pt-12 md:pt-10 lg:pt-7">
            Take Survey
          </h2>
          <h4 className=" text-white text-base md:text-lg xl:text-xl font-semibold text-center pt-1 pb-1 md:pb-2 lg:pb-4">
          "Small steps, big change: reduce your ecological footprint"
          </h4>
        </div>
      </div> */}
      

      <div className="justify-center cursor-pointer">
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
      <SwiperSlide>
        
          <div className="flex items-center justify-center">
              <img
                src="/assets/images/Flight.png"
                alt="Blurred Image"
                className="w-full blur-sm"
              />
            </div>
            <div  className="absolute inset-12">
              <div>
                <h2 className="text-white text-lg md:text-2xl xl:text-4xl text-center font-bold mt-10">
                  Flight footprint
                </h2>              
              </div>
              <div className="text-center">
                <p className="text-gray-700 text-base md:text-xl xl:text-2xl font-semibold mt-6 mb-6 px-40 ">
                  How long do you fly each year ? 
                </p>
                
                <div class="leading-tight font-semibold">
                  <label class="inline-flex flex-col items-center space-x-6">
                    <input type="radio" name="Flight_Radio" class="ml-2" value="Short-Haul" checked={Flight_Radio === 'Short-Haul'} onChange={handleRadioChange}/> 
                    Short-Haul
                    <span class="block mt-1 font-sans font-normal">i.e within India State,<br/>or a Asian Country</span>
                  </label>
                  <label class="inline-flex flex-col items-center space-x-7">
                    <input type="radio" name="Flight_Radio" class="ml-5" value="Medium-Haul" checked={Flight_Radio === 'Medium-Haul'} onChange={handleRadioChange}/> 
                    Medium-Haul
                    <span class="block mt-1 font-sans font-normal">i.e within India State,<br/>or flight between<br/>two Asian Country</span>
                  </label>
                  <label class="inline-flex flex-col items-center space-x-7">
                    <input type="radio" name="Flight_Radio" class="ml-5" value="Long-Haul" checked={Flight_Radio === 'Long-Haul'} onChange={handleRadioChange}/> 
                    Long-Haul
                    <span class="block mt-1 font-sans font-normal">More than 3,700 km<br/>(2,300 mi) in length</span>
                  </label>                  
                </div>

              </div>
              <div className="text-center">
                <p className="text-gray-700 text-base md:text-xl xl:text-2xl font-semibold mt-6 mb-6 px-40 ">
                  How often you travel by flight each year ?
                </p>
                
                <div className="flex flex-col items-center mt-8">
                  <div className="flex justify-between w-64 text-gray-600">
                    <span>1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={Flight_Range}
                      onChange={handleRangeChange}
                      className="slider appearance-none w-64 h-2 bg-gray-300 rounded-full outline-none"
                    />
                    <span>10</span>
                  </div>
                  <span className="mt-2 text-gray-700">Numbers of flights {Flight_Range}</span>
                  <style jsx>{`
                    /* Custom Styles */
                    .slider::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      background: #4f46e5;
                      border-radius: 50%;
                      cursor: pointer;
                    }

                    .slider::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      background: #4f46e5;
                      border-radius: 50%;
                      cursor: pointer;
                    }
                  `}</style>
                </div>

              </div>
              </div>          
              

              <div className="">
                <div className="absolute top-1/2">
                  <Link href="/Blogs/PublicTransport">
                  <button className="border border-black rounded-xl p-2 hover:bg-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                  </svg>
                  </button>
                  </Link>
                  </div>

                <div className="absolute top-1/2 right-0">
                <Link href="/ShowResultModule">
                  <button className="border border-black rounded-xl p-2 hover:bg-green-700" onClick={handleShowResult}>
                  Show Result
                  </button>
                </Link>                  
                </div>                                
              </div>
                          
          
        </SwiperSlide>
        </Swiper>
      </div>
      </>
  );
};

export default Blogs;
