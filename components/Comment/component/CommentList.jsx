import React, { Fragment } from "react";

const CommentList = ({ comments }) => {

  const getFormatedDataTime = (timeStamp) => {
    return new Date(timeStamp).toLocaleString({dateStyle: 'full'});
  }
  return (
    <Fragment>
      {
        comments?.map((comment, i) => {
          return (
            <div className="" key={i}>
              <div className="flex">
                <div>
                  <img src={comment?.authorImage} alt="User" className="rounded-full" width={30} height={30} />
                </div>
                <div className="ml-4">
                  <p className="p-0 m-0 text-sm font-bold capitalize">{comment?.authorName}</p>
                  <p className="p-0 m-0 text-xs text-slate-400"> { getFormatedDataTime(comment?.updatedAt) }</p>
                </div>
              </div>
              <div className="flex mt-2">
                <span className="leading-4 text-sm text-slate-500">{comment?.comment}</span>
              </div>
              <hr className="my-2"/>
            </div>
          )

        })
      }
    </Fragment>
  )
}

export default CommentList;