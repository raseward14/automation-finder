import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    let line = '';
    let lineObjects = [];
    
    const testFunction = (obj, i) => {
        if (obj.text === '\n') {
            // create new var, and set old to empty for new line
            let newLine = line;
            line = '';

            // create a new array for our line objects, and empty global array for nxt line
            let newArray = lineObjects;
            console.log('array of objects for this line', newArray)
            lineObjects = [];
            // create a new span element, and append all divs in array
            let newSpan = document.createElement('span');
            lineObjects.forEach((element) => {
                console.log(element)
                newSpan.appendChild(element)
            })
            console.log('the new line', newSpan);

            // print the new line to the page
            return <span>{newLine}</span>
            // return {newSpan};
        } else {
            line = line.concat(obj.text);
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `${obj.text}`;
            let attributeArray = Object.keys(obj?.attributes);
            attributeArray.forEach(key => newDiv.classList.add(`${key}`));
            lineObjects.push(newDiv);
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
