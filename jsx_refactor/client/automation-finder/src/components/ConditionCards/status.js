import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import "./style.css"

// this card needs a locationId, and a locationType
const StatusCard = ({ cardDetails, key }) => {
  const [conditionStatuses, setConditionStatuses] = useState([]);
  const [valueArray, setValueArray] = useState(cardDetails?.value);
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
    let statusArray = valueArray?.map((value) => {
      let found = locationStatuses?.find((status) => status?.id === value?.status_id);
      return found;
    })
    setConditionStatuses(statusArray);
  }, [locationStatuses]);

  useEffect(() => {
    getStatuses(cardDetails?.parentType, cardDetails?.parentId);
  }, [valueArray]);

  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className='value'>
            {cardDetails.name}
          </Card.Title>
          <Card className='value'>{cardDetails.op}</Card>
          {conditionStatuses ? (
            <Card className='status'>
              {conditionStatuses?.map((status, i) => (
                <div key={i} className='status-row'>
                  <FontAwesomeIcon style={{ color: `${status?.color}` }} icon={icon({ name: 'square' })} />{status?.status}
                </div>
              )
              )}
            </Card>
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
export default StatusCard;