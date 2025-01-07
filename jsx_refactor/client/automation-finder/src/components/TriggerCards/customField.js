import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css";

// cfbd77f1-e930-4f59-900e-1831f1932674
// Custom Field changes
const CustomFieldCard = ({ triggerName, cardDetails, shard, teamId }) => {

    // all have from and to except
    // signature
    // checkbox
    // voting
    // files does not have a border

    useEffect(() => {
        console.log('card details: ', cardDetails)
        console.log('the field id is: ', cardDetails?.trigger?.type)
        console.log('before value is: ', cardDetails?.trigger?.conditions[0]?.before[0])
        console.log('after value is: ', cardDetails?.trigger?.conditions[1]?.after[0])
        console.log('trigger shard', shard)
        console.log('trigger team id', teamId)
    }, [])
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className='value'>
                        {triggerName}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}
export default CustomFieldCard;