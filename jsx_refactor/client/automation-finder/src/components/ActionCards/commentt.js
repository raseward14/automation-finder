import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CommentCard = ({ cardDetails, key }) => {
    const [commentArray, setCommentArray] = useState(cardDetails?.action?.input?.comment);
    const [commentText, setCommentText] = useState();

    const CommentText = (props) => {
        console.log(props.text);
        const text = props.text;
        const newText = text.split('\n').map(str => <p className='text'>{str.text}</p>);
        return newText;
   }
    useEffect(() => {
        console.log('comment array: ', commentArray);
        if(commentArray) {
            let text = commentArray.map(obj => obj.text);
            setCommentText(text)
        }
    }, [commentArray])
    return (
        <>
            <Card className="action-card" key={key}>
                <Card.Body>
                    <Card.Title className='value'>
                        {cardDetails.name}
                    </Card.Title>
                    <Card className='status'><CommentText text={`${commentText}`}/></Card>
                </Card.Body>
            </Card>
        </>
    )
}
export default CommentCard;
