import React from 'react'
import Select from './UI/Select'

const Filter = () => {
  return (
    <section className='bg-neutral rounded shadow p-4 my-4 md:my-8'>
        <h2 className='text-xl font-bold'>Filter by -</h2>
        <div className="w-full flex flex-wrap items-center justify-evenly gap-4 my-4">
            <Select options={["10/05/23","11/05/23","12/05/23"]} label={"Date"}/>
            <Select options={["Type"]} label={"Type"}/>
            <Select options={["Pending", "Active", "Completed"]} label={"Status"}/>
        </div>
    </section>
  )
}

export default Filter