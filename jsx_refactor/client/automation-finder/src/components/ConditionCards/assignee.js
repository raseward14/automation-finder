import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';
import "./style.css";


const AssigneeCard = ({ cardDetails, key}) => {
    return (
      <>
        <Card className="condition-card" key={key}>
          <Card.Body>
            <Card.Title className='value'>
              {cardDetails.name}
            </Card.Title>
            <Card className='value'>{cardDetails.op}</Card>

            <div className='change-assignee-field'></div>

          </Card.Body>
        </Card>
      </>
    )
  }
  export default AssigneeCard;