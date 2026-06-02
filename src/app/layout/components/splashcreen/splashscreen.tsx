'use client'
import React, { useEffect, useState } from 'react'

export const Splashscreen = () => {

    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(true), 1500);
        return () => { clearTimeout(timer); console.log('clearTimeout') };
    }, []);

    if (!showLoader) return null;

    return <div className='flex items-center justify-center h-screen text-white'>{showLoader ? "Surprise!" : "Waiting..."}</div>;
}
