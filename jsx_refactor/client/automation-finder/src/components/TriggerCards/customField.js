import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'

import ProgressBar from 'react-bootstrap/ProgressBar';
import ClickUpIcon from '../images/cu-white.png';
import Card from 'react-bootstrap/Card';
import "./style.css";

// 8651cc40-e1e0-43a6-81f9-233398e11dc6 - all
// 268ac10f-187c-4eab-9960-b7d012711457 - building
// d4cdc1cd-6fba-49d6-89f9-d79abfbab812 - single condition work

// Custom Field changes
const CustomFieldCard = ({ triggerName, cardDetails, shard, teamId }) => {
    // all have from and to except
    // signature
    // checkbox
    // voting
    // files does not have a border
    // token
    const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

    // the fieldId need to trim off cf_ for the api call
    const [fieldId, setFieldId] = useState((cardDetails?.trigger?.type).slice(3))
    // the field
    const [customField, setCustomField] = useState();
    // before value
    // const [beforeValue, setBeforeValue] = useState(cardDetails?.trigger?.conditions[0]?.after[0])
    // after value
    // const [afterValue, setAfterValue] = useState(cardDetails?.trigger?.conditions[1]?.before[0])


    // type 10
    const [assigneeArray, setAssigneeArray] = useState();
    const [beforeWorkspaceAssignees, setBeforeWorkspaceAssignees] = useState([]);
    const [afterWorkspaceAssignees, setAfterWorkspaceAssignees] = useState([]);

    let beforeExtraArray = '';
    let beforeCount = 0;

    let afterExtraArray = '';
    let afterCount = 0;


    // type 9
    const [wSTasks, setWSTasks] = useState([]);
    const [tFWs, setFWs] = useState(false);

    // type 18
    const [listTasks, setListTasks] = useState([]);
    const [tFList, setTFList] = useState(false);

    // type 16
    const [attachments, setAttachments] = useState([]);
    const [tfAttachments, setTfAttachments] = useState(false);

    // axios requests
    const getAttachment = async (valueArray) => {
        // getAttachment
        console.log('getAttachment', valueArray);
        // get an array of object values
        // let valueArray = Object.values(valueArray);
        let query = '';
        if (valueArray.length > 0) {
            await valueArray.map((item, i) => {
                // if (i + 1 === fieldValue.length) {
                //     let newQuery = query.concat(`attachment_ids[]=${item}`);
                //     query = newQuery;
                // } else {
                //     let newQuery = query.concat(`attachment_ids[]=${item}&`);
                //     query = newQuery;
                // };
            });
        };

        console.log(query);

        try {
            const res = await axios.post(
                'http://localhost:8080/automation/getAttachment',
                {
                    shard: cardDetails.shard,
                    attachmentIds: query,
                    bearer: JWT
                }
            );
            if (res?.data) {
                console.log('attachment received via API', res?.data)
                setAttachments(res?.data?.attachments);
            };
        } catch (err) {
            console.log(err);
        }
    }

    const getWsTasks = async (taskArray) => {
        console.log('getWsTasks');
        try {
            const res = await axios.post(
                'http://localhost:8080/automation/getTasks',
                {
                    shard: cardDetails.shard,
                    taskIds: taskArray,
                    bearer: JWT,
                }
            );
            if (res?.data) {
                // console.log('response we return is:', res?.data)
                setWSTasks(res?.data.tasks)
            };
        } catch (err) {
            console.log(err)
        };
    };

    const getListTasks = async (taskArray) => {
        console.log('getListTasks')
        try {
            const res = await axios.post(
                'http://localhost:8080/automation/getTasks',
                {
                    shard: cardDetails.shard,
                    taskIds: taskArray,
                    bearer: JWT,
                }
            );
            if (res?.data) {
                // console.log('response we return is:', res?.data.tasks)
                setListTasks(res?.data.tasks)
            };
        } catch (err) {
            console.log(err)
        };
    };

    const getWorkspaceTeams = async (teamIdArr, newArr, beforeAfter) => {
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
            if (beforeAfter === 'before') {
                setBeforeWorkspaceAssignees(totalArr);
            } else if (beforeAfter === 'after') {
                setAfterWorkspaceAssignees(totalArr)
            }
        };
    };

    const getAssignees = (assigneeArr, workspaceUsers, beforeAfter) => {
        console.log('getAssignees')
        let newArr = [];
        assigneeArr.forEach((id) => {
            switch (id) {
                case 'unassigned':
                    newArr.unshift('unassigned')
                    break;
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

        if (beforeAfter === 'before') {
            // check for teams in the original before array
            // remove dynamic assignees, and userIds from the assignee array
            let teamIdArr = assigneeArray.before.filter(item => {
                const dynamicOptions = ['watchers', 'creator', 'triggered_by', 'unassigned', 'assignees'];
                if (typeof item !== "number" && !dynamicOptions.includes(item)) {
                    return item;
                };
            });
            // if there is a teamArr, send it, along with our user object arr's to our team function to combine the two, and set state
            // else, just set state now 
            if (teamIdArr?.length > 0) {
                // console.log('team id array', teamIdArr);
                getWorkspaceTeams(teamIdArr, newArr, beforeAfter);
            } else {
                setBeforeWorkspaceAssignees(newArr);
            };

        } else if (beforeAfter === 'after') {
            // check for teams in the original after array
            // remove dynamic assignees, and userIds from the assignee array
            let teamIdArr = assigneeArray.after.filter(item => {
                const dynamicOptions = ['watchers', 'creator', 'triggered_by', 'unassigned'];
                if (typeof item !== "number" && !dynamicOptions.includes(item)) {
                    return item;
                };
            });
            // if there is a teamArr, send it, along with our user object arr's to our team function to combine the two, and set state
            // else, just set state now 
            if (teamIdArr?.length > 0) {
                // console.log('team id array', teamIdArr);
                getWorkspaceTeams(teamIdArr, newArr, beforeAfter);
            } else {
                setAfterWorkspaceAssignees(newArr);
            };
        }


    };

    const getWorkspaceMembers = async (assigneeArr, beforeAfter) => {
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
            getAssignees(assigneeArr, res.data.members, beforeAfter);
        };
    };

    const renderTrigger = (trigger) => {
        console.log('cardDetails: ', cardDetails)
        console.log('trigger: ', trigger)
        let valueObjectArrays = cardDetails?.trigger?.conditions;
        const foundBeforeObject = valueObjectArrays.find(ob => ob['before']);
        const foundAfterObject = valueObjectArrays.find(ob => ob['after']);
        let beforeValue = foundBeforeObject.before;
        let afterValue = foundAfterObject.after;

        switch (trigger.type_id) {
            case 5:
                // 5 text area, ai progress update, ai summary
                // console.log(condition.type_id, '5 text area, ai progress update, ai summary')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 15:
                // 15 short text 
                // console.log(condition.type_id, '15 short text')
                console.log(beforeValue)
                console.log(afterValue)
                return (
                    <>
                        <span>
                            <b className="card-text">From</b>
                        </span><div/>
                        <Card className="label-container-trigger">{beforeValue}</Card>
                        <span>
                            <b className="card-text">To</b>
                        </span><div />
                        <Card className="label-container-trigger">{afterValue}</Card>
                    </>
                );
            case 2:
                // 2 email
                // console.log(condition.type_id, '2 email')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 7:
                // 7 number
                // console.log(condition.type_id, '7 number')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 0:
                // 0 website
                // console.log(condition.type_id, action, '0 ??')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 3:
                // 3 website
                // console.log(condition.type_id, '3 website')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 8:
                // 8 phone
                // console.log(action.type_id, '8 phone')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 6:
                // 6 checkbox
                // console.log(condition.type_id, '6 checkbox')
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
                );
            case 4:
            // 4 date
            // console.log(action.type_id, '4 date')
            // add a function to convert 1713520800000 to a date
            // const myUnixTimestamp = fieldValue;
            // const myDate = new Date(JSON.parse(myUnixTimestamp)); // converts to milliseconds
            // console.log(myDate);
            // return (
            //     <>
            //         <Card>{myDate.toDateString()}</Card>
            //     </>
            // );
            case 12:
            // 12 label
            // console.log(condition.type_id, '12 label')
            // const labelValueArray = customField?.type_config?.options;
            // let foundLabelArray = fieldValue.map((value) => {
            //     let found = labelValueArray.find((label) => value === label.id);
            //     return found;
            // });
            // return (
            //     <>
            //         {foundLabelArray.map((label, i) => {
            //             const styles = {
            //                 backgroundColor: label?.color ? `${label?.color}` : 'inherit',
            //             };
            //             const parentStyles = {
            //                 border: label?.color ? '' : '1px solid #abaeb0',
            //                 borderRadius: '5px',
            //                 width: 'fit-content',
            //                 margin: '4px 2px 4px 2px'
            //             }
            //             return (
            //                 <div style={parentStyles}>
            //                     <Card className='label' style={styles}>{label?.label}</Card>
            //                 </div>
            //             )
            //         })}
            //     </>
            // );
            case 19:
                // 19 address
                // console.log(condition.type_id, '19 address')
                return (
                    <>
                        <Card>{cardDetails?.value?.formatted_address}</Card>
                    </>
                );
            case 11:
                // 11 rating
                let total = trigger?.type_config?.count;
                let value = cardDetails.value;
                let remaining = total - value;
                const hexCodePoint = customField?.type_config?.code_point;
                const emjoiFromHexCodePoint = String.fromCodePoint(parseInt(hexCodePoint, 16));
                // console.log(cardDetails.value)
                // console.log(customField?.type_config?.code_point)
                // console.log(condition.type_id, '11 rating')
                return (
                    <>
                        {
                            <>
                                <span>{emjoiFromHexCodePoint.repeat(value)}</span>
                                <span style={{ opacity: "0.35" }}>{emjoiFromHexCodePoint.repeat(remaining)}</span>
                            </>
                        }

                    </>
                );
            case 14:
                // 14 manual progress
                // console.log(condition.type_id, '14 manual progress')
                return (
                    <>
                        <span>
                            <b className="card-text">From</b>
                        </span>
                        <ProgressBar
                            className='manual-progress'
                            variant="success"
                            now={beforeValue.current}
                            label={`${beforeValue.current}`}
                        />
                        <span>
                            <b className="card-text">To</b>
                        </span>
                        <ProgressBar
                            className='manual-progress'
                            variant="success"
                            now={afterValue.current}
                            label={`${afterValue.current}`}
                        />
                    </>
                );
            case 17:
                // 17 formula 
                // console.log(condition.type_id, '17 formula')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 1:
            // 1 dropdown
            // console.log(condition.type_id, '1 dropdown')
            // let valueArray = customField?.type_config?.options;
            // let result = valueArray?.find((item) => item.id === fieldValue);
            // let valueName = result?.name
            // let valueColor = result?.color
            // return (
            //     <>
            //         <Card className='value' style={{ backgroundColor: valueColor ? `${valueColor}` : 'inherit' }}>{valueName}</Card>
            //     </>
            // );
            case 16:
            // 16 files
            // console.log(condition.type_id, '16 files')
            // console.log(cardDetails?.value)
            // let attachmentString = '';
            // return (
            //     <>
            //         {cardDetails?.value?.map((item, i) => {
            //             if (i + 1 === fieldValue.length) {
            //                 // its the last item in the array, and does not need a comma
            //                 let newString = attachmentString.concat(item);
            //                 console.log(newString);
            //                 return (
            //                     <>
            //                         <Card>{`${newString}`}</Card>
            //                     </>
            //                 );
            //             } else {
            //                 let newString = attachmentString.concat(item + ', ');
            //                 attachmentString = newString;
            //             }
            //         })}
            //     </>
            // );
            case 21:
                // 21 voting
                // console.log(condition.type_id, '21 voting')
                return (
                    <>
                        <Card>{cardDetails.value}</Card>
                    </>
                );
            case 22:
            // 22 signature 
            // console.log(condition.type_id, '22 signature')
            // console.log(cardDetails?.value);
            // will never have a value - only operators available 'are is set' 'is not set'

            // the below cases are handled in the jsx - by setting state vars - rendering them here causes re-render errors due to their complexity
            // case 10:
            //  10 people
            //  console.log(condition.type_id, '10 people')
            //  handled in useEffect, and end values rendered with state var
            // case 18:
            //  18 list relationship
            //  console.log(condition.type_id, '18 list relationship')
            //  handled in useEffect, and end values rendered with state var
            // case 9:
            //   9 task relationship
            //   console.log(condition.type_id, '9 task relationship')
            //   handled in useEffect, and end values rendered with state var 
            default:
                console.log('value case needed for', trigger?.type_id)
                return (<></>);
        };

    }

    const renderIcon = (field) => {
        console.log(field?.type_id)
        if (field !== undefined) {
            switch (field.type_id) {
                // 5 is text, ai summary, ai progress update, txt area
                case 5:
                    // text area & (ai)
                    if (field?.type_config?.ai) {
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
                    };
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
                    );
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
                case 21:
                    // voting
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon
                                className="icon"
                                icon={icon({ name: 'chart-column' })}
                            />
                            <>{customField?.name}</>
                        </div>
                    );
                case 22:
                    // signature
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon
                                className="icon"
                                icon={icon({ name: 'pen-fancy' })}
                            />
                            <>{customField?.name}</>
                        </div>
                    );
                default:
                    console.log('icon case needed for', field.type_id, field)
            };
        };
    };

    const getCustomField = async () => {
        console.log('getCustomField')
        const res = await axios.post(
            'http://localhost:8080/automation/customField',
            {
                shard: shard,
                fieldId: fieldId,
                bearer: JWT,
            }
        );
        if (res?.data) {
            console.log('Custom Field is', res.data);
            setCustomField(res.data);
        }
    };

    useEffect(() => {
        getCustomField()
    }, [fieldId])

    useEffect(() => {
        console.log('custom field', customField)
        console.log('card details', cardDetails.value)
        if (customField?.type_id === 10) {
            let valueObjectArrays = cardDetails?.trigger?.conditions
            const foundBeforeObject = valueObjectArrays.find(ob => ob['before']);
            const foundAfterObject = valueObjectArrays.find(ob => ob['after']);
            setAssigneeArray({
                before: foundBeforeObject.before,
                after: foundAfterObject.after
            })
        } else if (customField?.type_id === 9 && tFWs === false) {
            setFWs(true);
            getWsTasks(cardDetails?.value);
        } else if (customField?.type_id === 18 && tFList === false) {
            setTFList(true);
            getListTasks(cardDetails?.value);
        } else if (customField?.type_id === 16 && tfAttachments === false) {
            setTfAttachments(true);
            getAttachment(cardDetails?.value);
        };
    }, [customField]);

    useEffect(() => {
        console.log(assigneeArray?.before, typeof assigneeArray?.before);
        console.log(assigneeArray?.after);

        // process this before, once for after
        if (assigneeArray?.before?.length > 0) {
            //remove teamIds from the user array
            let beforeUserArr = assigneeArray?.before?.filter(item => {
                const dynamicOptions = ['watchers', 'creator', 'triggered_by', 'unassigned', 'assignees'];
                if ((typeof item === "number") || (dynamicOptions.includes(item))) {
                    return item;
                };
            });
            getWorkspaceMembers(beforeUserArr, 'before');
        }

        if (assigneeArray?.after?.length > 0) {
            //remove teamIds from the user array
            let afterUserArr = assigneeArray.after.filter(item => {
                const dynamicOptions = ['watchers', 'creator', 'triggered_by', 'unassigned', 'assignees'];
                if ((typeof item === "number") || (dynamicOptions.includes(item))) {
                    return item;
                };
            });
            getWorkspaceMembers(afterUserArr, 'after');
        }
    }, [assigneeArray]);


    useEffect(() => {
        console.log('card details: ', cardDetails)
        console.log('the field id is: ', cardDetails?.trigger?.type)
        // console.log('before value is: ', cardDetails?.trigger?.conditions[0]?.before[0])
        // console.log('after value is: ', cardDetails?.trigger?.conditions[1]?.after[0])
        console.log('the field id is: ', cardDetails?.trigger?.conditions)
        console.log('trigger shard', shard)
        console.log('trigger team id', teamId)
    }, []);

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className="value">
                        <FontAwesomeIcon
                            className='icon fa-regular'
                            icon={icon({ name: 'pen-to-square', style: 'regular' })} />
                        {triggerName}</Card.Title>
                    <span>
                        <b className="card-text">Field</b>
                    </span>
                    {customField ? (
                        <>
                            <Card className="value label-container">{renderIcon(customField)}</Card>
                            {(customField.type_id === 14) ? (
                                <>
                                    <div>{renderTrigger(customField)}</div>
                                </>
                            ) : (customField.type_id === 10) ? (
                                <>
                                    <span>
                                        <b className="card-text">From</b>
                                    </span>
                                    <div className='change-assignee-field'>
                                        {beforeWorkspaceAssignees.map((assignee, i) => {
                                            if ((i < 3) || ((i === 3) && (beforeWorkspaceAssignees.length === 4))) {
                                                return (
                                                    <span key={i}>
                                                        {assignee?.user ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-${assignee?.user?.username}`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-${assignee?.user?.username}`}
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
                                                        ) : assignee === 'unassigned' ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-unassigned`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-unassigned`}
                                                                    data-tooltip-content={`None`}
                                                                    data-tooltip-place="top">
                                                                    <FontAwesomeIcon
                                                                        transform="grow-12"
                                                                        className="icon-circle"
                                                                        style={{ color: `grey` }}
                                                                        icon={icon({ name: 'circle' })} />
                                                                    <FontAwesomeIcon
                                                                        className='dynamic-assignee-icon dynamic-none'
                                                                        icon={icon({ name: 'users' })} />
                                                                </span><span className='space'></span>

                                                            </>
                                                        ) : assignee === "watchers" ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-watchers`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-watchers`}
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
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-creator`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-creator`}
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
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-triggered_by`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-triggered_by`}
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
                                                        ) : assignee === "assignees" ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-assignees`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-assignees`}
                                                                    data-tooltip-content={`Assignees`}
                                                                    data-tooltip-place="top">
                                                                    <FontAwesomeIcon
                                                                        transform="grow-12"
                                                                        className="icon-circle"
                                                                        style={{ color: `grey` }}
                                                                        icon={icon({ name: 'circle' })} />
                                                                    <FontAwesomeIcon
                                                                        className='dynamic-assignee-icon-2'
                                                                        icon={icon({ name: 'circle-user' })} />
                                                                </span><span className='space'></span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-b-${assignee.initials}`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-b-${assignee.initials}`}
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

                                            } else if (i === (beforeWorkspaceAssignees.length - 1)) {
                                                // last one, tack onto end of array
                                                if (assignee?.user?.username) {
                                                    // its a user
                                                    let newText = beforeExtraArray.concat(assignee?.user?.username);
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                } else if (assignee?.name) {
                                                    // its a team
                                                    let newText = beforeExtraArray.concat(assignee?.name);
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                } else if (assignee === 'unassigned') {
                                                    // its unassigned - push string 'None' to overflow array to match ClickUp UI
                                                    let newText = beforeExtraArray.concat('None');
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                } else {
                                                    // its dynamic and not 'unassigned'
                                                    let newText = beforeExtraArray.concat(assignee);
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                };
                                            } else {
                                                // add a comma and a Space
                                                if (assignee?.user?.username) {
                                                    // its a user
                                                    let newText = beforeExtraArray.concat(assignee?.user?.username + ',' + ' ');
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                } else if (assignee?.name) {
                                                    // its a team
                                                    let newText = beforeExtraArray.concat(assignee?.name + ',' + ' ');
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                } else if (assignee === 'unassigned') {
                                                    // its unassigned - push string 'None' to overflow array to match ClickUp UI
                                                    let newText = beforeExtraArray.concat('None' + ',' + ' ');
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                } else {
                                                    // its dynamic and not 'unassigned'
                                                    let newText = beforeExtraArray.concat(assignee + ',' + ' ');
                                                    beforeExtraArray = newText;
                                                    beforeCount++;
                                                };
                                            }
                                        })}
                                        {beforeWorkspaceAssignees.length > 4 ? (
                                            <span>
                                                <Tooltip
                                                    className="extras-tip"
                                                    id={'t-b-extras'} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={'t-b-extras'}
                                                    data-tooltip-content={beforeExtraArray}
                                                    data-tooltip-place="top">
                                                    <FontAwesomeIcon
                                                        transform="grow-12"
                                                        className="icon-circle"
                                                        icon={icon({ name: 'circle' })} />
                                                    <span className='fa-layers-text overflow-text'>+{beforeCount}</span>
                                                </span><span className='space'></span>
                                            </span>
                                        ) : (<></>)}
                                    </div>
                                    <span>
                                        <b className="card-text">To</b>
                                    </span>

                                    <div className='change-assignee-field'>
                                        {afterWorkspaceAssignees.map((assignee, i) => {
                                            if ((i < 3) || ((i === 3) && (afterWorkspaceAssignees.length === 4))) {
                                                return (
                                                    <span key={i}>
                                                        {assignee?.user ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-${assignee?.user?.username}`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-${assignee?.user?.username}`}
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
                                                        ) : assignee === 'unassigned' ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-unassigned`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-unassigned`}
                                                                    data-tooltip-content={`None`}
                                                                    data-tooltip-place="top">
                                                                    <FontAwesomeIcon
                                                                        transform="grow-12"
                                                                        className="icon-circle"
                                                                        style={{ color: `grey` }}
                                                                        icon={icon({ name: 'circle' })} />
                                                                    <FontAwesomeIcon
                                                                        className='dynamic-assignee-icon dynamic-none'
                                                                        icon={icon({ name: 'users' })} />
                                                                </span><span className='space'></span>

                                                            </>
                                                        ) : assignee === "watchers" ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-watchers`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-watchers`}
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
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-creator`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-creator`}
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
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-triggered_by`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-triggered_by`}
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
                                                        ) : assignee === "assignees" ? (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-assignees`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-assignees`}
                                                                    data-tooltip-content={`Assignees`}
                                                                    data-tooltip-place="top">
                                                                    <FontAwesomeIcon
                                                                        transform="grow-12"
                                                                        className="icon-circle"
                                                                        style={{ color: `grey` }}
                                                                        icon={icon({ name: 'circle' })} />
                                                                    <FontAwesomeIcon
                                                                        className='dynamic-assignee-icon triggered-icon'
                                                                        icon={icon({ name: 'circle-user' })} />
                                                                </span><span className='space'></span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Tooltip className="dynamic-tooltip" id={`t-a-${assignee.initials}`} />
                                                                <span
                                                                    className="fa-layers person-icon"
                                                                    data-tooltip-id={`t-a-${assignee.initials}`}
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

                                            } else if (i === (afterWorkspaceAssignees.length - 1)) {
                                                // last one, tack onto end of array
                                                if (assignee?.user?.username) {
                                                    // its a user
                                                    let newText = afterExtraArray.concat(assignee?.user?.username);
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                } else if (assignee?.name) {
                                                    // its a team
                                                    let newText = afterExtraArray.concat(assignee?.name);
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                } else if (assignee === 'unassigned') {
                                                    // its unassigned - push string 'None' to overflow array to match ClickUp UI
                                                    let newText = afterExtraArray.concat('None');
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                } else {
                                                    // its dynamic and not 'unassigned'
                                                    let newText = afterExtraArray.concat(assignee);
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                };
                                            } else {
                                                // add a comma and a Space
                                                if (assignee?.user?.username) {
                                                    // its a user
                                                    let newText = afterExtraArray.concat(assignee?.user?.username + ',' + ' ');
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                } else if (assignee?.name) {
                                                    // its a team
                                                    let newText = afterExtraArray.concat(assignee?.name + ',' + ' ');
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                } else if (assignee === 'unassigned') {
                                                    // its unassigned - push string 'None' to overflow array to match ClickUp UI
                                                    let newText = afterExtraArray.concat('None' + ',' + ' ');
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                } else {
                                                    // its dynamic and not 'unassigned'
                                                    let newText = afterExtraArray.concat(assignee + ',' + ' ');
                                                    afterExtraArray = newText;
                                                    afterCount++;
                                                };
                                            }
                                        })}
                                        {afterWorkspaceAssignees.length > 4 ? (
                                            <span>
                                                <Tooltip
                                                    className="extras-tip"
                                                    id={'t-a-extras'} />
                                                <span
                                                    className="fa-layers person-icon"
                                                    data-tooltip-id={'t-a-extras'}
                                                    data-tooltip-content={afterExtraArray}
                                                    data-tooltip-place="top">
                                                    <FontAwesomeIcon
                                                        transform="grow-12"
                                                        className="icon-circle"
                                                        icon={icon({ name: 'circle' })} />
                                                    <span className='fa-layers-text overflow-text'>+{afterCount}</span>
                                                </span><span className='space'></span>
                                            </span>
                                        ) : (<></>)}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Card >{renderTrigger(customField)}</Card>
                                </>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}
export default CustomFieldCard;