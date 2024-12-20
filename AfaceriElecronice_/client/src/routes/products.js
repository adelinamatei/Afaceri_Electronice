import { sortingOptions } from "../constants/sort";
import { getDummyApiUrl } from "../utils/envUtils";

export const getBookCategories = async () => {
  const url = "https://www.googleapis.com/books/v1/volumes?q=*";
  try {
    const result = await fetch(url);
    const response = await result.json();
    const categories = new Set();  
    response.items?.forEach((book) => {
      if (book.volumeInfo?.categories) {
        book.volumeInfo.categories.forEach((category) => {
          categories.add(category);  
        });
      }
    });

    return Array.from(categories);  
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getBooks = async (filters, sortingId) => {
  let url = "https://www.googleapis.com/books/v1/volumes?q=*"; 

  if (filters && filters.category) {
    url += `+subject:${filters.category}`;
  }

  try {
    const result = await fetch(url);
    const response = await result.json();
    let books = response.items || [];

    books = books.map((book) => {
      const price = book.saleInfo.retailPrice?.amount || 0;
      if (price === 0) {
        book.saleInfo.retailPrice = { amount: Math.floor(Math.random() * (30 - 5 + 1) + 5) }; // Preț aleatoriu între 5 și 30
      }
      return book;
    });

    if (sortingId === 1) {
      books = books.sort((a, b) => {
        const priceA = a.saleInfo.retailPrice?.amount || 0;
        const priceB = b.saleInfo.retailPrice?.amount || 0;
        return priceA - priceB;
      });
    }

    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};



