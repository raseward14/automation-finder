import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// task type changes
const TaskTypeCard = ({ triggerName, cardDetails }) => {
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>
                        {triggerName}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}
export default TaskTypeCard;