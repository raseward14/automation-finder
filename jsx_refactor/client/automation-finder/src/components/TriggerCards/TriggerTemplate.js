import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";
// template cared to be duplicated for new triggers
const TriggerTemplateCard = ({ triggerName, cardDetails }) => {
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
export default TriggerTemplateCard;