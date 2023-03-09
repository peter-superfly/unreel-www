import React, { Fragment, useState, useEffect } from "react";
import CommentForm from "./component";
import CommentList from "./component/CommentList";
import { getCommentsByPageId } from "@/lib/services/comment";
import { bindComments } from "./utils";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { appDocs, wikiPage } from "@/lib/constant";

const Comment = () => {

  const router = useRouter();
  const { user } = useUser();

  const [show, setShow] = useState();
  const [commentId, setCommentId] = useState();
  const [selector, setSelector] = useState();
  const [comments, setComments] = useState([]);
  const [commentLocations, setCommentsLocations] = useState({});
  const [selectedComments, setSelectedComments] = useState([]);
  const [blockComments, setBlockComments] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [bindAction, setBindAction] = useState('create');

  let pageId = ''
  const { block_id } = router.query;
  pageId = block_id

  if(!pageId) {
    if(router.asPath === '/docs') {
      pageId = appDocs.block_id;
    }
    if(router.asPath === '/wiki') {
      pageId = wikiPage.block_id;
    }
  }

  useEffect(() => {
    if (user) {
      setUserDetail({
        authorName: user?.nickname,
        authorEmail: user?.email,
        authorImage: user?.picture
      })
    }
  }, [user])

  useEffect(() => {
    onPageChange();
    getCommentsData();
  }, [pageId]);

  useEffect(() => {
    document.querySelector('div').onpointerup = () => {
      onTextSelect();
    }
  }, []);

  useEffect(() => {
    if (show) {
      renderCommentForm();
      setBindAction('');
    }
  }, [show]);

  useEffect(() => {
    const element = document.querySelector('.app-main-container');
    if (Object.keys(commentLocations).length !== 0) {
      element.addEventListener('scroll', handleScroll, true);
      const screenWidth = window.innerWidth;
      if(selectedComments.length === 0 && screenWidth > 1024) {
        if(selectedComments.blockId !== commentLocations[`${commentLocations['first']}`]) {
          setCommentId(commentLocations[`${commentLocations['first']}`]);
          setSelector(`notion-block-${commentLocations[`${commentLocations['first']}`]}`);
          setSelectedComments(blockComments[commentLocations[`${commentLocations['first']}`]]);
          setShow(true)
        }
      }
    }
    return () => {
      element.removeEventListener('scroll', handleScroll, true);
    };
  }, [commentLocations]);

  useEffect(() => {
    if (Object.keys(blockComments).length !== 0) {
      const comments = [];
      for (const key in blockComments) {
        comments.push({
          blockId: blockComments[key][0].blockId,
          count: blockComments[key].length
        })
      }
      bindComments(comments, bindAction, handleCommentIconClick, handleCommentLocation);
      setCommentState()
    }

  }, [blockComments]);

  useEffect(() => {
    if(blockComments[commentId]) {
      setSelectedComments(blockComments[commentId]);
    } else {
      setSelectedComments([]);
    }
  }, [commentId]);

  function handleScroll(event) {
    let scrollTop = document.querySelector('.app-main-container').scrollTop;
   
    scrollTop = parseInt(scrollTop + commentLocations['first']);
    const screenWidth = window.innerWidth;
    for (let i = (scrollTop - 5); i < (scrollTop + 15); i++ ) {
      if(commentLocations[`${i}`]  && screenWidth > 1024 ){
        const comment = blockComments[commentLocations[`${i}`]] || [];
        setCommentId(commentLocations[`${i}`])
        setSelectedComments(comment);
        setShow(true)
      }
    }
  }

  function handleCommentLocation(locations) {
    setCommentsLocations(locations)
  }

  const onPageChange = () => {
    setShow(false);
    setCommentId(null);
    setSelector(null);
    setComments([]);
    setSelectedComments([]);
    setBlockComments([]);
    setCommentsLocations({});
  }

  const getCommentsData = () => {
    getCommentsByPageId(`${window.origin}`, `/api/comments/${pageId}`).then(comments => {
      if (comments.length > 0) {
        const blockCommentsObject = {};
        setComments(comments);
        for (const comment of comments) {
          if (!blockCommentsObject[comment.blockId]) {
            blockCommentsObject[comment.blockId] = [comment]
          } else {
            blockCommentsObject[comment.blockId].push(comment)
          }
        }
        setBlockComments(blockCommentsObject);
      } else {
        bindComments([], bindAction, handleCommentIconClick, handleCommentLocation);
      }
    })
  }

  const handleCommentIconClick = (id) => {
    setCommentId(id);
    setSelector(`notion-block-${id}`);
    const comment = blockComments[id] ? blockComments[id] : [];
    setSelectedComments(comment)
    setShow(true);
  }

  function onTextSelect() {
    try {
      const selection = document.getSelection();
      const selectedText = selection.toString();
      if (selectedText) {
        const clases = selection?.baseNode?.parentNode?.classList || [];
        if (clases?.length > 2) {
          const classForSelection = clases[clases.length - 1];
          const validationKays = classForSelection.split('-');
          if (validationKays[0] === 'notion' && validationKays[1] === 'block') {
            setCommentId(validationKays[2]);
            setSelector(classForSelection);
            setShow(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setShow(false);
    }
  }

  const renderCommentForm = () => {
    // const selectedNode = document.querySelector(`.${selector}`);
    // const location = selectedNode.getBoundingClientRect();
    // const formSection = document.getElementById('comment-form-section');
    // formSection.style.top = `${parseInt(location.top)}px`;
    // formSection.style.maxHeight =`calc(100vh - ${parseInt(location.top)}px)`;
    // formSection.style.left = `${parseInt(location.width + location.left + 10)}px`;
  }

  const handleStatus = (response) => {
    if (response.status) {
      const newSelectedComments = [...selectedComments];
      newSelectedComments.push(response.comment);
      setSelectedComments(newSelectedComments);
      let newBlockComment = blockComments[response.comment.blockId];
      if(!newBlockComment) {
        setBindAction('extend');
        newBlockComment = [response.comment]
      } else{
        newBlockComment.push(response.comment);
        setBindAction('extend');
      }
      setBlockComments({
        ...blockComments,
        [response.comment.blockId]: newBlockComment
      })
    }
  }

  const handleClose = () => {
    setShow(false);
  }

  function setCommentState() {
    const activeCommentId = localStorage.getItem('activeCommentId');
    if(activeCommentId) {
      if(blockComments[activeCommentId]){
        setSelectedComments(blockComments[activeCommentId]);
      }
      setShow(true);
      localStorage.removeItem('activeCommentId');
    }
  }

  return (
    <Fragment>
      <div className="comment-section-base">
        {
          show && (
            <div id="comment-form-section" className="border p-4 shadow-lg bg-white rounded border">
              <CommentList comments={selectedComments} />
              <CommentForm
                commentId={commentId}
                pageId={pageId}
                userDetail={userDetail}
                handleStatus={handleStatus}
                handleClose={handleClose}
              />
            </div>
          )
        }
      </div>

    </Fragment>
  )
}

export default Comment;

