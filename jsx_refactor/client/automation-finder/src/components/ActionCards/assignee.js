import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const AssigneeCard = ({ cardDetails, key}) => {
  useEffect(() => {
    console.log('this is a testt')
  })
    return (
      <>
        <Card className="action-card" key={key}>
          <Card.Body>
            <Card.Title className='value'>
              {cardDetails.name}
            </Card.Title>
          </Card.Body>
        </Card>
      </>
    )
  }
  export default AssigneeCard;