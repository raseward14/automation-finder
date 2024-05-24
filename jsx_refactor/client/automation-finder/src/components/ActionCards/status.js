import { useEffect, useState } from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import "./style.css"

const StatusCard = ({ cardDetails, key }) => {
  // the status is action.input.status.status_id
  const [statusValue, setStatusValue] = useState(cardDetails?.action.input.status.status_id);
  const [actionStatus, setActionStatus ] = useState()
  const [locationStatuses, setLocationStatuses] = useState();
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

  const getStatuses = async (locationType, locationId) => {
    let req;
    switch (locationType) {
      // List
      case 6:
        req = 'http://localhost:8080/automation/listStatus';
        break;
      // Folder
      case 5:
        req = 'http://localhost:8080/automation/folderStatus';
        break;
      // Space
      case 4:
        req = 'http://localhost:8080/automation/spaceStatus';
        break;
    }
    const res = await axios.post(req,
      {
        shard: cardDetails.shard,
        locationId: locationId,
        bearer: JWT
      }
    );
    if (res?.data) {
      setLocationStatuses(res?.data);
    };
  };

  useEffect(() => {
    console.log('action status from the status card', actionStatus)
  }, [actionStatus]);

  useEffect(() => {
    setActionStatus(locationStatuses?.find((status) => status?.id === statusValue));
  }, [locationStatuses]);

  // when we have a status_id, make the api call to get the location statuses - need a location_id
  useEffect(() => {
    getStatuses(cardDetails?.parentType, cardDetails?.parentId);
  }, [statusValue]);

  return (
    <>
      <Card className="action-card" key={key}>
        <Card.Body>
          <Card.Title className='value'>
            {cardDetails.name}
          </Card.Title>
          {actionStatus ? (
            <>            
            <span className='status-label'>STATUS:</span>
            <Card style={{ color: `${actionStatus?.color}` }} className='status'>{actionStatus?.status}</Card>
            </>
          ) : (<></>)}
        </Card.Body>
      </Card>
    </>
  )
}

export default StatusCard;
