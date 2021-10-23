/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import Papa from "papaparse"

import { Product } from "./types";

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vQbo-pTYwowIWGKPp3RY9XA-_M4nnKRNJ4qim2cwcBywlgixAgVue1nSIAP_Z-VlQUpFiRv730VESBz/pub?gid=0&single=true&output=csv`,
      {
        responseType: 'blob'
      }
    )
    .then((response) => {
      return new Promise<Product[]>((resolve, reject) => {
        Papa.parse(response.data, {
          header: true,
          complete: (results) =>  {
            const products = results.data as Product[] 
            return resolve(
              products.map((product) => ({
              ...product,
              price: Number(product.price),
            })))
          },
          error: (error) => reject(error.message)
        })
      })
    })
  }
}