import { useEffect, useState } from "react";
import { getBooks } from "../routes/products";
import { addToCart, updateCart } from "../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Products = (props) => {
  const { filters, sorting } = props;
  const { cart } = useSelector((state) => state.cart);
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();

  const handleGetBooks = async () => {
    try {
      const response = await getBooks(filters, sorting);
      setBooks(response); 
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
  
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          &#9733;
        </span>
      );
    }
    return stars;
  };
  
  const addBookToCart = (book) => {
    const existingBook = cart.find((item) => item.id === book.id);
  
    const bookDetails = {
      id: book.id,
      title: book.volumeInfo.title || "Unknown Title",
      author: book.volumeInfo.authors?.join(", ") || "Unknown",
      price: book.saleInfo.retailPrice?.amount || 0,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "/default-image.png",
      quantity: 1,
    };
  
    if (existingBook) {
      dispatch(
        updateCart({
          ...bookDetails,
          quantity: existingBook.quantity + 1,
        })
      );
    } else {
      dispatch(addToCart(bookDetails));
    }
  };
  

  useEffect(() => {
    handleGetBooks();
  }, [filters, sorting]);

  return (

<div className="books-container">
  {books?.map((book) => (
    <div key={book.id} className="book-card">
      <img
        src={book.volumeInfo.imageLinks?.thumbnail}
        alt={book.volumeInfo.title}
      />
      <h2 className="book-title">{book.volumeInfo.title}</h2>
      <h3 className="book-author">{book.volumeInfo.authors?.join(", ")}</h3>
      <div className="book-description">
        <p>{book.volumeInfo.description?.slice(0, 150)}...</p>
        <div className="description-hover">
          <p>{book.volumeInfo.description}</p> 
        </div>
      </div>
      <div className="rating">
        {book.volumeInfo.averageRating ? (
          renderStars(book.volumeInfo.averageRating)
        ) : (
          <span>Rating: N/A</span>
        )}
      </div>
      <div className="price-cart">
        <p className="price">${book.saleInfo.retailPrice?.amount || 0}</p>
        <div>
          <button className="add-to-cart" onClick={() => addBookToCart(book)}>
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

  );
};

export default Products;
