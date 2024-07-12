import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';
import "./style.css"

const AssigneeCard = ({ cardDetails, shard, teamId}) => {
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));
  // unassign
  const [unassign, setUnassign] = useState(false);
  // for Workspace users
  const [workspaceAssignees, setWorkspaceAssignees] = useState([]);
  // Add assignees
  const [addAssignee, setAddAssignee] = useState([]);
  let extraAdd = '';
  let addCount = 0;
  // Remove assignees
  const [remAssignee, setRemAssignee] = useState([]);
  let extraRem = '';
  let remCount = 0;
  // Reassign
  const [assignee, setAssignee] = useState([]);
  let extraAssignee = '';
  let assigneeCount = 0;
  
  // returns Workspace users
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
        // getAssignees(assigneeArr, res.data.members);
    };
};

  // Remove all assignees green checkbox
    // action.input.unassign: true
  // if this is true, nothing else is rendered
  // if this is not true, the unassign property doesn't exist in the input object

  // Add assignees (default) (single avatar array, but spread across two properties) - handled the same way as assignee added/removed triggers
    // action.input.add_assignees: [14917287]
    // action.input.add_special_assignees: ['watchers', 'creator', 'triggered_by']
  // Remove assignees (single avatar array, but spread across two properties) - handled the same way as assignee added/removed triggers
    // action.input.rem_assignees: [14917287]
    // action.input.rem_special_assignees: ['watchers', 'creator', 'triggered_by', 'assignees'] -> there is one additional option here - assignees
  // Reassign
    // action.input.assignees: [14917287, 61313973, 37710627] -> no dynamic options available here
    useEffect(() => {
      console.log('from assignee action', cardDetails)
      // if (cardDetails.trigger.type === 'assignee') {
      //     setAssigneeArray(cardDetails.trigger.conditions[0].after);
      // } else {
      //     setAssigneeArray(cardDetails.trigger.conditions[0].before);
      // };
      if (cardDetails.action.input?.unassign) {
        setUnassign(true)
      }
      // else set state variables above
  }, [])
    return (
      <>
        <Card className="action-card">
          <Card.Body>
            <Card.Title className='value'>
              {cardDetails.name}
            </Card.Title>
          </Card.Body>
        </Card>
      </>
    )
  }
  export default AssigneeCard;