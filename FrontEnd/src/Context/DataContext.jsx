import axios from "axios";
import { createContext, useState } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState();

  // fetching all products from api
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('https://electromart-backend-five.vercel.app/api/v1/products/getAllProducts')
      console.log(res);

    } catch (error) {
      console.log(error);

    }
  }
  return <DataContext.Provider value={{ data, setData, fetchAllProducts }}>
    {children}
  </DataContext.Provider>
}