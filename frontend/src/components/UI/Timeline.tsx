import React from "react";

const TimelineNumber = (props: any) => {
  return (
    <>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        <h1 className="mx-auto text-white font-semibold text-lg">
          {props.index}
        </h1>
      </div>
    </>
  );
};

const LeftCard = (props: any) => {
  return (
    <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
      <TimelineNumber index={props.index} />
      <div className="order-1 bg-primary rounded-lg shadow-xl w-5/12 px-6 py-4">
        <h3 className="mb-3 font-bold text-white text-xl">{props.title}</h3>
        <div className="bg-white rounded-lg shadow-xl w-full h-auto font-bold text-xl text-center">
          {props.description}
        </div>
      </div>
    </div>
  );
};

const RightCard = (props: any) => {
  return (
    <div className="mb-8 flex justify-between items-center w-full right-timeline">
      <TimelineNumber index={props.index} />
      <div className="order-1 bg-[#e5e7eb] rounded-lg shadow-xl w-5/12 px-6 py-4">
        <h3 className="mb-3 font-bold text-gray-800 text-xl">{props.title}</h3>
        <div className="bg-white rounded-lg shadow-xl w-full h-auto font-bold text-xl text-center">
          {props.description}
        </div>
      </div>
    </div>
  );
};

const Timeline = (props: any) => {
  return props.data
    .sort((a: any, b: any) => {
      return a[1] < b[1];
    })
    .map((item: any, index: number) => {
      if (index % 2 === 0) {
        return (
          <LeftCard
            key={index}
            index={index + 1}
            title={item[0]}
            description={item[1]}
          />
        );
      } else {
        return (
          <RightCard
            key={index}
            index={index + 1}
            title={item[0]}
            description={item[1]}
          />
        );
      }
    });
};

export default Timeline;
