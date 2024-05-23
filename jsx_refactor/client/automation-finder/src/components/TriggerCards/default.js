import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// All checklists resolved
// all subtasks resolved
// comment is added
// due date arrives
// due date changes
// existing task or subtask is added to this location
// existing task or subtask is mnoved to this location
// start date arrives
// start date changes
// task or subtask linked
// Task linked
// Subtask linked
// task or subtask unblocked
// Task unblocked
// Subtask unblocked
// time tracked
const DefaultCard = ({ triggerName, cardDetails }) => {
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
export default DefaultCard;