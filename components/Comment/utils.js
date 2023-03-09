import { commentSvg } from "../Svg";

export const bindComments = (comments, action, onClickHandler, handleCommentLocation) => {
  try {
    const selectors = [...document.querySelectorAll(`[class*="notion-block"]`)];
    const commentsLocation = {};
    let firstCommentLocation = 0;
    for(const element of selectors) {
      const classList = [...element.classList];
      if(Array.isArray(classList)) {
        if(classList.includes('notion-text')) {
          const blockClass = classList[classList.length - 1];
          const blockId = blockClass.split('-')[2];
          const cmt = comments.find(c => c.blockId === blockId);
          const count = cmt ? cmt.count : 0;

          const location = element.getBoundingClientRect();
          const top = parseInt(location.top);
          if(firstCommentLocation === 0) {
            firstCommentLocation = top
          } else {
            if(firstCommentLocation > top)  firstCommentLocation = top
          }
          commentsLocation[top] = blockId

          const comment = {
            blockId: blockId,
            count: count
          }
          setIconOnText(element, comment, action, onClickHandler)
        }
      }
    }

    commentsLocation['first'] = firstCommentLocation;
    handleCommentLocation(commentsLocation);

  } catch (error) {
    console.log(error);
  }
}

function setIconOnText(selectedNode, comment, action, onClickHandler) {
  let isExist = false;
  for(const cn of selectedNode.childNodes) {
    if(cn.id === comment.blockId) {
      isExist = true
    }
  }
  if(!isExist) {
    const boxClas = comment.count ? 'comment-box': 'comment-box hide-box'
    const d = `<div class="${boxClas}" id=${comment.blockId}>${commentSvg}<span id='${comment.blockId}-count'>${comment.count}</span></div>`
    selectedNode.innerHTML = d + selectedNode.innerHTML;
    const element = document.getElementById(comment.blockId);
    element.addEventListener("click", () => onClickHandler(comment.blockId));
  }

  if(action === 'extend') {
    updateIconOnText(comment);
  }
}

function updateIconOnText (comment) {
  const element = document.getElementById(`${comment.blockId}-count`);
  element.innerText = comment.count;
  if(comment.count > 0) {
    element.parentNode.classList.remove('hide-box')
  }
}       