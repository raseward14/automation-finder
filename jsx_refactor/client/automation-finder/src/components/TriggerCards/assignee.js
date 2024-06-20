import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import "./style.css";

// if cardDetails.type === 'assignee'
// assignee added > cardDetails.trigger.conditions[0].after forEach (array)
// if cardDetails.type === 'assignee_removed'
// assignee removed > cardDetails.trigger.conditions[0].before forEach (array)
const AssigneeCard = ({ triggerName, cardDetails, shard, teamId }) => {
    const [JWT, setJWT] = useState(localStorage.getItem('jwt'));
    const [assigneeArray, setAssigneeArray] = useState([]);
    const [workspaceAssignees, setWorkspaceAssignees] = useState([]);


    const getAssignees = (assigneeArr, workspaceUsers) => {
        console.log('the assignees set in the trigger: ', assigneeArr);
        console.log('the Workspace members: ', workspaceUsers);
        let newArr = [];
        assigneeArr.forEach((id) => {
            switch (id) {
                case 'creator':
                    newArr.push('creator')
                    break;
                case 'watchers':
                    newArr.push('watchers')
                    break;
                case 'triggered_by':
                    newArr.push('triggered_by')
                    break;
                default:
                    let foundObject = workspaceUsers.find((object) => object.user.id === id)
                    newArr.push(foundObject)
                    break;
            }
        })
        setWorkspaceAssignees(newArr);
    }

    const getWorkspaceMembers = async (assigneeArr) => {
        // needs shard, Workspace_id, and bearer token
        const res = await axios.post(
            'http://localhost:8080/automation/members',
            {
                shard: shard,
                teamId: teamId,
                bearer: JWT
            }
        );
        if (res?.data) {
            getAssignees(assigneeArr, res.data.members);
        };
    };

    useEffect(() => {
        console.log('these are the assignees: ', workspaceAssignees);
    }, [workspaceAssignees])

    useEffect(() => {
        if (assigneeArray?.length > 0) {
            getWorkspaceMembers(assigneeArray)
        }
    }, [assigneeArray]);

    useEffect(() => {
        if (cardDetails.trigger.type === 'assignee') {
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
                    {workspaceAssignees.map((assignee, i) => {
                        {
                            assignee?.user ? (
                                <span>{assignee.user.username}</span>
                            ) : (
                            <span key={i}>{assignee}</span>
                        )
                        }
                    })}
                </Card.Body>
            </Card>
        </>
    )
}
export default AssigneeCard;