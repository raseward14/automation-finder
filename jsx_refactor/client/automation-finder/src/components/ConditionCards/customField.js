import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CustomFieldCard = ({ cardDetails, key}) => {
  useEffect(() => {
    console.log('made it to the Custom Field condition card', cardDetails)
  }, [])
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
  export default CustomFieldCard;