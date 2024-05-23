import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

// delete task or subtask
// delete task
// delete subtask
// archive task
// archive subtask
// archive task or subtask
const DefaultCard = ({ cardDetails, key }) => {
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

export default DefaultCard;
