import { Api } from "../Api";
import axios from 'axios' ;


export const saveToHistory = async (payload) => {
    try {
      await axios.post(Api + "/history", payload, {
        withCredentials: true,
      });
    } catch (err) {
      console.log("History save error:", err);
    }
  };