import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
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
    let extraArray = '';
    let count = 0;

    const getAssignees = (assigneeArr, workspaceUsers) => {
        let newArr = [];
        assigneeArr.forEach((id) => {
            switch (id) {
                case 'creator':
                    newArr.unshift('creator')
                    break;
                case 'watchers':
                    newArr.unshift('watchers')
                    break;
                case 'triggered_by':
                    newArr.unshift('triggered_by')
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
                        if ((i < 3) || ((i === 3) && (workspaceAssignees.length === 4))) {
                            return (
                                <span key={i}>
                                    {assignee?.user ? (
                                        <>
                                            <Tooltip className="dynamic-tooltip" id={`${assignee.user.username}`} />
                                            <span
                                                className="fa-layers person-icon"
                                                data-tooltip-id={`${assignee.user.username}`}
                                                data-tooltip-content={`${assignee.user.username}`}
                                                data-tooltip-place="top">
                                                <FontAwesomeIcon
                                                    transform="grow-12"
                                                    className="icon-circle"
                                                    style={{ color: `${assignee.user.color}` }}
                                                    icon={icon({ name: 'circle' })} />
                                                <span className='fa-layers-text initials'>{assignee.user.initials}</span>
                                            </span><span className='space'></span>
                                        </>
                                    ) : assignee === "watchers" ? (
                                        <>
                                            <Tooltip className="dynamic-tooltip" id={`watchers`} />
                                            <span
                                                className="fa-layers person-icon"
                                                data-tooltip-id={`watchers`}
                                                data-tooltip-content={`Watchers`}
                                                data-tooltip-place="top">
                                                <FontAwesomeIcon
                                                    transform="grow-12"
                                                    className="icon-circle"
                                                    style={{ color: `grey` }}
                                                    icon={icon({ name: 'circle' })} />
                                                <FontAwesomeIcon
                                                    className='dynamic-assignee-icon'
                                                    icon={icon({ name: 'bell' })} />
                                            </span><span className='space'></span>
                                        </>
                                    ) : assignee === "creator" ? (
                                        <>
                                            <Tooltip className="dynamic-tooltip" id={`creator`} />
                                            <span
                                                className="fa-layers person-icon"
                                                data-tooltip-id={`creator`}
                                                data-tooltip-content={`Task creator`}
                                                data-tooltip-place="top">
                                                <FontAwesomeIcon
                                                    transform="grow-12"
                                                    className="icon-circle"
                                                    style={{ color: `grey` }}
                                                    icon={icon({ name: 'circle' })} />
                                                <FontAwesomeIcon
                                                    className='dynamic-assignee-icon'
                                                    icon={icon({ name: 'check' })} />
                                            </span><span className='space'></span>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip className="dynamic-tooltip" id={`triggered_by`} />
                                            <span
                                                className="fa-layers person-icon"
                                                data-tooltip-id={`triggered_by`}
                                                data-tooltip-content={`Person who Triggered`}
                                                data-tooltip-place="top">
                                                <FontAwesomeIcon
                                                    transform="grow-12"
                                                    className="icon-circle"
                                                    style={{ color: `grey` }}
                                                    icon={icon({ name: 'circle' })} />
                                                <FontAwesomeIcon
                                                    className='dynamic-assignee-icon'
                                                    icon={icon({ name: 'robot' })} />
                                            </span><span className='space'></span>
                                        </>
                                    )}
                                </span>
                            )


                        } else if (i === (workspaceAssignees.length - 1)) {
                            let newText = extraArray.concat(assignee.user.username);
                            extraArray = newText;
                            count++;
                        } else {
                            let newText = extraArray.concat(assignee.user.username + ',' + ' ');
                            extraArray = newText;
                            count++;
                        }

                        // return (
                        //     <span key={i}>
                        //         {assignee?.user ? (
                        //             <>
                        //                 <Tooltip id={`${assignee.user.username}`} />
                        //                 <span
                        //                     className="fa-layers person-icon"
                        //                     data-tooltip-id={`${assignee.user.username}`}
                        //                     data-tooltip-content={`${assignee.user.username}`}
                        //                     data-tooltip-place="top">
                        //                     <FontAwesomeIcon
                        //                         transform="grow-12"
                        //                         className="icon-circle"
                        //                         style={{ color: `${assignee.user.color}` }}
                        //                         icon={icon({ name: 'circle' })} />
                        //                     <span className='fa-layers-text initials'>{assignee.user.initials}</span>
                        //                 </span><span className='space'></span>
                        //             </>
                        //         ) : assignee === "watchers" ? (
                        //             <>
                        //                 <Tooltip id={`watchers`} />
                        //                 <span
                        //                     className="fa-layers person-icon"
                        //                     data-tooltip-id={`watchers`}
                        //                     data-tooltip-content={`Watchers`}
                        //                     data-tooltip-place="top">
                        //                     <FontAwesomeIcon
                        //                         transform="grow-12"
                        //                         className="icon-circle"
                        //                         style={{ color: `grey` }}
                        //                         icon={icon({ name: 'circle' })} />
                        //                     <FontAwesomeIcon
                        //                         className='dynamic-assignee-icon'
                        //                         icon={icon({ name: 'bell' })} />
                        //                 </span><span className='space'></span>
                        //             </>
                        //         ) : assignee === "creator" ? (
                        //             <>
                        //                 <Tooltip id={`creator`} />
                        //                 <span
                        //                     className="fa-layers person-icon"
                        //                     data-tooltip-id={`creator`}
                        //                     data-tooltip-content={`Task creator`}
                        //                     data-tooltip-place="top">
                        //                     <FontAwesomeIcon
                        //                         transform="grow-12"
                        //                         className="icon-circle"
                        //                         style={{ color: `grey` }}
                        //                         icon={icon({ name: 'circle' })} />
                        //                     <FontAwesomeIcon
                        //                         className='dynamic-assignee-icon'
                        //                         icon={icon({ name: 'check' })} />
                        //                 </span><span className='space'></span>
                        //             </>
                        //         ) : (
                        //             <>
                        //                 <Tooltip id={`triggered_by`} />
                        //                 <span
                        //                     className="fa-layers person-icon"
                        //                     data-tooltip-id={`triggered_by`}
                        //                     data-tooltip-content={`Person who Triggered`}
                        //                     data-tooltip-place="top">
                        //                     <FontAwesomeIcon
                        //                         transform="grow-12"
                        //                         className="icon-circle"
                        //                         style={{ color: `grey` }}
                        //                         icon={icon({ name: 'circle' })} />
                        //                     <FontAwesomeIcon
                        //                         className='dynamic-assignee-icon'
                        //                         icon={icon({ name: 'robot' })} />
                        //                 </span><span className='space'></span>
                        //             </>
                        //         )}
                        //     </span>
                        // )
                    })}
                    {
                        workspaceAssignees.length > 4 ? (
                            // return (
                            <span>
                                <>
                                    <Tooltip
                                        className="extras-tip"
                                        id={'extras'} />
                                    <span
                                        className="fa-layers person-icon"

                                        data-tooltip-id={'extras'}
                                        data-tooltip-content={extraArray}
                                        data-tooltip-place="top">
                                        <FontAwesomeIcon
                                            transform="grow-12"
                                            className="icon-circle"
                                            icon={icon({ name: 'circle' })} />
                                        <span className='fa-layers-text initials'>+{count}</span>
                                    </span><span className='space'></span>
                                </>
                            </span>

                            // )

                        ) : (<></>)
                    }
                </Card.Body>
            </Card>
        </>
    )
}
export default AssigneeCard;