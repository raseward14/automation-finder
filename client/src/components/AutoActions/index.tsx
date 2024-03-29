import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ClickUpLogo from '../images/clickup-logo.jpeg';
import './style.css';

type CardPropList = {
  cardDetails: any
  key: any
}

export function ApplyTemplateCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function CallWebhookCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function ChangePriorityCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

// change start date
// change due date
export function ChangeDateCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function ChangeTagsCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function ChangeTaskTypeCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function ChangeWatchersCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function CreateAListCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function CreateATaskCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function CreateASubtaskCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function DuplicateCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function TimeCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

// add to list
// move to list
export function ToListCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function SetCustomFieldCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export function CommentCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
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
      <Card className="action-card" key={props.key}>
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
      <Card className="action-card" key={props.key}>
        <Card.Body>
          <Card.Title>
            {props.cardDetails.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

// delete task or subtask
// delete task
// delete subtask
// archive task
// archive subtask
// archive task or subtask
export function DefaultCard(props: CardPropList) {
  return (
    <>
      <Card className="action-card" key={props.key}>
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
      case /add_subcategory/.test(type):
        let addToListCard = {
          name: "Add to List",
          action: action
        }
        emptyArr?.push(addToListCard);
        break;
      case /apply_template/.test(type):
        let applyTemplateCard = {
          name: "Apply a template",
          action: action
        }
        emptyArr?.push(applyTemplateCard);
        break;
      case /archive/.test(type):
        let archiveCard;
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          archiveCard = {
            name: "Archive task or subtask",
            action: action
          }
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          archiveCard = {
            name: "Archive task",
            action: action
          }
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          archiveCard = {
            name: "Archive subtask",
            action: action
          }
        }
        emptyArr?.push(archiveCard);
        break;
      case /webhook/.test(type):
        let webhookCard = {
          name: "Call webhook",
          action: action
        }
        emptyArr?.push(webhookCard);
        break;
      case /due_date/.test(type):
        let dueDateCard = {
          name: "Change due date",
          action: action
        }
        emptyArr?.push(dueDateCard);
        break;
      case /priority/.test(type):
        let priorityCard = {
          name: "Change Priority",
          action: action
        }
        emptyArr?.push(priorityCard);
        break;
      case /start_date/.test(type):
        let startDateCard = {
          name: "Change start date",
          action: action
        }
        emptyArr?.push(startDateCard);
        break;
      case /status/.test(type):
        let statusCard = {
          name: "Change status",
          action: action
        }
        emptyArr?.push(statusCard);
        break;
      case /change_tags/.test(type):
        let tagsCard = {
          name: "Change tags",
          action: action
        }
        emptyArr?.push(tagsCard);
        break;
      case /custom_type/.test(type):
        let taskTypeCard = {
          name: "Change Task Type",
          action: action
        }
        emptyArr?.push(taskTypeCard);
        break;
      case /change_followers/.test(type):
        let watchersCard = {
          name: "Change watchers",
          action: action
        }
        emptyArr?.push(watchersCard);
        break;
      case /create_list/.test(type):
        let listCard = {
          name: "Create a List",
          action: action
        }
        emptyArr?.push(listCard);
        break;
      case /create_task/.test(type):
        let taskCard = {
          name: "Create a task",
          action: action
        }
        emptyArr?.push(taskCard);
        break;
      case /create_subtask/.test(type):
        let subtaskCard = {
          name: "Create a subtask",
          action: action
        }
        emptyArr?.push(subtaskCard);
        break;
      case /delete/.test(type):
        let deleteCard;
        console.log(`${triggerObject?.trigger?.input?.trigger_on}`)
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          deleteCard = {
            name: "Delete task or subtask",
            action: action
          }
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          deleteCard = {
            name: "Delete task",
            action: action
          }
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          deleteCard = {
            name: "Delete subtask",
            action: action
          }
        }
        emptyArr?.push(deleteCard);
        break;
      case /copy/.test(type):
        let duplicateCard = {
          name: "Duplicate",
          action: action
        }
        emptyArr?.push(duplicateCard);
        break;
      case /time_estimate/.test(type):
        let timeEstimateCard = {
          name: "Estimate time",
          action: action
        }
        emptyArr?.push(timeEstimateCard);
        break;
      case /subcategory/.test(type):
        let moveToListCard = {
          name: "Move to List",
          action: action
        }
        emptyArr?.push(moveToListCard);
        break;
      case /custom_field/.test(type):
        let customFieldCard = {
          name: "Set Custom Field",
          action: action
        }
        emptyArr?.push(customFieldCard);
        break;
      case /time_spent/.test(type):
        let trackTimeCard = {
          name: "Track time",
          action: action
        }
        emptyArr?.push(trackTimeCard);
        break;
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
                case "Add to list" || "Move to List":
                  return <ToListCard cardDetails={card} key={`${i}`} />
                  break;
                case "Apply a template":
                  return <ApplyTemplateCard cardDetails={card} key={`${i}`} />
                  break;
                case "Call webhook":
                  return <CallWebhookCard cardDetails={card} key={`${i}`} />
                  break;
                case "Call due date" || "Change start date":
                  return <ChangeDateCard cardDetails={card} key={`${i}`} />
                  break;
                case "Change Priority":
                  return <ChangePriorityCard cardDetails={card} key={`${i}`} />
                  break;
                case "Change status":
                  return <StatusCard cardDetails={card} key={`${i}`} />
                  break;
                case "Change tags":
                  return <ChangeTagsCard cardDetails={card} key={`${i}`} />
                  break;
                case "Change Task Type":
                  return <ChangeTaskTypeCard cardDetails={card} key={`${i}`} />
                  break;
                case "Change watchers":
                  return <ChangeWatchersCard cardDetails={card} key={`${i}`} />
                  break;
                case "Create a List":
                  return <CreateAListCard cardDetails={card} key={`${i}`} />
                  break;
                case "Create a task":
                  return <CreateATaskCard cardDetails={card} key={`${i}`} />
                  break;
                case "Create a subtask":
                  return <CreateASubtaskCard cardDetails={card} key={`${i}`} />
                  break;
                case "Duplicate":
                  return <DuplicateCard cardDetails={card} key={`${i}`} />
                  break;
                case "Estimate time" || "Track time":
                  return <TimeCard cardDetails={card} key={`${i}`} />
                  break;
                case "Set Custom Field":
                  return <SetCustomFieldCard cardDetails={card} key={`${i}`} />
                  break;
                case "Archive task":
                  return <DefaultCard cardDetails={card} key={`${i}`} />
                  break;
                case "Archive subtask":
                  return <DefaultCard cardDetails={card} key={`${i}`} />
                  break;
                case "Archive task or subtask":
                  return <DefaultCard cardDetails={card} key={`${i}`} />
                  break;
                case "Delete task":
                  return <DefaultCard cardDetails={card} key={`${i}`} />
                  break;
                case "Delete subtask":
                  return <DefaultCard cardDetails={card} key={`${i}`} />
                  break;
                case "Delete task or subtask":
                  return <DefaultCard cardDetails={card} key={`${i}`} />
                  break;
              }

              let newCard = document.getElementById(`${i}`)

              if (newCard) {
                actionHeader?.append(newCard);
              }

            }
          )()

        ))}

      </>

    </>
  )
};

export default Actions;