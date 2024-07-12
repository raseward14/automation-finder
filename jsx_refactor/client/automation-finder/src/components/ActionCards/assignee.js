import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const AssigneeCard = ({ cardDetails, key}) => {
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
    // console.log('this is a testt')
  })
    return (
      <>
        <Card className="action-card" key={key}>
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