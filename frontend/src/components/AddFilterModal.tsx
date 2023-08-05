import React, {useRef} from 'react'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addFilter } from '@/redux/slices/filterSlice'
import Modal from './UI/Modal'
import Button from './UI/Button'
import Select from './UI/Select'

const AddFilterModal = () => {
  const dispatch =  useAppDispatch();
  const {headers} = useAppSelector((state) => state.dataReducer.data);
  const loading = useAppSelector((state) => state.filterReducer.loading);
  const selectRef = useRef<HTMLSelectElement>(null);
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(addFilter(selectRef.current!.value));
  }
  return (
    <Modal id="add_filter" close={() => window.add_filter.close()}>
      <form onSubmit={submitHandler} className='flex flex-col gap-2'>
        <Select options={headers} ref={selectRef} changeHandler={function(){}}/>
        <Button type="submit" styles="btn-primary max-w-[100px]">
          {loading ? <span className="loading loading-spinner loading-xs"></span> : "Add"}
        </Button>
      </form>
    </Modal>
  )
}

export default AddFilterModal