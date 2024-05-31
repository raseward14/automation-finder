import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    let line = '';

    const testFunction = (obj, i) => {
        if(obj.text === '\n') {
            // return <br/>;
            console.log('line break');
            let newLine = line;
            line = '';
            return <span>{newLine}</span>
        } else {
            line = line.concat(obj.text);
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
