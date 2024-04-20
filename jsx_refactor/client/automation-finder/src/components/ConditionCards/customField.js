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

  const getValue = (action) => {
    switch (action.type_id) {
      // 5 is text, ai summary, ai progress update, txt area
      case 5:
      case 15:
      case 2:
      case 7:
      case 8:
        setValueText(cardDetails.value)
        break;
      case 6:
        // insert logic to convert boolean to text
        break;
      case 4:
        // add a function to convert 1713520800000 to a date
        break;
      case 16:
        // add function to loop through attachment URLs and display them
        break;
      case 12:
        // this is a label, so we'll need to loop through and display all item.label string text values 
      case 19:
        setValueText(cardDetails?.value?.formatted_address)
        break;
    }
  }

  useEffect(() => {
    console.log('from Custom Field card', customField)
    if (customField !== undefined) {
      // the only way to do this is to switch the field type_id prop
      // will need to call function from here
      // function can perform this find method
      getValue(customField)

      // this logic works for dropdowns
      let valueArray = customField?.type_config?.options;
      console.log(valueArray);
      console.log(fieldValue)
      // let result = valueArray?.find(item => item.id === fieldValue);
      // setValueText(result?.name);

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
          <span><b className='card-text'>FIELD</b></span>
          {customField && valueText ? (
            <>
              <Card className='value'>{customField?.name}</Card>
              <span><b className='card-text'>VALUE</b></span>
              <Card className='value'>{valueText}</Card>
            </>
          ) : (<></>)}
        </Card.Body>
      </Card>
    </>
  )
}
export default CustomFieldCard;