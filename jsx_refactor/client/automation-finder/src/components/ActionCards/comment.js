import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    const [completeLine, setCompleteLine] = useState([]);
    let line = '';
    let lineArray = [];
    let container = document.getElementById('line-container');

    const test2Function = (obj, i) => {
        console.log('text object: ', obj)
        if (obj.text === '\n') {
            console.log('complete line: ', lineArray)
            // setCompleteLine(lineArray)
           
            lineArray = [];
        } else {
            lineArray.push(obj)
        }

    }

    const testFunction = (obj, i) => {
        console.log('text object: ', obj)
        if (obj.text === '\n') {
            console.log('one complete line: ', lineArray);
            // create a new line
            let newSpan = document.createElement('span');
            newSpan.classList.add('inline');
            // array of text objects to print on this line
            let newArr = lineArray;
            // set global var back to empty
            lineArray = [];
            newArr.map((obj, i) => {
                // for each text object, create a new div
                let newDiv = document.createElement('div');
                // give the div text
                let content = document.createTextNode(`${obj.text}`);
                newDiv.appendChild(content);
                // create an array of its attributes, and append them to the new element
                let attributeArray = Object.keys(obj?.attributes);
                attributeArray.forEach(style => {
                    newDiv.classList.add(style);
                });
                // now append that styled div, with text to the line container
                newSpan.appendChild(newDiv);
            });
            // and append that line to the comment field
            console.log('container: ', container);
            if ((container !== null) && (newSpan !== null)) {
                container.appendChild(newSpan);
            }
        } else {
            lineArray.push(obj);
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
                    <Card className='status'>
                        {commentArray ? (
                            <>
                                {
                                    commentArray.map((text, i) => (
                                        // testFunction(text)
                                        test2Function(text)
                                    ))
                                }
                            </>
                        ) : (
                            <></>
                        )
                        }
                        {/* {completeLine ? (
                            <span className='inline'>
                                {
                                    completeLine.map((item, i) => {
                                        // let attributeArray = Object.keys(item?.attributes)
                                        <>
                                            <div>{item?.text}</div>
                                        </>

                                    })
                                }
                            </span>
                        ) : (
                            <></>
                        )} */}
                    </Card>
                </Card.Body >
            </Card >
        </>
    )
}
export default CommentCard;
