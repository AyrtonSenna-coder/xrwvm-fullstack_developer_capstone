import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';   // ← Added Link here
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  const { id } = useParams();

  useEffect(() => {
    // Hard-coded demo data
    setDealer({
      full_name: "Fix San Car Dealership",
      city: "San Francisco",
      address: "9 Harris St",
      zip: "94110",
      state: "California"
    });

    setReviews([
      {
        name: "John Doe",
        review: "Excellent service! Highly recommend.",
        sentiment: "positive",
        car_make: "Mazda",
        car_model: "MX-5",
        car_year: "2003"
      },
      {
        name: "Sarah Lee",
        review: "Great experience buying my car here.",
        sentiment: "positive",
        car_make: "Toyota",
        car_model: "Camry",
        car_year: "2022"
      }
    ]);

    setUnreviewed(false);

    // Correct place: INSIDE useEffect
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <Link to={`/postreview/${id}`}>
          <img
            src={review_icon}
            style={{ width: '10%', marginLeft: '10px', marginTop: '10px', cursor: 'pointer' }}
            alt="Post Review"
          />
        </Link>
      );
    } else {
      setPostReview(<></>);
    }
  }, [id]);   // ← Correctly closed here

  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon :
           sentiment === "negative" ? negative_icon : neutral_icon;
  };

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey", display: "inline" }}>
          {dealer.full_name}
        </h1>
        {postReview}
      </div>

      <h4 style={{ color: "grey" }}>
        {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
      </h4>

      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <text>Loading Reviews....</text>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment'/>
              <div className='review'>{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;