import React from 'react'

const Button = (props : any) => {
  return (
    <button type={props.type} onClick={props.clickHandler} className={`btn ${props.styles}`}>{props.children}</button>
  )
}

export default Button