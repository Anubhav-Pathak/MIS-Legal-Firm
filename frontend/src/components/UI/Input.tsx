import React from 'react'

const Input = React.forwardRef<any, any>((props, ref) => {
    return (
      <div className={props.style}>
        {props.label && <label htmlFor={props.input.id}>{props.label}</label>}
        <input ref={ref} {...props.input}/>
        {props.children}
      </div>
    )
  });

export default Input