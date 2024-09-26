import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// cfbd77f1-e930-4f59-900e-1831f1932674
// Custom Field changes
const CustomFieldCard = ({ triggerName, cardDetails }) => {

    useEffect(() => {
        console.log('trigger name: ', triggerName)
        console.log('card details: ', cardDetails)
    }, [])
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
export default CustomFieldCard;