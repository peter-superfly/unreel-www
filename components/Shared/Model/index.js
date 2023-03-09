import React, { Fragment, useContext } from "react";
import { MdClose } from "react-icons/md";

import { GlobalContext } from "@/lib/context/global";

const VertexModel = ({ handleAction }) => {
  const { globalData, setGlobalData } = useContext(GlobalContext);
  const { model } = globalData;

  function handleModel(status) {
    setGlobalData({
      ...globalData,
      model: {
        ...globalData.model,
        show: status
      }
    })
  }

  return (
    <Fragment>
      {model?.show && (
        <div className="app-model justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999">
          <div className="relative width-40 my-6">
            <div className="border rounded-lg shadow-lg relative flex flex-col w-full bg-white">
              <div className="justify-end flex px-4 pt-3 border-b">
                <div className="flex justify-center">
                  <h6>{model.title}</h6>
                </div>
                <div className="flex justify-end">
                  <p className="m-0 pb-2" onClick={() => { handleModel(false); }}>
                    <MdClose size={30} />
                  </p>
                </div>
              </div>
              <div className="text-center relative p-5 flex-auto">
                <h5 className="mb-4">{globalData?.model?.body}</h5>
                <div className="flex justify-center mt-10">
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded mr-4" 
                    onClick={() => { handleModel(false); }}
                  >{model.btnCancel}</button>  
                  <button 
                    className="bg-neutral-800 hover:bg-black text-white font-bold py-1 px-4 rounded"
                    onClick={() => { handleAction() }}
                  >{model.btnSuccess}</button>  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export { VertexModel };
