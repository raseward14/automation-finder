import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// task or subtask created
// task created
// subtask created
const TaskCreatedCard = ({ triggerName, cardDetails }) => {
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
export default TaskCreatedCard;