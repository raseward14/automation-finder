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
            console.log(id)
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
        console.log(newArr)
        setWorkspaceAssignees(newArr);
    }

    const getWorkspaceTeams = async (teamIdArr) => {
        const res = await axios.post(
            'http://localhost:8080/automation/userTeams',
            {
                shard: shard,
                teamId: teamId,
                bearer: JWT
            }
        );
        if (res?.data) {
        // long strings 
        // d17b78cc-7d80-4887-8e51-c126dd35a25d
        // request: https://prod-us-west-2-2.clickup.com/user/v1/team/42085025/group
        // we need the shard, Workspace id, bearer token 
        // response is JSON { "groups": [ { "id": "d17b78cc-7d80-4887-8e51-c126dd35a25d", "name": "team-name", "initials": "O" } ] }
            console.log('userTeam api response', res.data.groups)
            let workspaceTeams = res.data.groups;
            let newArr = [];
            teamIdArr.forEach((id) => {
                console.log('the id string', id)
                console.log('the response from api', workspaceTeams)
                console.log(workspaceTeams)
                let foundObject = workspaceTeams.find((object) => object.id === id)
                console.log(foundObject);
                if (foundObject !== undefined) {
                    newArr.push(foundObject)
                }
            })
            console.log(newArr);
            let totalArr = newArr.concat(workspaceAssignees)
            console.log(totalArr);
            setWorkspaceAssignees(totalArr);
        }
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

    // 7e5011f7-f8ca-44d7-bcb7-e7827fca874c
    useEffect(() => {
        if (assigneeArray?.length > 0) {

            console.log('assignee trigger', assigneeArray);
            //remove teamIds from the user array
            let userArr = assigneeArray.filter(item => {
                const dynamicOptions = ['watchers', 'creator', 'triggered_by'];
                if ((typeof item === "number") || (dynamicOptions.includes(item))) {
                    console.log(item)
                    return item;
                };
            });
            if (userArr?.length > 0) {
                getWorkspaceMembers(userArr);
            }
            // remove dynamic assignees, and userIds from the assignee array
            let teamIdArr = assigneeArray.filter(item => {
                const dynamicOptions = ['watchers', 'creator', 'triggered_by'];
                if (typeof item !== "number" && !dynamicOptions.includes(item)) {
                    return item;
                };
            });
            if (teamIdArr?.length > 0) {
                getWorkspaceTeams(teamIdArr);
            }
        }
    }, [assigneeArray]);

    useEffect(() => {
        if (cardDetails.trigger.type === 'assignee') {
            setAssigneeArray(cardDetails.trigger.conditions[0].after);
        } else {
            setAssigneeArray(cardDetails.trigger.conditions[0].before);
        };
    }, [cardDetails]);

    useEffect(() => {
        console.log(workspaceAssignees)
    }, [workspaceAssignees])

    return (
        <>
            <Card>
                <Card.Body>

                    <Card.Title className='value'>
                        {triggerName}
                    </Card.Title>

                    <div className='change-assignee-field'>
                        {workspaceAssignees.map((assignee, i) => {
                            if ((i < 3) || ((i === 3) && (workspaceAssignees.length === 4))) {
                                return (
                                    <span key={i}>
                                        {assignee?.user ? (
                                            <>
                                                <Tooltip className="dynamic-tooltip" id={`t-${assignee?.user?.username}`} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={`t-${assignee?.user?.username}`}
                                                    data-tooltip-content={`${assignee?.user?.username}`}
                                                    data-tooltip-place="top">
                                                    <FontAwesomeIcon
                                                        transform="grow-12"
                                                        className="icon-circle"
                                                        style={{ color: `${assignee?.user?.color}` }}
                                                        icon={icon({ name: 'circle' })} />
                                                    <span className='fa-layers-text initials'>{assignee?.user?.initials}</span>
                                                </span><span className='space'></span>
                                            </>
                                        ) : assignee === "watchers" ? (
                                            <>
                                                <Tooltip className="dynamic-tooltip" id={`t-watchers`} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={`t-watchers`}
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
                                                <Tooltip className="dynamic-tooltip" id={`t-creator`} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={`t-creator`}
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
                                        ) : assignee === "triggered_by" ? (
                                            <>
                                                <Tooltip className="dynamic-tooltip" id={`t-triggered_by`} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={`t-triggered_by`}
                                                    data-tooltip-content={`Person who Triggered`}
                                                    data-tooltip-place="top">
                                                    <FontAwesomeIcon
                                                        transform="grow-12"
                                                        className="icon-circle"
                                                        style={{ color: `grey` }}
                                                        icon={icon({ name: 'circle' })} />
                                                    <FontAwesomeIcon
                                                        className='dynamic-assignee-icon triggered-icon'
                                                        icon={icon({ name: 'robot' })} />
                                                </span><span className='space'></span>
                                            </>
                                        ) : (
                                            <>
                                                {/* <Tooltip className="dynamic-tooltip" id={`t-${assignee.user.initials}`} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={`t-${assignee.user.initials}`}
                                                    data-tooltip-content={`${assignee.user.initials}`}
                                                    data-tooltip-place="top">
                                                    <FontAwesomeIcon
                                                        transform="grow-12"
                                                        className="icon-circle"
                                                        style={{ color: `grey` }}
                                                        icon={icon({ name: 'circle' })} />
                                                    <span className='fa-layers-text initials'>{assignee.user.initials}</span>
                                                </span><span className='space'></span> */}
                                            </>
                                        )}
                                    </span>
                                )


                            } else if (i === (workspaceAssignees.length - 1)) {
                                let newText = extraArray.concat(assignee?.user?.username);
                                extraArray = newText;
                                count++;
                            } else {
                                let newText = extraArray.concat(assignee?.user?.username + ',' + ' ');
                                extraArray = newText;
                                count++;
                            }
                        })}
                        {workspaceAssignees.length > 4 ? (
                            <span>
                                <Tooltip
                                    className="extras-tip"
                                    id={'t-extras'} />
                                <span
                                    className="fa-layers person-icon"
                                    data-tooltip-id={'t-extras'}
                                    data-tooltip-content={extraArray}
                                    data-tooltip-place="top">
                                    <FontAwesomeIcon
                                        transform="grow-12"
                                        className="icon-circle"
                                        icon={icon({ name: 'circle' })} />
                                    <span className='fa-layers-text initials'>+{count}</span>
                                </span><span className='space'></span>
                            </span>
                        ) : (<></>)}
                    </div><br />

                </Card.Body>
            </Card>
        </>
    )
}
export default AssigneeCard;