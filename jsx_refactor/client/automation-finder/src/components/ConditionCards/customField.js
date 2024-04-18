import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import "./style.css"

const CustomFieldCard = ({ cardDetails, key }) => {
  const [fieldId, setFieldId] = useState(cardDetails.name.slice(3));
  const [fieldValue, setFieldValue] = useState(cardDetails.value);
  const [valueText, setValueText] = useState();
  const [customField, setCustomField] = useState();
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

  const getCustomField = async (id) => {
    const res = await axios.post('http://localhost:8080/automation/customField', {
      shard: cardDetails.shard,
      fieldId: fieldId,
      bearer: JWT
    })
    if (res?.data) {
      setCustomField(res.data)
    }
  }


  useEffect(() => {
    console.log('from Custom Field card', customField)
    if (customField !== undefined) {
      let valueArray = customField?.type_config?.options;
      console.log(valueArray);
      console.log(fieldValue)
      let result = valueArray?.find(item => item.id === fieldValue);
      setValueText(result?.name);
    }
  }, [customField])

  useEffect(() => {
    getCustomField(fieldId)
  }, [fieldId])
  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className='value'>
            {`Custom Field`}
          </Card.Title>
          <Card className="value">{cardDetails.op}</Card>
          <span>FIELD</span>
          {customField && valueText ? (
            <>
              <Card className='value'>{customField?.name}</Card>
              <span>VALUE</span>
              <Card className='value'>{valueText}</Card>
            </>
          ) : (<></>)}
        </Card.Body>
      </Card>
    </>
  )
}
export default CustomFieldCard;