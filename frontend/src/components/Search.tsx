import React, {useContext} from 'react'
import Image from 'next/image'
import Input from './UI/Input'
import Button from './UI/Button'
import DataContext from '@/contexts/DataContext'

const Search = () => {

  const searchRef = React.useRef<HTMLInputElement>({value: ""} as HTMLInputElement); 
  const dataContext = useContext(DataContext);

  const submitHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dataContext.searchHandler(searchRef.current.value.trim());
  }

  return (
    <form onSubmit={submitHandler as any} className='flex'>
      <Input ref={searchRef} style="md:w-96" input={{type:"text", placeholder:"Search...", className:"rounded-l-full focus:outline-none input w-full bg-white text-black"}} />
      <Button type="submit" styles="btn btn-primary rounded-r-full"><Image src="/search.svg" width="30" height="30" alt='Search' /></Button>
    </form>
  )
}

export default Search