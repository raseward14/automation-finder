import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const WatcherCard = ({ cardDetails, key}) => {
    return (
      <>
        <Card className="condition-card" key={key}>
          <Card.Body>
            <Card.Title>
              {cardDetails.name}
            </Card.Title>
          </Card.Body>
        </Card>
      </>
    )
  }
  export default WatcherCard;