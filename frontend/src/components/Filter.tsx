"use client"
import React, { Key, use, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Select from "./UI/Select";
import Button from "./UI/Button";
import { filterActions } from "@/redux/slices/filterSlice";
import {dataActions} from "@/redux/slices/dataSlice";

const Filter = () => {
  const dispatch = useAppDispatch();
  const {data} = useAppSelector((state) => state.dataReducer);
  const filter = useAppSelector((state) => state.filterReducer.filter);

  const removeHandler = (label: string) => {
    dispatch(dataActions.removeFilter(label));
    dispatch(filterActions.removeFilter(label));
  };

  const changeTabHandler = (tab: string, value: string) => {
    dispatch(dataActions.changeTab(value));
  }

  const changeFilterHandler = (label: string, value: string) => {
    dispatch(dataActions.addFilter({label, value}));
  }

  return (
    <section className="bg-neutral rounded shadow p-4 my-4 md:my-8">
      <h2 className="text-xl font-bold">Filter by -</h2>
      <div className="w-full flex flex-wrap items-center justify-start gap-4 my-4">
        <Select label="Type" options={data.tabs} changeHandler={changeTabHandler}/>
        {filter.map((filter: any, index: Key) => {
          return (
            <div className="indicator" key={index}>
              <button className="indicator-item indicator-top indicator-end badge badge-primary" onClick={() => removeHandler(filter.label)}>-</button>
              <Select label={filter.label} options={filter.options} changeHandler={changeFilterHandler}/>
            </div>
          )
        })}
        <Button clickHandler={()=>window.add_filter.showModal()} styles="btn-outline btn-sm">+New Filter</Button>
      </div>
    </section>
  );
};

export default Filter;
