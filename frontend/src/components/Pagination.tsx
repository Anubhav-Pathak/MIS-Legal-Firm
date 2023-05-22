import React from 'react'
import Image from 'next/image'

const Pagination = ({current, limit}:{current: number, limit: number}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
        <Image src="/left-arrow.svg" width={50} height={50} alt="previous" className="h-10 w-10 cursor-pointer" />
        <span>{current} Page of {limit}</span>
        <Image src="/right-arrow.svg" width={50} height={50} alt="next" className="h-10 w-10 cursor-pointer" />
    </div>
  )
}

export default Pagination