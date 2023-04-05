import axios from "axios";

export async function fetchImg(url) {
    const response = await axios.get(url);
    return response.data;
};