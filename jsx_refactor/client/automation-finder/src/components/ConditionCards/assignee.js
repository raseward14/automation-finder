import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';
import "./style.css";


const AssigneeCard = ({ cardDetails, key, shard, teamId }) => {
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));
  const [assigneeArray, setAssigneeArray] = useState([]);
  const [workspaceAssignees, setWorkspaceAssignees] = useState([]);
  let extraArray = '';
  let count = 0;

  const getWorkspaceTeams = async (teamIdArr, newArr) => {
    const res = await axios.post(
      'http://localhost:8080/automation/userTeams',
      {
        shard: shard,
        teamId: teamId,
        bearer: JWT
      }
    );
    if (res?.data) {
      let workspaceTeams = res.data.groups;
      let foundArr = [];
      teamIdArr.forEach((id) => {
        let foundObject = workspaceTeams.find((object) => object.id === id)
        if (foundObject !== undefined) {
          foundArr.push(foundObject)
        }
      })
      let totalArr = foundArr.concat(newArr);
      setWorkspaceAssignees(totalArr);
    };
  };

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
    // check for teams in the original array
    // remove dynamic assignees, and userIds from the assignee array
    let teamIdArr = assigneeArray.filter(item => {
      const dynamicOptions = ['watchers', 'creator', 'triggered_by'];
      if (typeof item !== "number" && !dynamicOptions.includes(item)) {
        return item;
      };
    });
    // if there is a teamArr, send it, along with our user object arr's to our team function to combine the two, and set state
    // else, just set state now 
    if (teamIdArr?.length > 0) {
      getWorkspaceTeams(teamIdArr, newArr);
    } else {
      setWorkspaceAssignees(newArr);
    };
  };

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
      //remove teamIds from the user array
      let userArr = assigneeArray.filter(item => {
        const dynamicOptions = ['watchers', 'creator', 'triggered_by'];
        if ((typeof item === "number") || (dynamicOptions.includes(item))) {
          return item;
        };
      });
      if (userArr?.length > 0) {
        getWorkspaceMembers(userArr);
      }
    }
  }, [assigneeArray]);

  useEffect(() => {
    console.log(cardDetails)
    if (cardDetails.value) {
      setAssigneeArray(cardDetails.value);
    } 
  }, []);

  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className='value'>
            {cardDetails.name}
          </Card.Title>
          <Card className='value'>{cardDetails.op}</Card>

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
                        <Tooltip className="dynamic-tooltip" id={`t-${assignee.initials}`} />
                        <span
                          className="fa-layers person-icon"
                          data-tooltip-id={`t-${assignee.initials}`}
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

              } else if (i === (workspaceAssignees.length - 1)) {
                // last one
                if (assignee?.user?.username) {
                  // its a user
                  let newText = extraArray.concat(assignee?.user?.username);
                  extraArray = newText;
                  count++;
                } else if (assignee?.name) {
                  // its a team
                  let newText = extraArray.concat(assignee?.name);
                  extraArray = newText;
                  count++;
                } else {
                  // its dynamic
                  let newText = extraArray.concat(assignee);
                  extraArray = newText;
                  count++;
                };

              } else {
                // add a comma
                if (assignee?.user?.username) {
                  // its a user
                  let newText = extraArray.concat(assignee?.user?.username + ',' + ' ');
                  extraArray = newText;
                  count++;
                } else if (assignee?.name) {
                  // its a team
                  let newText = extraArray.concat(assignee?.name + ',' + ' ');
                  extraArray = newText;
                  count++;
                } else {
                  // its dynamic
                  let newText = extraArray.concat(assignee + ',' + ' ');
                  extraArray = newText;
                  count++;
                };
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
                  <span className='fa-layers-text overflow-text'>+{count}</span>
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