import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"
// template cared to be duplicated for new conditions
const ConditionTemplateCard = ({ cardDetails, key}) => {
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
  export default ConditionTemplateCard;