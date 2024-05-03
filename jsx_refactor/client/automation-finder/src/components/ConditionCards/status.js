import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

// this card needs a locationId, and a locationType
const StatusCard = ({ cardDetails, key }) => {
  const [valueArray, setValueArray] = useState(cardDetails?.value)
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

  const getSpaceStatuses = () => {
    // Space
    // https://{shard}.clickup.com/hierarchy/v1/project/{space_id}
    // endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})

  }

  const getFolderStatuses = (folderId) => {
    // Folder
    // https://{shard}.clickup.com/hierarchy/v1/category/{Folder_id}
    // endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})

  }

  const getListStatuses = (listId) => {
    // List
    // https://{shard}.clickup.com/hierarchy/v1/subcategory/{list_id}
    // endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})

  }

  useEffect(() => {
    console.log(cardDetails?.parentType, cardDetails?.parentId)
    // each object[i] contains a status_id property with the value
    // the endpoint is different for Space, Folder, list
    // if (list) {
    //   getListStatuses(listId)
    // } else if (folder) {
    //   getFolderStatuses(folderId)
    // } else if (space) {
    //   getSpaceStatuses(spaceId)
    // }
  }, [valueArray])
  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className='value'>
            {cardDetails.name}
          </Card.Title>
          <Card className='value'>{cardDetails.op}</Card>

        </Card.Body>
      </Card>
    </>
  )
}
export default StatusCard;