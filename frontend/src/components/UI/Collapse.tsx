import React from 'react'

const Collapse = (props: any) => {
  return (
    <details className="collapse bg-base-200">
    <summary className="collapse-title text-xl font-medium">{props.header}</summary>
    <div className="collapse-content"> 
      {props.children}
    </div>
  </details>
  )
}

export default Collapse