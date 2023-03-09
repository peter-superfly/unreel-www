import React, { Fragment, useRef, useEffect } from "react";
import { postComment } from "@/lib/services/comment";

import { useRouter } from "next/router";

const CommentForm = (props) => {
  const { commentId, pageId, userDetail, handleStatus, handleClose } = props;
  const commentText = useRef();
  const router = useRouter();

  useEffect(() => {
    const previousCommentText = localStorage.getItem('commentText');
    if(previousCommentText && commentText?.current) {
      commentText.current.value = previousCommentText;
      localStorage.removeItem('commentText');
    }
  }, [commentText])

  const onSubmit = () => {
    if (commentText?.current?.value) {
      const payload = {
        comment: commentText.current.value,
        blockId: commentId,
        pageId: pageId,
        ...userDetail
      }
      if(!userDetail?.authorName) {
        localStorage.setItem('commentText', commentText.current.value);
        localStorage.setItem('activeCommentId', commentId);
        router.push('/api/auth/login');
        return;
      }
      postComment(`${window.origin}/api/comments`, payload).then(response => {
        commentText.current.value = "";
        handleStatus({
          status: true,
          comment: {...payload, objectID: response.objectID, updatedAt: Date.now() }
        })
      }).catch(error => {
        handleStatus({
          status: false,
          comment: null
        })
      })
    }
  }

  const closeComment = () => {
    handleClose();
  }

  return (
    <Fragment>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-full px-3 mb-2 mt-2">
          <textarea
            className="rounded w-full border px-3 text-sm comment-input"
            placeholder='Type Your Comment'
            ref={commentText}
          />
        </div>
        <div className="w-full justify-end md:w-full flex items-start md:w-full px-3">
          <div>
            <button type="button" className="text-white text-xs uppercase rounded shadow-md bg-red-600 p-2 m-2" onClick={closeComment}>Close</button>
            <button type="button" className="text-white text-xs uppercase rounded shadow-md bg-black p-2 m-2" onClick={onSubmit}>Comment</button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CommentForm;