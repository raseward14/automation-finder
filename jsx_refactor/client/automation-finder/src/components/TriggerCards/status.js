import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import "./style.css";


// status changes
const StatusCard = ({ triggerName, beforeAfter, parentType, parentId, shard }) => {
    const [statusBefore, setStatusBefore] = useState([]);
    const [beforeStatusObjects, setBeforeStatusObjects] = useState([]);
    const [statusAfter, setStatusAfter] = useState([]);
    const [afterStatusObjects, setAfterStatusObjects] = useState([]);
    const [locationStatuses, setLocationStatuses] = useState([]);
    const [JWT, setJWT] = useState(localStorage.getItem('jwt'));


    const getStatuses = async (parentType, parentId) => {
        let req;
        switch (parentType) {
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
                shard: shard,
                locationId: parentId,
                bearer: JWT
            }
        );
        if (res?.data) {
            setLocationStatuses(res?.data);
        }
    };

    useEffect(() => {
        if (statusBefore.length >= 1) {
            let statusArray = statusBefore?.map((value) => {
                let found = locationStatuses?.find((status) => status.id === value?.status_id);
                return found;
            })
            setBeforeStatusObjects(statusArray);
        }
        if (statusAfter.length >= 1) {
            let statusArray = statusAfter?.map((value) => {
                let found = locationStatuses?.find((status) => status.id === value?.status_id);
                return found;
            })
            setAfterStatusObjects(statusArray);
        }
    }, [locationStatuses])

    useEffect(() => {
        if (statusBefore.length >= 1) {
            getStatuses(parentType, parentId)
        }
    }, [statusBefore])

    useEffect(() => {
        if (statusAfter.length >= 1) {
            // console.log('we have statuses after', statusAfter)
            getStatuses(parentType, parentId)
        }
    }, [statusAfter])

    useEffect(() => {
        console.log('from trigger card', beforeAfter)
        const foundBefore = beforeAfter.find((object) => object.hasOwnProperty('before'));
        if (foundBefore) {
            setStatusBefore(foundBefore.before);
        }
        const foundAfter = beforeAfter.find((object) => object.hasOwnProperty('after'));
        if (foundAfter) {
            setStatusAfter(foundAfter.after);
        }
    }, [beforeAfter])

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className='value'>
                        {triggerName}
                    </Card.Title>

                    <Card className='from-to'><span className='status-label'>From: </span>
                        {beforeStatusObjects.length ? (
                            <Card className='status status-trigger'>
                                {beforeStatusObjects?.map((status, i) => (
                                    <div key={i} className='status-row'>
                                        <FontAwesomeIcon style={{ color: `${status?.color}` }} icon={icon({ name: 'square' })} />{status?.status}
                                    </div>
                                ))}
                            </Card>
                        ) : (
                            <span>Any Status</span>
                        )}
                    </Card>

                    <Card className='from-to'><span className='status-label'>To: </span>
                        {afterStatusObjects.length ? (
                            <Card className='status status-trigger'>
                                {afterStatusObjects?.map((status, i) => (
                                    <div key={i} className='status-row'>
                                        <FontAwesomeIcon style={{ color: `${status?.color}` }} icon={icon({ name: 'square' })} />{status?.status}
                                    </div>
                                ))}
                            </Card>
                        ) : (
                            <span>Any Status</span>
                        )}
                    </Card>

                </Card.Body>
            </Card>
        </>
    )
}
export default StatusCard;