import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import './style.css';

import StatusCard from '../ConditionCards/status';
import TaskTypeCard from '../ConditionCards/taskType';
import PriorityCard from '../ConditionCards/priority';
import AssigneeCard from '../ConditionCards/assignee';
import DateCard from '../ConditionCards/date';
import TagCard from '../ConditionCards/tag';
import WatcherCard from '../ConditionCards/watcher';
import TimeEstimateCard from '../ConditionCards/timeEstimate';
import CustomFieldCard from '../ConditionCards/customField';


const Conditions = ({ conditionArray }) => {
    const [conditions, setCondidions] = useState(conditionArray);
    const [conditionCardArray, setConditionCardArray] = useState([])
    let emptyArr = [];

    const printOperator = (operator) => {
        switch (true) {
            case /any/.test(operator):
                return "is any of";
                break;
            case /not any/.test(operator):
                return "is not any of";
                break;
            case /all/.test(operator):
                return "is all of";
                break;
            case /not all/.test(operator):
                return "is not all of";
                break;
            case /is set/.test(operator):
                return "is set";
                break;
            case /is not set/.test(operator):
                return "is not set";
                break;
            case /eq/.test(operator):
                return "is equal to";
                break;
            case /not/.test(operator):
                return "is not equal to";
                break;
            case /lt/.test(operator):
                return "is less than";
                break;
            case /gt/.test(operator):
                return "is greater than";
                break;
            case /lte/.test(operator):
                return "is less than or equal to";
                break;
            case /gte/.test(operator):
                return "is greater than or equal to";
                break;
        }
    }

    const createConditionObject = (condition, i) => {
        let field = condition.field;
        let operator = condition.op;
        let value = condition.value;
        switch (true) {
            case /status/.test(field):
                let statusCard = {
                    name: "Status",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(statusCard);
                break;
            case /custom_type/.test(field):
                let taskTypeCard = {
                    name: "Task Type",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(taskTypeCard);
                break;
            case /priority/.test(field):
                let PriorityCard = {
                    name: "Priority",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(PriorityCard);
                break;
            case /due_date/.test(field):
                let dueDateCard = {
                    name: "Due Date",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(dueDateCard);
                break;
            case /start_date/.test(field):
                let startDateCard = {
                    name: "Start Date",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(startDateCard);
                break;
            case /assignee/.test(field):
                let assigneeCard = {
                    name: "Assignee",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(assigneeCard);
                break;
            case /tag/.test(field):
                let tagCard = {
                    name: "Tag",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(tagCard);
                break;
            case /follower/.test(field):
                let watcherCard = {
                    name: "Watcher",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(watcherCard);
                break;
            case /time_estimate/.test(field):
                let timeEstimateCard = {
                    name: "Time Estimate",
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(timeEstimateCard);
                break;
            default:
                let customFieldCard = {
                    name: field,
                    op: printOperator(operator),
                    value: value
                }
                emptyArr?.push(customFieldCard);
                break;
        }
    }

    useEffect(() => {
        console.log('condition card array;', conditionCardArray)
        conditionCardArray.map((card) => {
            console.log(card.name)
        })
    }, [conditionCardArray])

    useEffect(() => {
        // cleanup is used so that in StrictMode, when the component re-mounts the array is empty, and populates conditions once
        emptyArr = []
        console.log('from AutoCondition', conditions)
        for (var i = 0; i < conditions.length; i++) {
            createConditionObject(conditions[i], i)
            if ((i + 1) === conditions.length) {
                setConditionCardArray(emptyArr);
            }
        }
    }, [conditions])
    return (
        <div className='condition-container'><br id="condition-header" />
            {conditionCardArray.map((card, i) => (
                (
                    () => {
                        let conditionHeader = document.getElementById("condition-header");
                        let cardName = card.name;
                        if ((cardName !== undefined) && (cardName.slice(0,2)==="cf")) {
                            cardName = "cf";
                        } 
                        switch (cardName) {
                            case "Status":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <StatusCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Task Type":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <TaskTypeCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Priority":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <PriorityCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Due Date":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <DateCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Start Date":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <DateCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Assignee":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <AssigneeCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Tag":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <TagCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Watcher":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <WatcherCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "Time Estimate":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <TimeEstimateCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                            case "cf":
                                return (
                                    <>
                                        <span><em>and if this is true</em></span>
                                        <CustomFieldCard cardDetails={card} key={`${i}`} />
                                    </>
                                )
                                break;
                        }

                        let newCard = document.getElementById(`${i}`)

                        if (newCard) {
                            conditionHeader?.append(newCard);
                        }

                    }
                )()
            ))}
        </div>
    )
};

export default Conditions;