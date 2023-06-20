"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTemplates } from "@/utils/API";
import PDFCard from "@/components/UI/PDFCard";

const Step1 = ({ templates, selectedTemplate, onNext, onTemplateSelect }) => {
  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
  };

  return (  
    <div>
      <div>
        <h2>Step 1: Select a PDF Template</h2>
        <div>
          {templates.map((template, index) => (
            <PDFCard
              key={index}
              fileName={template}
              onButtonClick={() => handleTemplateSelect(template)}
            />
          ))}
        </div>
        {selectedTemplate && (
          <div>
            <h3>Selected Template: {selectedTemplate}</h3>
            <h3>More Data:</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const Step2 = ({
  selectedRows,
  onNext,
  onPrev,
  onDateTimeChange,
  dateTime,
}) => {
  return (
    <div>
      <div>
        <h2>Step 2: Select Date and Time</h2>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={onDateTimeChange}
        />
      </div>
    </div>
  );
};

const Step3 = ({ onDone, onPrev }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos/1"
        );
        const jsonData = await response.json();
        setFetchedData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDone = () => {
    onDone();
  };

  return (
    <div>
      <div>
        <h2>Step 3: Fetch Data</h2>
        {isLoading ? (
          <div>Loading data...</div>
        ) : (
          <div>
            <h3>Fetched Data:</h3>
            <ul>
              <li>{fetchedData.title}</li>
              <li>{fetchedData.userId}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Step4 = ({ onDone, onPrev }) => {
  const selectedRows =
    useSelector((state) => state.rowReducer.selectedRows) || [];
  const handleDone = () => {
    onDone();
  };

  return (
    <div>
      <h2>Step 4: Selected Rows</h2>
      <ul>
        {selectedRows.map((row, index) => (
          <li key={index}>{index}</li>
        ))}
      </ul>
    </div>
  );
};

const Step5 = () => {
  const selectedRows =
    useSelector((state) => state.rowReducer.selectedRows) || [];
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos/1"
        );
        const jsonData = await response.json();
        setFetchedData(jsonData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Step 5: Display Data/Error</h2>
      {selectedRows.length > 0 ? (
        <div>
          <h3>Selected Rows:</h3>
          <ul>
            {selectedRows.map((row, index) => (
              <li key={index}>{index}</li>
            ))}
          </ul>
          {fetchedData ? (
            <div>
              <h3>Fetched Data:</h3>
              <ul>
                <li>{fetchedData.title}</li>
                <li>{fetchedData.userId}</li>
              </ul>
            </div>
          ) : (
            <div>Loading data...</div>
          )}
        </div>
      ) : (
        <div>Error: No rows selected</div>
      )}
    </div>
  );
};

const PDFPage = ({ params }) => {
  const [templates, setTemplates] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dateTime, setDateTime] = useState("");
  const selectedRows =
    useSelector((state) => state.rowReducer.selectedRows) || [];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await getTemplates(params.clientName);
        setTemplates(templates.pdfFiles);
      } catch (error) {
        console.log("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [params.clientName]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleDateTimeChange = (event) => {
    setDateTime(event.target.value);
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            templates={templates}
            selectedTemplate={selectedTemplate}
            onNext={handleNextStep}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      case 2:
        return (
          <Step2
            selectedRows={selectedRows}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onDateTimeChange={handleDateTimeChange}
            dateTime={dateTime}
          />
        );
      case 3:
        return <Step3 onDone={handleNextStep} onPrev={handlePrevStep} />;
      case 4:
        return <Step4 onDone={handleNextStep} onPrev={handlePrevStep} />;
      case 5:
        return <Step5 />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center border-2 border-red-800 border-dashed rounded-md">
      <div className="text-center border-2 border-red-800 border-dashed rounded-md m-10 p-10 bg-primary">
        <h1 className="text-5xl text-white underline font-bold">
          PDF Generation
        </h1>
      </div>

      <div className="flex text-center border-2 border-red-800 border-dashed rounded-md m-10 justify-around">
        <button
          className="btn btn-primary self-center"
          disabled={currentStep === 1}
          onClick={handlePrevStep}
        >
          {"<-"}
        </button>
        <ul className="steps m-4">
          <li
            className={currentStep >= 1 ? "step step-primary" : "step"}
            onClick={() => handleStepClick(1)}
          >
            Select Template
          </li>
          <li
            className={currentStep >= 2 ? "step step-primary" : "step"}
            onClick={() => handleStepClick(2)}
          >
            Select Ratings
          </li>
          <li
            className={currentStep >= 3 ? "step step-primary" : "step"}
            onClick={() => handleStepClick(3)}
          >
            Fetch Data
          </li>
          <li
            className={currentStep >= 4 ? "step step-primary" : "step"}
            onClick={() => handleStepClick(4)}
          >
            Selected Rows
          </li>
          <li
            className={currentStep >= 5 ? "step step-primary" : "step"}
            onClick={() => handleStepClick(5)}
          >
            Display Data/Error
          </li>
        </ul>
        <button
          className="btn btn-primary self-center"
          disabled={currentStep === 5}
          onClick={handleNextStep}
        >
          {"->"}
        </button>
    
      </div>
      <div className="text-center border-2 border-red-800 border-dashed rounded-md m-10 p-10">
        {renderStep()}
      </div>
    </div>
  );
};

export default PDFPage;
