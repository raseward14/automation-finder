import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// if cardDetails.type === 'assignee'
// assignee added > cardDetails.trigger.conditions[0].after forEach (array)
// if cardDetails.type === 'assignee_removed'
// assignee removed > cardDetails.trigger.conditions[0].before forEach (array)
const AssigneeCard = ({ triggerName, cardDetails }) => {
    const [assigneeArray, setAssigneeArray] = useState([]);

    const getAssignees = (arr) => {

    }

    useEffect(() => {
        if(assigneeArray.length) {
            console.log('assignees are: ', assigneeArray)
        }
    }, [assigneeArray]);

    useEffect(() => {
        console.log('assignee card details: ', cardDetails)
        if(cardDetails.type === 'assignee') {
            setAssigneeArray(cardDetails.trigger.conditions[0].after);
        } else {
            setAssigneeArray(cardDetails.trigger.conditions[0].before);
        };
    }, [cardDetails])

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
export default AssigneeCard;