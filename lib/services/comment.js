import axios from "axios";

export const postComment = async (path, payload) => {
  try {
    const res = await axios.post(`${path}`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getCommentsByPageId = async (path, pageId) => {
  try {
    const res = await axios.get(`${path}/${pageId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}