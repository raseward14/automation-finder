import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    let line = '';
    let lineObjects = [];
    let attributeString = '';
    
    const testFunction = (obj, i) => {
        if (obj.text === '\n') {
            // create new var, and set old to empty for new line
            let newLine = line;
            line = '';

            // create a new array for our line objects, and empty global array for nxt line
            let newArray = lineObjects;
            console.log('array of objects for this line', newArray)
            lineObjects = [];
            // print the new line to the page
            // return <span>{newLine}</span>
        } else {
            attributeString = '';
            line = line.concat(obj.text);
            let attributeArray = Object.keys(obj?.attributes);
            attributeArray.forEach(style =>  {
                console.log('single attribute', style)
                let newString = attributeString.concat(style);
                let addSpace = newString.concat(' ');
                attributeString = addSpace;
            })
            console.log(attributeString);
            let newDiv = document.createElement('div');
            let content = document.createTextNode(`${obj.text}`);
            newDiv.appendChild(content);
            if(attributeString !== '') {
                newDiv.classList.add(attributeString);
            }
            let container = document.getElementById('container-test');
            container.appendChild(newDiv);
            // return <div className={attributeString}>{`${obj.text}`}</div>
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
                                testFunction(text)
                            ))}
                            <span id='container-test'></span>
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
