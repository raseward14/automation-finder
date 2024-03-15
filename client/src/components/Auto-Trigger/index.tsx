import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

type TriggerPropList = {
  triggerObject: any
}

const Trigger = (props: TriggerPropList) => {
  const [triggerObject, setTriggerObject] = useState<any>(props.triggerObject);
  const [triggerName, setTriggerName] = useState<string>('');

  const printAutomationTrigger = (type: string) => {
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
        if (triggerObject?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask created');
        } else if (triggerObject?.input?.trigger_on === "TASK") {
          setTriggerName('Task created');
        } else if (triggerObject?.input?.trigger_on === "SUBTASK") {
          setTriggerName('Subtask created');
        }
        break;
      case /linked_task/.test(type):
        if (triggerObject?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask linked');
        } else if (triggerObject?.input?.trigger_on === "TASK") {
          setTriggerName('Task linked');
        } else if (triggerObject?.input?.trigger_on === "SUBTASK") {
          setTriggerName('Subtask linked');
        }
        break;
      case /unblocked/.test(type):
        if (triggerObject?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask unblocked');
        } else if (triggerObject?.input?.trigger_on === "TASK") {
          setTriggerName('Task unblocked');
        } else if (triggerObject?.input?.trigger_on === "SUBTASK") {
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
    console.log('trigger object', triggerObject)
  }, [triggerObject])

  return (
    <>
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