import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ClickUpLogo from '../images/clickup-logo.jpeg';
import './style.css';

type ActionPropList = {
  triggerObject: any
}

const Actions = (props: ActionPropList) => {
  const [triggerObject, setTriggerObject] = useState<any>(props.triggerObject);
  const [actionArray, setActionArray] = useState<any>([]);
  const [ActionName, setActionName] = useState<string>('');
  const [actionCardArray, setActionCardArray] = useState<any>([]);

  const createActionObject = (action: any) => {
    let type = action.type;
    let newArr = [...actionArray];
    switch (true) {
      case /assignee/.test(type):
        // consider calling funciton here to create object for this card
        let assigneeCard = {
          name: "Change assignees"
        }
        newArr.push(assigneeCard);
        setActionCardArray(newArr);
        break;
      case /comment/.test(type):
        let commentCard = {
          name: "Add a comment"
        }
        newArr.push(commentCard);
        setActionCardArray(newArr);
        break;
      // case /assignee/.test(type):
      //   setActionName('Assignee added');
      //   break;
      // case /assignee_removed/.test(type):
      //   setActionName('Assignee removed');
      //   break;
      // case /comment/.test(type):
      //   setActionName('Comment is added');
      //   break;
      // case /cf_/.test(type):
      //   setActionName('Custom Field changes');
      //   break;
      // case /on_due_date/.test(type):
      //   setActionName('Due date arrives');
      //   break;
      // case /due date/.test(type):
      //   setActionName('Due date changes');
      //   break;
      // case /added_to_subcategory/.test(type):
      //   setActionName('Existing task or subtask is added to this location');
      //   break;
      // case /subcategory_id/.test(type):
      //   setActionName('Existing task or subtask is moved to this location');
      //   break;
      // case /priority/.test(type):
      //   setActionName('Priority changes');
      //   break;
      // case /on_start_date/.test(type):
      //   setActionName('Start date arrives');
      //   break;
      // case /start_date/.test(type):
      //   setActionName('Start date changes');
      //   break;
      // case /tag/.test(type):
      //   setActionName('Tag added');
      //   break;
      // case /tag_removed/.test(type):
      //   setActionName('Tag removed');
      //   break;
      // case /task_created/.test(type):
      //   setActionName('Task or subtask created');
      //   break;
      // case /linked_task/.test(type):
      //   setActionName('Task or subtask linked');
      //   break;
      // case /unblocked/.test(type):
      //   setActionName('Task or subtask unblocked');
      //   break;
      // case /time_spent/.test(type):
      //   setActionName('Time tracked');
      //   break;
      default:
        setActionName('');
    }
  }

  useEffect(() => {
    console.log('action array', actionArray)
    if (actionArray) {
      for (var i = 0; i < actionArray.length; i++) {
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
            <span className="action-text">
              Do this action
            </span>
          </div>
        </div>
      </Card><br />
      {actionCardArray.map((card: any) => (
        // consider dynamic rendering by card type
        card.name ?  
        <Card>
          <Card.Body>
            <Card.Title>
              {card.name}
            </Card.Title>
          </Card.Body>
        </Card>
        :
        <></>
      ))}
    </>
  )
};

export default Actions;