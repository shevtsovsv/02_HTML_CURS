import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/", // укажите ваш бэкэнд адрес
});

export default axiosInstance;
