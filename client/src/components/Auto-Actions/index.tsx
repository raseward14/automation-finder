import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ClickUpLogo from '../images/clickup-logo.jpeg';
import './style.css';

type CardPropList = {
  cardDetails: any
  key: any
}

export function CommentCard(props: CardPropList) {
  return (
    <>
      <Card key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function AssigneeCard(props: CardPropList) {
  return (
    <>
      <Card key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function StatusCard(props: CardPropList) {
  return (
    <>
      <Card key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function DefaultCard(props: CardPropList) {
  return (
    <>
      <Card key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}



type ActionPropList = {
  triggerObject: any
}

const Actions = (props: ActionPropList) => {
  const [triggerObject, setTriggerObject] = useState<any>(props.triggerObject);
  const [actionCardArray, setActionCardArray] = useState<any>([]);
  let emptyArr: any = [];

  const createActionObject = (action: any, i: any) => {
    let type = action.type;
    console.log(type);
    switch (true) {
      case /assignee/.test(type):
        // consider calling funciton here to create object for this card
        let assigneeCard = {
          name: "Change assignees",
          action: action
        }
        emptyArr?.push(assigneeCard);
        break;
      case /comment/.test(type):
        let commentCard = {
          name: "Add a comment",
          action: action
        }
        emptyArr?.push(commentCard);
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
    }
  }

  useEffect(() => {
    // cleanup is used so that in StrictMode, when the component re-mounts, the array is empty, and populates actions once
    emptyArr = [];
    if (triggerObject?.actions) {
      let actionArray = triggerObject?.actions
      for (var i = 0; i < actionArray.length; i++) {
        // call functions to create different kinds of action cards
        createActionObject(actionArray[i], i)
        if ((i + 1) === actionArray.length) {
          setActionCardArray(emptyArr);
        }
      }
    }
  }, []);

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
      </Card><br id="action-header" />

      <>
        {actionCardArray.map((card: any, i: any) => (
          (
            () => {
              console.log('looped through an action', card, i)
              let actionHeader = document.getElementById("action-header")

              switch (card.name) {
                case "Change assignees":
                  return <AssigneeCard cardDetails={card} key={`${i}`} />
                  break;
                case "Add a comment":
                  return <CommentCard cardDetails={card} key={`${i}`} />
                  break;
              }

              let newCard = document.getElementById(`${i}`)

              if (newCard) {
                actionHeader?.append(newCard);
              }

            }
          )()

          // consider dynamic rendering by card type
          // card.name ?
          //   <Card>
          //     <Card.Body>
          //       <Card.Title>
          //         {card.name}
          //       </Card.Title>
          //     </Card.Body>
          //   </Card>
          //   :
          //   <></>

        ))}

      </>

    </>
  )
};

export default Actions;