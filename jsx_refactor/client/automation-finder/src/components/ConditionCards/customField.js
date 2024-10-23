import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
import ProgressBar from 'react-bootstrap/ProgressBar';
import ClickUpIcon from '../images/cu-white.png';
import './style.css';

// 8651cc40-e1e0-43a6-81f9-233398e11dc6 - all
// 268ac10f-187c-4eab-9960-b7d012711457 - building
const CustomFieldCard = ({ cardDetails, key, shard, teamId }) => {
  const [fieldId, setFieldId] = useState(cardDetails.name.slice(3));
  const [fieldValue, setFieldValue] = useState(cardDetails.value);
  const [valueText, setValueText] = useState();
  const [valueColor, setValueColor] = useState();
  const [customField, setCustomField] = useState();
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));
  const [assigneeArray, setAssigneeArray] = useState([]);
  const [workspaceAssignees, setWorkspaceAssignees] = useState([]);
  let extraArray = '';
  let count = 0;

  const getCustomField = async () => {
    console.log('getCustomField')
    const res = await axios.post(
      'http://localhost:8080/automation/customField',
      {
        shard: cardDetails.shard,
        fieldId: fieldId,
        bearer: JWT,
      }
    );
    if (res?.data) {
      setCustomField(res.data);
    }
  };

  const getWorkspaceTeams = async (teamIdArr, newArr) => {
    console.log('getWorkspaceTeams')
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
    console.log('getAssignees')
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
    console.log('getWorkspaceMembers')
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

  const renderCondition = (action) => {
    console.log('renderCondition')
    // console.log(action.type_id, action, cardDetails)
    // console.log(customField);
    switch (action.type_id) {
      case 5:
        // 5 text area, ai progress update, ai summary
        console.log(action.type_id, '5 text area, ai progress update, ai summary')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 15:
        // 15 short text 
        console.log(action.type_id, '15 short text')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 2:
        // 2 email
        console.log(action.type_id, '2 email')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 7:
        // 7 number
        console.log(action.type_id, '7 number')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 0:
        // 0 
        console.log(action.type_id, action, '0 ??')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 3:
        // 3 website
        console.log(action.type_id, '3 website')
      // return (
      //   <>
      //     <Card className="value">{cardDetails.value}</Card>
      //   </>
      // )

      case 8:
        // 8 phone
        console.log(action.type_id, '8 phone')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 6:
        // 6 checkbox
        console.log(action.type_id, '6 checkbox')
        return (
          <>
            {cardDetails.value === false ? (
              <span><FontAwesomeIcon
                className="icon"
                icon={icon({ name: 'square', style: 'regular' })}
              /></span>
            ) : (
              <span><FontAwesomeIcon
                className="icon"
                icon={icon({ name: 'square-check' })}
              /></span>
            )}
          </>
        )
      case 4:
        // 4 date
        console.log(action.type_id, '4 date')
        // add a function to convert 1713520800000 to a date
        const myUnixTimestamp = fieldValue;
        const myDate = new Date(JSON.parse(myUnixTimestamp)); // converts to milliseconds
        console.log(myDate);

        return (
          <>
            <Card>{myDate.toDateString()}</Card>
          </>
        )
      case 16:
        // 16 files
        console.log(action.type_id, '16 files')
        // return (

        //   <>
        //     <Card className="value">{cardDetails.value}</Card>
        //   </>
        // )
        break;

      case 12:
        // 12 label
        console.log(action.type_id, '12 label')
        const labelValueArray = customField?.type_config?.options;
        let foundLabelArray = fieldValue.map((value) => {
          let found = labelValueArray.find((label) => value === label.id);
          return found;
        });
        return (
          <>
            {foundLabelArray.map((label, i) => {
              const styles = {
                backgroundColor: label?.color ? `${label?.color}` : 'inherit',
              };
              const parentStyles = {
                border: label?.color ? '' : '1px solid #abaeb0',
                borderRadius: '5px',
                width: 'fit-content',
                margin: '4px 2px 4px 2px'
              }
              return (
                <div style={parentStyles}>
                  <Card className='label' style={styles}>{label?.label}</Card>
                </div>
              )
            })}
          </>
        )
      case 19:
        // 19 address
        console.log(action.type_id, '19 address')
        return (
          <>
            <Card>{cardDetails?.value?.formatted_address}</Card>
          </>
        )
      case 10:
        // 10 people
        console.log(action.type_id, '10 people')
        setAssigneeArray(cardDetails.value)
        break;
      case 11:
        // 11 rating
        console.log(action.type_id, '11 rating')
        return (

          <>
            <Card>{`${cardDetails.value}/${action?.type_config?.count}`}</Card>
          </>
        )
        break;

      case 14:
        // 14 manual progress
        console.log(action.type_id, '14 manual progress')
        return (
          <>
            <ProgressBar
              className='manual-progress'
              variant="success"
              now={cardDetails?.value?.current}
              label={`${cardDetails?.value?.current}`}
            />
          </>
        )
      case 17:
        // 17 formula 
        console.log(action.type_id, '17 formula')
        return (
          <>
            <Card>{cardDetails.value}</Card>
          </>
        )
      case 18:
        // 18 list relationship
        console.log(action.type_id, '18 list relationship')
        // return (

        //   <>
        //     <Card className="value">{cardDetails.value}</Card>
        //   </>
        // )
        break;

      case 9:
        // 9 task relationship
        console.log(action.type_id, '9 task relationship')
        // return (

        //   <>
        //     <Card className="value">{cardDetails.value}</Card>
        //   </>
        // )
        break;
      case 1:
        // 1 dropdown
        console.log(action.type_id, '1 dropdown')
        let valueArray = customField?.type_config?.options;
        let result = valueArray?.find((item) => item.id === fieldValue);
        let valueName = result?.name
        let valueColor = result?.color
        return (
          <>
            <Card className='value' style={{ backgroundColor: valueColor ? `${valueColor}` : 'inherit' }}>{valueName}</Card>
          </>
        )
      default:
        return (<></>)
    }

  };

  const renderIcon = (action) => {
    switch (action.type_id) {
      // 5 is text, ai summary, ai progress update, txt area
      case 5:
        // text area & (ai)
        if (action?.type_config?.ai) {
          // ai
          return (
            <div className="condition-icon">
              <FontAwesomeIcon
                className="icon"
                icon={icon({ name: 'wand-magic-sparkles' })}
              />
              <>{customField?.name}</>
            </div>
          );
        } else {
          // text area
          return (
            <div className="condition-icon">
              <FontAwesomeIcon
                className="icon"
                icon={icon({ name: 'i-cursor' })}
              />
              <>{customField?.name}</>
            </div>
          );
        }
      case 15:
        // short text
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 't' })} />
            <>{customField?.name}</>
          </div>
        );
      case 2:
        // email
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'envelope' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 7:
        // number
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'hashtag' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 0:
        // website
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'globe' })} />
            <>{customField?.name}</>
          </div>
        );
      case 3:
        // phone
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'phone-flip' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 8:
        // currency
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'dollar-sign' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 6:
        // checkbox
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'square-check' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 4:
        // date
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'calendar' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 16:
        // attachment
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'paperclip' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 12:
        //  Label Custom Field
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'tag' })} />
            <>{customField?.name}</>
          </div>
        );
      case 19:
        // address
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'location-dot' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 10:
        // users, we need to loop through userIds and print each user - array of numbers
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'user' })} />
            <>{customField?.name}</>
          </div>
        );
      case 11:
        // this is rating, we should use the type_config?.count prop so we know the total, and then the cardDetails.value for the numeric value user has set
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'star' })} />
            <>{customField?.name}</>
          </div>
        );
      case 14:
        // manual progress
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'bars-progress' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 9:
        // this is a tasks relationship type_config does not have subcategory_id for any task in Workspace cardDetails.value is an array of task_id strings
        return (
          <div className="condition-icon">
            <img src={ClickUpIcon}></img>
            <>{customField?.name}</>
          </div>
        );
      case 17:
        // formula Custom Field
        return (
          <div className='condition-icon'>
            <FontAwesomeIcon
              className='icon'
              icon={icon({ name: 'florin-sign' })} />
            <>{customField?.name}</>
          </div>
        )
      case 18:
        // relationship specific list
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon list-relationship"
              icon={icon({ name: 'arrow-right-arrow-left' })}
            />
            <>{customField?.name}</>
          </div>
        );
      case 1:
        // dropdown
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'square-caret-down' })}
            />
            <>{customField?.name}</>
          </div>
        );
    }
  };

  const getValue = (action) => {
    console.log('five')
    switch (action.type_id) {
      // 5 is text, ai summary, ai progress update, txt area
      case 5:
      // 15 text area & (ai)
      case 15:
      // 2 short text
      case 2:
      // 7 email
      case 7:
      // 0 number
      case 0:
      // 3 website
      case 3:
      // 17 formula
      case 17:
      // 8 phone
      case 8:
        // currency
        setValueText(cardDetails.value);
        break;
      // 6 checkbox
      case 6:
        // insert logic to convert boolean to text
        if (valueText) {
          setValueText('checked');
        } else {
          setValueText('unchecked');
        }
        break;
      // 4 date
      case 4:
        // add a function to convert 1713520800000 to a date
        const myUnixTimestamp = fieldValue;
        const myDate = new Date(JSON.parse(myUnixTimestamp)); // converts to milliseconds
        console.log(myDate);
        setValueText(myDate.toDateString());
        break;
      // 16 files
      case 16:
        // add function to loop through attachment URLs and display them
        let attachmentString = '';
        fieldValue.map((item, i) => {
          if (i + 1 === fieldValue.length) {
            // its the last item in the array, and does not need a comma
            let newString = attachmentString.concat(item);
            setValueText(newString);
          } else {
            let newString = attachmentString.concat(item + ', ');
            attachmentString = newString;
          }
        });
        break;
      // 12 label
      case 12:
        // fieldValue is an array of labelIDs, we need to convert them to their txt value
        const labelValueArray = customField?.type_config?.options;
        let labelString = '';
        let labelTxtArray = fieldValue.map((value) => {
          let found = labelValueArray.find((label) => value === label.id);
          return found.label;
        });

        labelTxtArray.map((label, i) => {
          if (i + 1 === labelTxtArray.length) {
            let newString = labelString.concat(label);
            setValueText(newString);
          } else {
            let newString = labelString.concat(label + ', ');
            labelString = newString;
          }
        });
        break;
      // 19 address
      case 19:
        setValueText(cardDetails?.value?.formatted_address);
        break;
      // 10 people 
      case 10:
        // users, we need to loop through userIds and print each user - array of numbers
        let userIdString = '';
        fieldValue.map((item, i) => {
          if (i + 1 === fieldValue.length) {
            // its the last item in the array, and does not need a comma
            let newString = userIdString.concat(item);
            setValueText(newString);
          } else {
            let newString = userIdString.concat(item + ', ');
            userIdString = newString;
          }
        });
        break;
      // 11 rating
      case 11:
        // this is rating, we should use the type_config?.count prop so we know the total, and then the cardDetails.value for the numeric value user has set
        let ratioString = `${fieldValue}/${action?.type_config?.count}`;
        setValueText(ratioString);
        break;
      // 14 manual progress
      case 14:
        // this is an manual progress - total is in type_config?.end prop, and users value is in cardDetails.value.current - its a string
        setValueText({ type: 'manual-progress', value: fieldValue?.current });
        // setValueText(fieldValue?.current)
        break;
      // 18 list relationship
      case 18:
      // relationship specific list - type_config.subcategory_id is the list_id - cardDetails.value is an array of task_ids
      // 9 task relationship
      case 9:
        // this is a tasks relationship type_config does not have subcategory_id for any task in Workspace cardDetails.value is an array of task_id strings
        let taskIdString = '';
        fieldValue.map((item, i) => {
          if (i + 1 === fieldValue.length) {
            // its the last item in the array, and does not need a comma
            let newString = taskIdString.concat(item);
            setValueText(newString);
          } else {
            let newString = taskIdString.concat(item + ', ');
            taskIdString = newString;
          }
        });
        break;
      // 1 dropdown
      case 1:
        // dropdown
        let valueArray = customField?.type_config?.options;
        let result = valueArray?.find((item) => item.id === fieldValue);
        setValueText(result?.name);
        if (result?.color) {
          setValueColor(result?.color)
        }
        break;
    }
  };

  // useEffect(() => {
  //   console.log('three', customField)
  //   if (customField !== undefined) {
  //     console.log('four')
  //     // the only way to do this is to switch the field type_id prop
  //     getValue(customField);
  //   }
  // }, [customField]);

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
    console.log('one')
    getCustomField();
  }, [fieldId]);

  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className="value">
            <FontAwesomeIcon
              className='icon fa-regular'
              icon={icon({ name: 'pen-to-square', style: 'regular' })} />
            {`Custom Field`}</Card.Title>
          <span>
            <b className="card-text">CUSTON FIELD</b>
          </span>
          {customField ? (
            <>
              <Card className="value label-container">{renderIcon(customField)}</Card><br />
              <Card className="value label-container">{cardDetails.op}</Card>
              {cardDetails?.value?.current ? (
                <>
                  <span>
                    <b className="card-text">VALUE</b>
                  </span>
                  <div>{renderCondition(customField)}</div>
                </>
              ) : (cardDetails.value && assigneeArray.length === 0) ? (
                <>
                  <span>
                    <b className="card-text">VALUE</b>
                  </span>

                  {/* <Card className="value" style={{ backgroundColor: valueColor ? `${valueColor}` : 'inherit' }}>{valueText}</Card> */}
                  <Card className="value label-container">{renderCondition(customField)}</Card>
                </>
              ) : (assigneeArray?.length > 0) ? (
                <>
                  <span>
                    <b className="card-text">VALUE</b>
                  </span>

                  <div className='change-assignee-field'>
                    {workspaceAssignees.map((assignee, i) => {
                      if ((i < 3) || ((i === 3) && (workspaceAssignees.length === 4))) {
                        return (
                          <span key={i}>
                            {assignee?.user ? (
                              <>
                                <Tooltip className="dynamic-tooltip" id={`c-${assignee?.user?.username}`} />
                                <span
                                  className="fa-layers person-icon"
                                  data-tooltip-id={`c-${assignee?.user?.username}`}
                                  data-tooltip-content={`${assignee?.user?.username}`}
                                  data-tooltip-place="top">
                                  <FontAwesomeIcon
                                    transform="grow-12"
                                    className="icon-circle"
                                    style={{ color: `${assignee?.user?.color}` || '#8cdb00' }}
                                    icon={icon({ name: 'circle' })} />
                                  <span className='fa-layers-text initials'>{assignee?.user?.initials}</span>
                                </span><span className='space'></span>
                              </>
                            ) : assignee === "watchers" ? (
                              <>
                                <Tooltip className="dynamic-tooltip" id={`c-watchers`} />
                                <span
                                  className="fa-layers person-icon"
                                  data-tooltip-id={`c-watchers`}
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
                                <Tooltip className="dynamic-tooltip" id={`c-creator`} />
                                <span
                                  className="fa-layers person-icon"
                                  data-tooltip-id={`c-creator`}
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
                                <Tooltip className="dynamic-tooltip" id={`c-triggered_by`} />
                                <span
                                  className="fa-layers person-icon"
                                  data-tooltip-id={`c-triggered_by`}
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
                                <Tooltip className="dynamic-tooltip" id={`c-${assignee.initials}`} />
                                <span
                                  className="fa-layers person-icon"
                                  data-tooltip-id={`c-${assignee.initials}`}
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
                          id={'c-extras'} />
                        <span
                          className="fa-layers person-icon"
                          data-tooltip-id={'c-extras'}
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

                  </div>

                </>

              ) : (<></>)}
            </>
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
export default CustomFieldCard;
