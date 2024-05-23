import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const DateCard = ({ cardDetails, key}) => {
    return (
      <>
        <Card className="condition-card" key={key}>
          <Card.Body>
            <Card.Title className='value'>
              {cardDetails.name}
            </Card.Title>
            <Card className='value'>{cardDetails.op}</Card>

          </Card.Body>
        </Card>
      </>
    )
  }
  export default DateCard;