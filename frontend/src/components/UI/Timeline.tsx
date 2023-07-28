import React from 'react'

const Timeline = (props: any) => {
  return (
    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid card place-items-center text-primary">{props.date}</div> 
      <div className="divider lg:divider-horizontal bg-black" /> 
      <div className="grid flex-grow bg-base-300 card rounded px-4 py-2">{props.children}</div>
    </div>
  )
}

export default Timeline