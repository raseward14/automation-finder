import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    const [finalState, setFinalState] = useState([]);
    let line = '';
    let lineArray = [];
    let arrayOfLines = [];
    let finalComment = [];

    // const printComment = (comment) => {
    //     comment?.forEach((line) => {
    //         console.log('line is: ', line);
    //         (<span className="inline">
    //             {line.forEach((string) => {
    //                 console.log('line string is: ', string)
    //                 return (<div>{string.text}</div>)
    //             })}
    //         </span>)
    //     })
    // }

    const formatComment = (obj, i) => {
        console.log('text object: ', obj)
        if (obj.text === '\n') {
            console.log('line: ', lineArray, (i + 1), commentArray.length)
            arrayOfLines.push(lineArray);
            lineArray = [];
            if ((i + 1) === commentArray.length) {
                finalComment = arrayOfLines;
                setFinalState(finalComment);
                arrayOfLines = [];
                finalComment = [];
            }
        } else {
            lineArray.push(obj)
        }
    }

    useEffect(() => {
        if (finalState.length > 0) {
            console.log('my final comment', finalState);
        };
    }, [finalState]);

    useEffect(() => {
        if (commentArray !== null) {
            commentArray.map((text, i) => {
                formatComment(text, i);
            });
        };
    }, [commentArray]);

    return (
        <>
            <Card className="action-card" key={key}>
                <Card.Body>
                    <Card.Title className='value'>
                        {cardDetails.name}
                    </Card.Title>
                    <Card className='status'>
                        {finalState.map((line, i) => {
                            return (
                                <span key={i}>
                                    {line.map((obj, i) => (
                                            <span key={i}>{obj.text}</span>
                                    ))}
                                </span>
                            )
                        })}
                    </Card>
                </Card.Body >
            </Card >
        </>
    )
}
export default CommentCard;
