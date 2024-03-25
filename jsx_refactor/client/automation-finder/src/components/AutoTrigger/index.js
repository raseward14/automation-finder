import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ClickUpLogo from '../images/clickup-logo.jpeg';
import './style.css';

const Trigger = ({ triggerObject }) => {
  const [triggerObject, setTriggerObject] = useState(triggerObject);
  const [triggerName, setTriggerName] = useState('');
  const [triggeredOn, setTriggeredOn] = useState('tasks or subtasks')

  const printAutomationTrigger = (type) => {
    switch (true) {
      case /status/.test(type):
        setTriggerName('Status changes');
        break;
      case /checklists_resolved/.test(type):
        setTriggerName('All checklists resolved');
        break;
      case /assignee/.test(type):
        setTriggerName('Assignee added');
        break;
      case /assignee_removed/.test(type):
        setTriggerName('Assignee removed');
        break;
      case /comment/.test(type):
        setTriggerName('Comment is added');
        break;
      case /cf_/.test(type):
        setTriggerName('Custom Field changes');
        break;
      case /on_due_date/.test(type):
        setTriggerName('Due date arrives');
        break;
      case /due date/.test(type):
        setTriggerName('Due date changes');
        break;
      case /added_to_subcategory/.test(type):
        setTriggerName('Existing task or subtask is added to this location');
        break;
      case /subcategory_id/.test(type):
        setTriggerName('Existing task or subtask is moved to this location');
        break;
      case /priority/.test(type):
        setTriggerName('Priority changes');
        break;
      case /on_start_date/.test(type):
        setTriggerName('Start date arrives');
        break;
      case /start_date/.test(type):
        setTriggerName('Start date changes');
        break;
      case /tag/.test(type):
        setTriggerName('Tag added');
        break;
      case /tag_removed/.test(type):
        setTriggerName('Tag removed');
        break;
      case /task_created/.test(type):
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask created');
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          setTriggeredOn('a task');
          setTriggerName('Task created');
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          setTriggeredOn('a subtask');
          setTriggerName('Subtask created');
        }
        break;
      case /linked_task/.test(type):
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask linked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          setTriggeredOn('a task');
          setTriggerName('Task linked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          setTriggerName('Subtask linked');
          setTriggeredOn('a subtask');
        }
        break;
      case /unblocked/.test(type):
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask unblocked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          setTriggeredOn('a task');
          setTriggerName('Task unblocked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          setTriggeredOn('a subtask');
          setTriggerName('Subtask unblocked');
        }
        break;
      case /time_spent/.test(type):
        setTriggerName('Time tracked');
        break;
      default:
        setTriggerName('');
    }
  }

  useEffect(() => {
    console.log(triggerName)
  }, [triggerName])

  useEffect(() => {
    if (triggerObject) {
      printAutomationTrigger(triggerObject?.trigger?.type);
    }
  }, [triggerObject])

  return (
    <>
      <Card>
        <div className="trigger-header-container">
          <img
            src={ClickUpLogo}
            className="clickup-icon-light" />
          <div className="trigger-text-container">
            <h4>When</h4>
            <span className="trigger-text">
              {`This happens on ${triggeredOn}`}
            </span>
          </div>
        </div>
      </Card><br />
      <Card>
        <Card.Body>
          <Card.Title>
            {triggerName}
          </Card.Title>
        </Card.Body>
      </Card>

    </>
  )
};

export default Trigger;