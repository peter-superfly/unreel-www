import axios from "axios";

export const getMember = async (path) => {
  try {
    const res = await axios.get(path);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}