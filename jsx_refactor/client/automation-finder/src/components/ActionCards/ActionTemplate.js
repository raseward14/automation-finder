import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"
// template cared to be duplicated for new actions
const ActionTemplateCard = ({ cardDetails, key}) => {
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
  export default ActionTemplateCard;