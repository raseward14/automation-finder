import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';
import "./style.css"

const AssigneeCard = ({ cardDetails, shard, teamId }) => {
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));
  // unassign
  const [unassign, setUnassign] = useState(false);
  // Add assignees
  const [addAssignee, setAddAssignee] = useState([]);
  let extraAdd = '';
  let addCount = 0;
  // Remove assignees
  const [remAssignee, setRemAssignee] = useState([]);
  let extraRem = '';
  let remCount = 0;
  // Reassign
  const [reassign, setReassign] = useState([]);
  let extraReassign = '';
  let reassignCount = 0;

  const printRemAssignees = (remArr, workspaceUsers) => {
    let newArr = [];
    remArr.forEach((id) => {
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
    setRemAssignee(newArr);
  }

  const printAddAssignees = (addArr, workspaceUsers) => {
    let newArr = [];
    addArr.forEach((id) => {
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
    setAddAssignee(newArr);
  }

  const printReassignAssignees = (reassignArr, workspaceUsers) => {
    let newArr = [];
    reassignArr.forEach((id) => {
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
    setReassign(newArr);
  }

  // returns Workspace users
  const getWorkspaceMembers = async () => {
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
      // use to get assignees in action fields
      if (cardDetails.action.input?.assignees) {
        const reassignArray = cardDetails.action.input?.assignees;
        printReassignAssignees(reassignArray, res.data.members);
      }
      if ((cardDetails.action.input?.add_assignees > 0) || (cardDetails.action.input?.add_special_assignees > 0)) {
        let arr1 = cardDetails.action.input?.add_special_assignees;
        let arr2 = cardDetails.action.input?.add_assignees;
        const addArray = arr1.concat(arr2);
        printAddAssignees(addArray, res.data.members);
      }
      if ((cardDetails.action.input?.rem_assignees > 0) || (cardDetails.action.input?.rem_special_assignees > 0)) {
        let arr1 = cardDetails.action.input?.rem_special_assignees;
        let arr2 = cardDetails.action.input?.rem_assignees;
        const remArray = arr1.concat(arr2);
        printRemAssignees(remArray, res.data.members);
      }
    };
  };

  // Remove all assignees green checkbox
  // action.input.unassign: true
  // if this is true, nothing else is rendered
  // if this is not true, the unassign property is false

  // Add assignees (default) (single avatar array, but spread across two properties) - handled the same way as assignee added/removed triggers
  // action.input.add_assignees: [14917287]
  // action.input.add_special_assignees: ['watchers', 'creator', 'triggered_by']
  // Remove assignees (single avatar array, but spread across two properties) - handled the same way as assignee added/removed triggers
  // action.input.rem_assignees: [14917287]
  // action.input.rem_special_assignees: ['watchers', 'creator', 'triggered_by', 'assignees'] -> there is one additional option here - assignees
  // Reassign
  // action.input.assignees: [14917287, 61313973, 37710627] -> no dynamic options available here
  useEffect(() => {
    console.log('from assignee action', cardDetails)
    // if unassign, set it and be done
    if (cardDetails.action.input?.unassign) {
      setUnassign(true)
      // else set state variables above if anything else is set
    } else if ((cardDetails.action.input?.add_assignees > 0) || (cardDetails.action.input?.add_special_assignees > 0) || (cardDetails.action.input?.rem_assignees > 0) || (cardDetails.action.input?.rem_special_assignees > 0) || (cardDetails.action.input?.assignees)) {
      getWorkspaceMembers();
    }
  }, [])

  return (
    <>
      <Card className="action-card">
        <Card.Body>
          <Card.Title className='value'>
            {cardDetails.name}
          </Card.Title>
          {unassign ? (<span>{"Remove all assignees"}</span>) : (
            addAssignee ? (
              addAssignee.map((assignee, i) => {
                if ((i < 3) || ((i === 3) && (addAssignee.length === 4))) {
                  return (
                    <span key={i}>
                      {assignee?.user ? (
                        <>
                          <Tooltip className="dynamic-tooltip" id={`${assignee.user.username}`} />
                          <span>{"Add assignees"}</span>
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
                } else if (i === (addAssignee.length - 1)) {
                  let newText = extraAdd.concat(assignee.user.username);
                  extraAdd = newText;
                  addCount++;
                } else {
                  let newText = extraAdd.concat(assignee.user.username + ',' + ' ');
                  extraAdd = newText;
                  addCount++;
                }
              })
            ) : (<></>),
            remAssignee ? (
              remAssignee.map((assignee, i) => {
                if ((i < 3) || ((i === 3) && (remAssignee.length === 4))) {
                  return (
                    <span key={i}>
                      {assignee?.user ? (
                        <>
                          <Tooltip className="dynamic-tooltip" id={`${assignee.user.username}`} />
                          <span>{"Remove assignees"}</span>
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


                } else if (i === (remAssignee.length - 1)) {
                  let newText = extraRem.concat(assignee.user.username);
                  extraRem = newText;
                  remCount++;
                } else {
                  let newText = extraRem.concat(assignee.user.username + ',' + ' ');
                  extraRem = newText;
                  remCount++;
                }
              })
            ) : (<></>),
            reassign ? (
              reassign.map((assignee, i) => {
                if ((i < 3) || ((i === 3) && (reassign.length === 4))) {
                  return (
                    <span key={i}>
                      {assignee?.user ? (
                        <>
                          <Tooltip className="dynamic-tooltip" id={`${assignee.user.username}`} />
                          <span>{"Reassign"}</span>
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


                } else if (i === (reassign.length - 1)) {
                  let newText = extraReassign.concat(assignee.user.username);
                  extraReassign = newText;
                  reassignCount++;
                } else {
                  let newText = extraReassign.concat(assignee.user.username + ',' + ' ');
                  extraReassign = newText;
                  reassignCount++;
                }
              })
            ) : (<></>)
          )}
        </Card.Body>
      </Card>
    </>
  )
}
export default AssigneeCard;