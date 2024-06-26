import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// tag added
// tag removed
const TagCard = ({ triggerName, cardDetails }) => {
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className='value'>
                        {triggerName}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}
export default TagCard;