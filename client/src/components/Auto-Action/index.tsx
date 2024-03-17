import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ClickUpLogo from '../images/clickup-logo.jpeg';
import './style.css';

type ActionPropList = {
  triggerObject: any
}

const Action = (props: ActionPropList) => {
  const [triggerObject, setTriggerObject] = useState<any>(props.triggerObject);
  const [actionArray, setActionArray] = useState<any>([]);
  const [ActionName, setActionName] = useState<string>('');

  const createActionObject = (action: any) => {
    let type = action.type;
    switch (true) {
      case /status/.test(type):
        setActionName('Status changes');
        break;
      case /checklists_resolved/.test(type):
        setActionName('All checklists resolved');
        break;
      case /assignee/.test(type):
        setActionName('Assignee added');
        break;
      case /assignee_removed/.test(type):
        setActionName('Assignee removed');
        break;
      case /comment/.test(type):
        setActionName('Comment is added');
        break;
      case /cf_/.test(type):
        setActionName('Custom Field changes');
        break;
      case /on_due_date/.test(type):
        setActionName('Due date arrives');
        break;
      case /due date/.test(type):
        setActionName('Due date changes');
        break;
      case /added_to_subcategory/.test(type):
        setActionName('Existing task or subtask is added to this location');
        break;
      case /subcategory_id/.test(type):
        setActionName('Existing task or subtask is moved to this location');
        break;
      case /priority/.test(type):
        setActionName('Priority changes');
        break;
      case /on_start_date/.test(type):
        setActionName('Start date arrives');
        break;
      case /start_date/.test(type):
        setActionName('Start date changes');
        break;
      case /tag/.test(type):
        setActionName('Tag added');
        break;
      case /tag_removed/.test(type):
        setActionName('Tag removed');
        break;
      case /task_created/.test(type):
        setActionName('Task or subtask created');
        break;
      case /linked_task/.test(type):
        setActionName('Task or subtask linked');
        break;
      case /unblocked/.test(type):
        setActionName('Task or subtask unblocked');
        break;
      case /time_spent/.test(type):
        setActionName('Time tracked');
        break;
      default:
        setActionName('');
    }
  }

  useEffect(() => {
    if (actionArray) {
      for(var i = 0; i < actionArray.length; i++) {
        // call functions to create different kinds of action cards
        createActionObject(actionArray[i])
      }
    }
  }, [actionArray])

  useEffect(() => {
    console.log('trigger object', triggerObject)
    if (triggerObject) {
      setActionArray(triggerObject?.actions)
    }
  }, [triggerObject])

  return (
    <>
      <Card>
        <div className="action-header-container">
          <img
            src={ClickUpLogo}
            className="clickup-icon-light" />
          <div className="action-text-container">
            <h4>Then</h4>
            <span>
              Do this action:
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