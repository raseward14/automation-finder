import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const ChangeDateCard = ({ cardDetails }) => {
    // change start date
    // change due date
    return (
        <>
            <Card className="action-card">
                <Card.Body>
                    <Card.Title className='value'>
                        {cardDetails.name}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}

export default ChangeDateCard;