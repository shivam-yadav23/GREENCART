import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useLocation } from 'react-router-dom';

const Loading = () => {
    const { Navigate } = useAppContext();
    let { search } = useLocation()
    const query = new URLSearchParams(search)
    const nextUrl = query.get('next');

    useEffect(()=>{
        if(nextUrl){
            setTimeout(()=>{
                Navigate(`/${nextUrl}`)
            }, 5000)
        }
    },[nextUrl])

  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='animate-apin rounded-full h-24 w-24 border-4 border-gray-300
        border-t-primary'></div>
    </div>
  )
}

export default Loading