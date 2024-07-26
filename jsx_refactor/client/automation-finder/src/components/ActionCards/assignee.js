import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';
import "./style.css"
// 7e5011f7-f8ca-44d7-bcb7-e7827fca874c
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
        case 'assignees':
          newArr.unshift('assignees')
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
      // console.log('add assignee length', cardDetails.action.input?.add_assignees.length)
      // use to get assignees in action fields
      if (cardDetails.action.input?.assignees) {
        const reassignArray = cardDetails.action.input?.assignees;
        printReassignAssignees(reassignArray, res.data.members);
      }
      if ((cardDetails.action.input?.add_assignees.length > 0) || (cardDetails.action.input?.add_special_assignees.length > 0)) {
        let arr1 = cardDetails.action.input?.add_special_assignees;
        let arr2 = cardDetails.action.input?.add_assignees;
        const addArray = arr1.concat(arr2);
        printAddAssignees(addArray, res.data.members);
      }
      if ((cardDetails.action.input?.rem_assignees.length > 0) || (cardDetails.action.input?.rem_special_assignees.length > 0)) {
        let arr1 = cardDetails.action.input?.rem_special_assignees;
        let arr2 = cardDetails.action.input?.rem_assignees;
        const remArray = arr1.concat(arr2);
        printRemAssignees(remArray, res.data.members);
      }
    };
  };

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
              <>
                <div>{"Add assignees"}</div>
                <div className='change-assignee-field'>
                  {addAssignee.map((assignee, i) => {
                    if ((i < 3) || ((i === 3) && (addAssignee.length === 4))) {
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
                                  className='dynamic-assignee-icon triggered-icon'
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
                  })}

                  {addAssignee.length > 4 ? (
                    <span>
                      <>
                        <Tooltip
                          className="extras-tip"
                          id={'extra-add'} />
                        <span
                          className="fa-layers person-icon"

                          data-tooltip-id={'extra-add'}
                          data-tooltip-content={extraAdd}
                          data-tooltip-place="top">
                          <FontAwesomeIcon
                            transform="grow-12"
                            className="icon-circle"
                            icon={icon({ name: 'circle' })} />
                          <span className='fa-layers-text initials'>+{addCount}</span>
                        </span><span className='space'></span>
                      </>
                    </span>
                  ) : (<></>)}
                </div><br />
              </>
            ) : (<></>)

          )}

          {unassign ? (<></>) : (

            remAssignee ? (
              <>
                <div>{"Remove assignees"}</div>
                <div className='change-assignee-field'>
                  {remAssignee.map((assignee, i) => {
                    if ((i < 3) || ((i === 3) && (remAssignee.length === 4))) {
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
                          ) : assignee === "assignees" ? (
                            <>
                              <Tooltip className="dynamic-tooltip" id={`assignees`} />
                              <span
                                className="fa-layers person-icon"
                                data-tooltip-id={`assignees`}
                                data-tooltip-content={`Assignees`}
                                data-tooltip-place="top">
                                <FontAwesomeIcon
                                  transform="grow-12"
                                  className="icon-circle"
                                  style={{ color: `grey` }}
                                  icon={icon({ name: 'circle' })} />
                                <FontAwesomeIcon
                                  className='dynamic-assignee-icon'
                                  icon={icon({ name: 'circle-user' })} />
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
                                  className='dynamic-assignee-icon triggered-icon'
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
                  })}

                  {remAssignee.length > 4 ? (
                    <span>
                      <>
                        <Tooltip
                          className="extras-tip"
                          id={'extra-rem'} />
                        <span
                          className="fa-layers person-icon"

                          data-tooltip-id={'extra-rem'}
                          data-tooltip-content={extraRem}
                          data-tooltip-place="top">
                          <FontAwesomeIcon
                            transform="grow-12"
                            className="icon-circle"
                            icon={icon({ name: 'circle' })} />
                          <span className='fa-layers-text initials'>+{remCount}</span>
                        </span><span className='space'></span>
                      </>
                    </span>
                  ) : (<></>)}
                </div><br />
              </>
            ) : (<></>)

          )}

          {unassign ? (<></>) : (

            reassign ? (
              <>
                <div>{"Reassign"}</div>
                <div className='change-assignee-field'>
                  {reassign.map((assignee, i) => {
                    if ((i < 3) || ((i === 3) && (reassign.length === 4))) {
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
                                  className='dynamic-assignee-icon triggered-icon'
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
                  })}

                  {reassign.length > 4 ? (
                    <span>
                      <>
                        <Tooltip
                          className="extras-tip"
                          id={'extra-reassign'} />
                        <span
                          className="fa-layers person-icon"

                          data-tooltip-id={'extra-reassign'}
                          data-tooltip-content={extraReassign}
                          data-tooltip-place="top">
                          <FontAwesomeIcon
                            transform="grow-12"
                            className="icon-circle"
                            icon={icon({ name: 'circle' })} />
                          <span className='fa-layers-text initials'>+{reassignCount}</span>
                        </span><span className='space'></span>
                      </>
                    </span>
                  ) : (<></>)}
                </div><br />
              </>
            ) : (<></>)

          )}
        </Card.Body>
      </Card >
    </>
  )
}
export default AssigneeCard;