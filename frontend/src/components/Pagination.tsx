import React, { useRef } from 'react'
import Input from './UI/Input'
import Button from './UI/Button'
import DataContext from '@/contexts/DataContext'

const Pagination = () => {
  const dataContext = React.useContext(DataContext)

  const [limit, setLimit] = React.useState(dataContext.limit)
  const [page, setPage] = React.useState(dataContext.page)

  const limitChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(+e.target.value)
  }

  const pageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(+e.target.value)
  }

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    dataContext.setPage(page)
    dataContext.setLimit(limit)
  }

  return (
    <section className='flex flex-wrap-reverse gap-4 justify-between place-items-end'>
      <div>
        <Button clickHandler={() => dataContext.setPage(--dataContext.page)} styles="btn-primary rounded-none w-24">Previous</Button>
        <Button clickHandler={() => dataContext.setPage(++dataContext.page)} styles="btn-primary rounded-none w-24">Next</Button>
      </div>
      <form onSubmit={submitHandler} className='flex items-start mb-8 gap-4 justify-center flex-col sm:flex-row'>
        <Input label="Current Page - " input={{type: "number", min:1, value: page, onChange: pageChangeHandler, className: "input input-primary w-20"}}/>
        <Input label="Number of Rows - " input={{type: "number", min:1 , max: 100, value: limit, onChange: limitChangeHandler, className: "input input-primary w-20"}}/>
        <Button type="submit" styles="btn-primary btn-bordered">Go</Button>
      </form>
    </section>
  )
}

export default Pagination