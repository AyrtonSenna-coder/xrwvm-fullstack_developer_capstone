// frontend/src/components/Dealers/Dealer.js   ← Replace EVERYTHING with this
import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Header/Header";           // ← This gives you the full header + styling
import "../assets/style.css";                    // ← Main CSS
import "./Dealers.css";                         // ← Dealers-specific CSS

const Dealer = () => {
  const { id } = useParams();

  // Hard-coded data that matches what the backend will return later
  const dealer = {
    full_name: "Empire Ford of Newburgh",
    city: "Newburgh",
    state: "NY",
    address: "123 Main Street",
    id: id
  };

  const reviews = [
    { name: "John Doe", purchase_date: "2023-10-15", review: "Great service and friendly staff!" },
    { name: "Jane Smith", purchase_date: "2023-09-20", review: "Best car buying experience ever." },
    { name: "Mike Johnson", purchase_date: "2023-08-05", review: "Highly recommend this dealership." }
  ];

  return (
    <>
      <Header />   {/* ← This gives you the blue header + login/logout */}

      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ color: "#007bff", fontSize: "2.5em" }}>{dealer.full_name}</h1>
        <p style={{ fontSize: "1.2em", color: "#555" }}>
          {dealer.city}, {dealer.state} • {dealer.address}
        </p>
        <hr style={{ margin: "30px 0" }} />

        <h2 style={{ color: "#333" }}>Customer Reviews</h2>
        <div className="reviews-container">
          {reviews.map((r, i) => (
            <div key={i} className="review-card" style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              margin: "15px 0",
              backgroundColor: "#f9f9f9"
            }}>
              <strong style={{ color: "#007bff" }}>{r.name}</strong>
              <span style={{ color: "#888", marginLeft: "10px" }}>– {r.purchase_date}</span>
              <p style={{ marginTop: "10px" }}>{r.review}</p>
            </div>
          ))}
        </div>

        <br />
        <Link to={`/ PostReview/${id}`}>
          <button className="btn btn-primary" style={{
            padding: "12px 30px",
            fontSize: "1.1em",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px"
          }}>
            Add Review
          </button>
        </Link>
      </div>
    </>
  );
};

export default Dealer;