import React from 'react'
import HeroImageSGV from '@/assets/HeroImage.svg'
import Image from 'next/image'

export default function HeroImage() {
    return (
        <Image src={HeroImageSGV} alt="Hero Image" />
    )
}
