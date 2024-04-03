import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CreateASubtaskCard = ({ cardDetails, key }) => {
    return (
        <>
            <Card className="action-card" key={key}>
                <Card.Body>
                    <Card.Title>
                        {cardDetails.name}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}

export default CreateASubtaskCard;
