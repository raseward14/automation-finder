import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    
    useEffect(() => {
        console.log('another testt', cardDetails?.action?.input?.comment);
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
export default CommentCard;
