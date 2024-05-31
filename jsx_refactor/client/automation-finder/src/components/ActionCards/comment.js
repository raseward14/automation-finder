import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    let line = '';
    let lineObjects = [];

    const testFunction = (obj, i) => {
        if (obj.text === '\n') {
            console.log('line break');
            let newLine = line;
            let newArray = lineObjects
            line = '';
            lineObjects = []
            console.log(newArray);
            // return <div>
            //     {newArray.forEach((item) => {
            //         if ("bold" in item.attributes) {
            //             <strong>{item.text}</strong>
            //         } else {
            //             <div>{item.text}</div>
            //         }

            //     })}
            // </div>
            return <span>{newLine}</span>
        } else {
            line = line.concat(obj.text);
            lineObjects.push(obj);
            console.log(line);
        }
    }

    useEffect(() => {
        console.log('comment array: ', commentArray);
    }, [commentArray])
    return (
        <>
            <Card className="action-card" key={key}>
                <Card.Body>
                    <Card.Title className='value'>
                        {cardDetails.name}
                    </Card.Title>
                    <Card className='status'>{commentArray ? (
                        <>
                            {commentArray.map((text, i) => (
                                // <span>{text.text}</span>
                                testFunction(text)
                            ))}
                        </>
                    ) : (
                        <></>
                    )
                    }</Card>
                </Card.Body>
            </Card>
        </>
    )
}
export default CommentCard;
