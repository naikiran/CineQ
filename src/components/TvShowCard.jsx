import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const TvShowCard = ({ show }) => {
  return (
    <Card style={{ width: "18rem", margin: "10px", backgroundColor: "#1e1e1e", color: "white" }}>
      <Card.Img
        variant="top"
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.name}
      />
      <Card.Body>
        <Card.Title>{show.name}</Card.Title>
        <Card.Text>
          <strong>Rating:</strong> {show.vote_average.toFixed(1)} / 10
        </Card.Text>
        <Link to={`/tvshows/${show.id}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default TvShowCard;