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

  const getSpaceStatuses = async (spaceId) => {
    // Space
    // https://{shard}.clickup.com/hierarchy/v1/project/{space_id}
    // endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})
    const res = await axios.post(
      'http://localhost:8080/automation/spaceStatus',
      {
        shard: cardDetails.shard,
        locationId: spaceId,
        bearer: JWT
      }
    );
    if (res?.data?.statuses) {
      setLocationStatuses(res?.data?.statuses);
    }
  };

  const getFolderStatuses = async (folderId) => {
    // Folder
    // https://{shard}.clickup.com/hierarchy/v1/category/{Folder_id}
    // endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})
    const res = await axios.post(
      'http://localhost:8080/automation/folderStatus',
      {
        shard: cardDetails.shard,
        locationId: folderId,
        bearer: JWT
      }
    );
    if (res?.data?.statuses) {
      setLocationStatuses(res?.data?.statuses);
    }
  };

  const getListStatuses = async (listId) => {
    console.log(cardDetails.shard, JWT)
    // List
    // https://{shard}.clickup.com/hierarchy/v1/subcategory/{list_id}
    // endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})
    const res = await axios.post(
      'http://localhost:8080/automation/listStatus',
      {
        shard: cardDetails.shard,
        locationId: listId,
        bearer: JWT
      }
    );
    if (res?.data) {
      setLocationStatuses(res?.data);
    }
  };

  useEffect(() => {
    console.log('the selected statuses: ', conditionStatuses)
  }, [conditionStatuses])

  useEffect(() => {
    // let statusString = '';
    console.log('returned from API request', locationStatuses, valueArray)
    let statusArray = valueArray?.map((value) => {
      let found = locationStatuses?.find((status) => status?.id === value?.status_id);
      return found;
    })
    setConditionStatuses(statusArray)

    // each object[i] contains a status_id property with the value
    // statusArray.map((status, i) => {
    //   if (i + 1 === statusArray.length) {
    //     let newString = statusString.concat(status);
    //     setValueText(newString);
    //   } else {
    //     let newString = statusString.concat(status + ', ');
    //     statusString = newString;
    //   }
    // });

  }, [locationStatuses])

  useEffect(() => {
    switch (cardDetails?.parentType) {
      case 6:
        getListStatuses(cardDetails?.parentId)
        break;
      case 5:
        getFolderStatuses(cardDetails?.parentId)
        break;
      case 4:
        getSpaceStatuses(cardDetails?.parentId)
        break;
    }
  }, [valueArray])

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
              {conditionStatuses?.map((status) => (
                <div className='status-row'>
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