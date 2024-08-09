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

  // state vars for round team objects
  const [reassignTeamArr, setReassignTeamArr] = useState([]);
  const [addTeamArr, setAddTeamArr] = useState([]);
  const [remTeamArr, setRemTeamArr] = useState([]);
  // Workspace teams
  const [workspaceTeams, setWorkspaceTeams] = useState([]);

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

  const getWorkspaceTeams = async () => {
    const res = await axios.post(
      'http://localhost:8080/automation/userTeams',
      {
        shard: shard,
        teamId: teamId,
        bearer: JWT
      }
    );
    if (res?.data) {
      setWorkspaceTeams(res?.data?.groups);
    };
  };

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
      let reTeamIdArr = [];
      let addTeamIdArr = [];
      let remTeamIdArr = [];
      if (cardDetails.action.input?.assignees) {
        const reassignArray = cardDetails.action.input?.assignees;
        // filter out teams here - pass as separate array
        // array to hold everything else
        let reOverflow = [];
        reTeamIdArr = reassignArray.filter((item) => {
          const dynamicOptions = ['watchers', 'creator', 'triggered_by'];
          if (typeof item !== "number" && !dynamicOptions.includes(item)) {
            return item;
          } else {
            reOverflow.push(item);
          };
        });
        if (reTeamIdArr.length > 0) {
          // if there are teams, set the corresponding team array
          setReassignTeamArr(reTeamIdArr);
        };
        printReassignAssignees(reOverflow, res.data.members);
      };
      if ((cardDetails.action.input?.add_assignees.length > 0) || (cardDetails.action.input?.add_special_assignees.length > 0)) {
        let arr1 = cardDetails.action.input?.add_special_assignees;
        let arr2 = cardDetails.action.input?.add_assignees;
        const addArray = arr1.concat(arr2);
        // filter out teams here - pass as separate array
        // array to hold everything else
        let addOverflow = [];
        addTeamIdArr = addArray.filter((item) => {
          const dynamicOptions = ['watchers', 'creator', 'triggered_by'];
          if (typeof item !== "number" && !dynamicOptions.includes(item)) {
            return item;
          } else {
            addOverflow.push(item);
          };
        });
        if (addTeamIdArr.length > 0) {
          // if there are teams, set the corresponding team array
          // addTeamArr = addTeamIdArr;
          setAddTeamArr(addTeamIdArr);

        };
        printAddAssignees(addOverflow, res.data.members);
      };
      if ((cardDetails.action.input?.rem_assignees.length > 0) || (cardDetails.action.input?.rem_special_assignees.length > 0)) {
        let arr1 = cardDetails.action.input?.rem_special_assignees;
        let arr2 = cardDetails.action.input?.rem_assignees;
        const remArray = arr1.concat(arr2);
        // filter out teams here - pass as a separate array
        // array to hold everything else
        let remOverflow = [];
        remTeamIdArr = remArray.filter((item) => {
          const dynamicOptions = ['watchers', 'creator', 'triggered_by', 'assignees'];
          if (typeof item !== "number" && !dynamicOptions.includes(item)) {
            return item;
          } else {
            remOverflow.push(item)
          };
        });
        if (remTeamIdArr.length > 0) {
          // if there are teams, set the corresponding team array
          setRemTeamArr(remTeamIdArr);

        };
        printRemAssignees(remOverflow, res.data.members);
      };
      if ((reTeamIdArr.length > 0) || (addTeamIdArr > 0) || (remTeamIdArr > 0)) {
        getWorkspaceTeams();
      };
    };
  };

  useEffect(() => {
    // if unassign, set it and be done
    // else set state variables above if anything else is set
    if (cardDetails.action.input?.unassign) {
      setUnassign(true)
    } else if ((cardDetails.action.input?.add_assignees > 0) || (cardDetails.action.input?.add_special_assignees > 0) || (cardDetails.action.input?.rem_assignees > 0) || (cardDetails.action.input?.rem_special_assignees > 0) || (cardDetails.action.input?.assignees)) {
      getWorkspaceMembers();
    }
  }, []);

  useEffect(() => {
    // this is my trigger, one of the teams arrays have triggered the api call
    if (workspaceTeams.length > 0) {
      if (reassignTeamArr.length > 0) {
        // get team objects, add to state var's
        let foundReTeam = [];
        reassignTeamArr.forEach((id) => {
          let foundObject = workspaceTeams.find((object) => object.id === id);
          if (foundObject !== undefined) {
            foundReTeam.push(foundObject);
          }
        });
        let totalReArr = foundReTeam.concat(reassign);
        setReassign(totalReArr);
      };

      if (addTeamArr.length > 0) {
        // get team objects, add to state var's
        let foundAddTeam = [];
        addTeamArr.forEach((id) => {
          let foundObject = workspaceTeams.find((object) => object.id === id);
          if (foundObject !== undefined) {
            foundAddTeam.push(foundObject);
          }
        });
        let totalAddArr = foundAddTeam.concat(addAssignee);
        console.log('add assingee array', totalAddArr);
        setAddAssignee(totalAddArr);
      };

      if (remTeamArr.length > 0) {
        // get team objects, add to state var's
        let foundRemTeam = [];
        remTeamArr.forEach((id) => {
          let foundObject = workspaceTeams.find((object) => object.id === id);
          if (foundObject !== undefined) {
            foundRemTeam.push(foundObject);
          }
        });
        let totalRemArr = foundRemTeam.concat(remAssignee);
        setRemAssignee(totalRemArr);
      };
    }
  }, [workspaceTeams]);



  return (
    <>
      <Card className="action-card">
        <Card.Body>

          <Card.Title className='value'>
            {cardDetails.name}
          </Card.Title>

          {addAssignee.length > 0 ? (
            <>
              <div>{"Add assignees"}</div>
              <div className='change-assignee-field'>
                {addAssignee.map((assignee, i) => {
                  // print icons if index is less than 3, or if array length is 4, we current indx is 3
                  if ((i < 3) || ((i === 3) && (addAssignee.length === 4))) {
                    return (
                      <span key={i}>
                        {assignee?.user ? (
                          // user option
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-a-${assignee.user.username}`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-a-${assignee.user.username}`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-a-watchers`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-a-watchers`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-a-creator`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-a-creator`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-a-triggered_by`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-a-triggered_by`}
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
                          // team option
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-a-${assignee.initials}`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-a-${assignee.initials}`}
                              data-tooltip-content={`${assignee.name}`}
                              data-tooltip-place="top">
                              <FontAwesomeIcon
                                transform="grow-12"
                                className="icon-circle"
                                style={{ color: `grey` }}
                                icon={icon({ name: 'circle' })} />
                              <span className='fa-layers-text initials'>{assignee.initials}</span>
                              <FontAwesomeIcon
                                className='team'
                                icon={icon({ name: 'people-group' })} />
                            </span><span className='space'></span>
                          </>
                        )}
                      </span>
                    )
                  // else, if its the last array item, tack on to overflow modal
                  } else if (i === (addAssignee.length - 1)) {
                    let newText = extraAdd.concat(assignee?.user?.username);
                    extraAdd = newText;
                    addCount++;
                  // else, add a comma and a Space bc something is coming after it
                  } else {
                    // could be a user, a dynamic option, or a team
                    let newText = extraAdd.concat(assignee?.user?.username + ',' + ' ');
                    extraAdd = newText;
                    addCount++;
                  }
                })}

                {addAssignee.length > 4 ? (
                  <span>
                    <>
                      <Tooltip
                        className="extras-tip"
                        id={'a-a-extra-add'} />
                      <span
                        className="fa-layers person-icon"
                        data-tooltip-id={'a-a-extra-add'}
                        data-tooltip-content={extraAdd}
                        data-tooltip-place="top">
                        <FontAwesomeIcon
                          transform="grow-12"
                          className="icon-circle"
                          icon={icon({ name: 'circle' })} />
                        <span className='fa-layers-text overflow-text'>+{addCount}</span>
                      </span><span className='space'></span>
                    </>
                  </span>
                ) : (<></>)}
              </div><br />
            </>
          ) : (
            <>
              <div>{"Add assignees"}</div>
              <div className='change-assignee-field'>
                <span className="fa-layers person-icon">
                  <FontAwesomeIcon
                    transform="grow-12"
                    style={{ color: `black`, border: `1px dashed grey`, padding: `7px`, borderRadius: `50%` }}
                    icon={icon({ name: 'circle' })} />
                  <FontAwesomeIcon
                    className='dynamic-assignee-icon'
                    icon={icon({ name: 'circle-user' })} />
                </span>
              </div><br />

            </>
          )}

          {remAssignee.length > 0 ? (
            <>
              <div>{"Remove assignees"}</div>
              <div className='change-assignee-field'>
                {remAssignee.map((assignee, i) => {
                  // print icons if index is less than 3, or if array length is 4, we current indx is 3
                  if ((i < 3) || ((i === 3) && (remAssignee.length === 4))) {
                    return (
                      <span key={i}>
                        {assignee?.user ? (
                          // user option
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-r-${assignee.user.username}`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-r-${assignee.user.username}`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-r-watchers`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-r-watchers`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-r-creator`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-r-creator`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-r-assignees`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-r-assignees`}
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
                        ) : assignee === "triggered_by" ? (
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-r-triggered_by`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-r-triggered_by`}
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
                          // team option
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-rem-${assignee.initials}`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-rem-${assignee.initials}`}
                              data-tooltip-content={`${assignee.name}`}
                              data-tooltip-place="top">
                              <FontAwesomeIcon
                                transform="grow-12"
                                className="icon-circle"
                                style={{ color: `grey` }}
                                icon={icon({ name: 'circle' })} />
                              <span className='fa-layers-text initials'>{assignee.initials}</span>
                              <FontAwesomeIcon
                                className='team'
                                icon={icon({ name: 'people-group' })} />
                            </span><span className='space'></span>
                          </>
                        )}
                      </span>
                    )
                  // else, if its the last array item, tack on to overflow modal
                  } else if (i === (remAssignee.length - 1)) {
                    // could be a user, a dynamic option, or a team
                    let newText = extraRem.concat(assignee?.user?.username);
                    extraRem = newText;
                    remCount++;
                  } else if (assignee?.user?.username) {
                    // because there are 4 dynamic options, and teams, if the array is 5 or longer, and all dynamic are selected, one of the dynamic can end up in the overflow modal - account for that here
                    let newText = extraRem.concat(assignee?.user?.username + ',' + ' ');
                    extraRem = newText;
                    remCount++;
                  // else, add a comma and a Space bc something is coming after it
                  } else {
                    // could be a user, a dynamic option, or a team
                    let newText = extraRem.concat(assignee + ',' + ' ');
                    extraRem = newText;
                    remCount++;
                  }
                })}

                {remAssignee.length > 4 ? (
                  <span>
                    <>
                      <Tooltip
                        className="extras-tip"
                        id={'a-r-extra-rem'} />
                      <span
                        className="fa-layers person-icon"

                        data-tooltip-id={'a-r-extra-rem'}
                        data-tooltip-content={extraRem}
                        data-tooltip-place="top">
                        <FontAwesomeIcon
                          transform="grow-12"
                          className="icon-circle"
                          icon={icon({ name: 'circle' })} />
                        <span className='fa-layers-text overflow-text'>+{remCount}</span>
                      </span><span className='space'></span>
                    </>
                  </span>
                ) : (<></>)}
              </div><br />
            </>
          ) : (
            <>
              <div>{"Remove assignees"}</div>
              <div className='change-assignee-field'>
                <span className="fa-layers person-icon">
                  <FontAwesomeIcon
                    transform="grow-12"
                    style={{ color: `black`, border: `1px dashed grey`, padding: `7px`, borderRadius: `50%` }}
                    icon={icon({ name: 'circle' })} />
                  <FontAwesomeIcon
                    className='dynamic-assignee-icon'
                    icon={icon({ name: 'circle-user' })} />
                </span>
              </div><br />

            </>
          )}

          {reassign.length > 0 ? (
            <>
              <div>{"Reassign"}</div>
              <div className='change-assignee-field'>
                {reassign.map((assignee, i) => {
                  // print icons if index is less than 3, or if array length is 4, we current indx is 3
                  if ((i < 3) || ((i === 3) && (reassign.length === 4))) {
                    return (
                      <span key={i}>
                        {assignee?.user ? (
                          // user option
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-re-${assignee.user.username}`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-re-${assignee.user.username}`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-re-watchers`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-re-watchers`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-re-creator`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-re-creator`}
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
                            <Tooltip className="dynamic-tooltip" id={`a-re-triggered_by`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-re-triggered_by`}
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
                          // team option
                          <>
                            <Tooltip className="dynamic-tooltip" id={`a-re-${assignee.initials}`} />
                            <span
                              className="fa-layers person-icon"
                              data-tooltip-id={`a-re-${assignee.initials}`}
                              data-tooltip-content={`${assignee.name}`}
                              data-tooltip-place="top">
                              <FontAwesomeIcon
                                transform="grow-12"
                                className="icon-circle"
                                style={{ color: `grey` }}
                                icon={icon({ name: 'circle' })} />
                              <span className='fa-layers-text initials'>{assignee.initials}</span>
                              <FontAwesomeIcon
                                className='team'
                                icon={icon({ name: 'people-group' })} />
                            </span><span className='space'></span>
                          </>
                        )}
                      </span>
                    )
                  // else, if its the last array item, tack on to overflow modal
                  } else if (i === (reassign.length - 1)) {
                    // could be a user, a dynamic option, or a team
                    let newText = extraReassign.concat(assignee?.user?.username);
                    extraReassign = newText;
                    reassignCount++;
                  // else, add a comma and a Space bc something is coming after it
                  } else {
                    // could be a user, a dynamic option, or a team
                    let newText = extraReassign.concat(assignee?.user?.username + ',' + ' ');
                    extraReassign = newText;
                    reassignCount++;
                  }
                })}

                {reassign.length > 4 ? (
                  <span>
                    <>
                      <Tooltip
                        className="extras-tip"
                        id={'a-re-extra-reassign'} />
                      <span
                        className="fa-layers person-icon"
                        data-tooltip-id={'a-re-extra-reassign'}
                        data-tooltip-content={extraReassign}
                        data-tooltip-place="top">
                        <FontAwesomeIcon
                          transform="grow-12"
                          className="icon-circle"
                          icon={icon({ name: 'circle' })} />
                        <span className='fa-layers-text overflow-text'>+{reassignCount}</span>
                      </span><span className='space'></span>
                    </>
                  </span>
                ) : (<></>)}
              </div><br />
            </>
          ) : (
            <>
              <div>{"Reassign"}</div>
              <div className='change-assignee-field'>
                <span className="fa-layers person-icon">
                  <FontAwesomeIcon
                    transform="grow-12"
                    style={{ color: `black`, border: `1px dashed grey`, padding: `7px`, borderRadius: `50%` }}
                    icon={icon({ name: 'circle' })} />
                  <FontAwesomeIcon
                    className='dynamic-assignee-icon'
                    icon={icon({ name: 'circle-user' })} />
                </span>
              </div><br />
            </>
          )}

          {unassign ? (
            <>
              <div>{"Remove all assignees"}</div>
              <FontAwesomeIcon
                transform="grow-4"
                className="check-icon"
                icon={icon({ name: 'square-check' })} />
            </>
          ) : (
            <>
              <div>{"Remove all assignees"}</div>
              <FontAwesomeIcon
                transform="grow-4"
                className="uncheck-icon"
                icon={icon({ name: 'square' })} />
            </>
          )}

        </Card.Body>
      </Card >
    </>
  )
}
export default AssigneeCard;