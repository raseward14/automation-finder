import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ClickUpIcon from '../images/cu-white.png';
import './style.css';

// 8651cc40-e1e0-43a6-81f9-233398e11dc6
const CustomFieldCard = ({ cardDetails, key }) => {
  const [fieldId, setFieldId] = useState(cardDetails.name.slice(3));
  const [fieldValue, setFieldValue] = useState(cardDetails.value);
  const [valueText, setValueText] = useState();
  const [valueColor, setValueColor] = useState();
  const [customField, setCustomField] = useState();
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

  const getCustomField = async () => {
    const res = await axios.post(
      'http://localhost:8080/automation/customField',
      {
        shard: cardDetails.shard,
        fieldId: fieldId,
        bearer: JWT,
      }
    );
    if (res?.data) {
      console.log(res?.data)
      setCustomField(res.data);
    }
  };

  const renderCondition = (action) => {
    // console.log(action.type_id)
    switch (action.type_id) {
      // 5 is text, ai summary, ai progress update, txt area
      case 5:
        console.log('this was sent to renderCondition', cardDetails)
      // 15 text area & (ai)
      case 15:
        console.log('this was sent to renderCondition', cardDetails)
        break;
      // 12 label
      case 12:
        const labelValueArray = customField?.type_config?.options;
        let foundLabelArray = fieldValue.map((value) => {
          let found = labelValueArray.find((label) => value === label.id);
          return found;
        });
        console.log('found labels: ', foundLabelArray);
        return (
          <>
            {foundLabelArray.map((label, i) => {
              const styles = {
                backgroundColor: label?.color ? `${label?.color}` : 'inherit',
              };
              const parentStyles = {
                border: label?.color ? 'inherit' : '1px solid #abaeb0',
                borderRadius: '5px',
                width: 'fit-content',
                margin: '0px 2px 0px 2px'
              }
              return (
                <div style={parentStyles}>
                  <Card className='label' style={styles}>{label?.label}</Card>
                </div>
              )
            })}
          </>
        )
      // 1 dropdown
      case 1:
        let valueArray = customField?.type_config?.options;
        let result = valueArray?.find((item) => item.id === fieldValue);
        let valueName = result?.name
        let valueColor = result?.color
        return (
          <>
            <Card className='value' style={{ backgroundColor: valueColor ? `${valueColor}` : 'inherit' }}>{valueName}</Card>
          </>
        )
      default:
        return (<></>)
    }

  };

  const renderIcon = (action) => {
    switch (action.type_id) {
      // 5 is text, ai summary, ai progress update, txt area
      case 5:
        // text area & (ai)
        if (action?.type_config?.ai) {
          // ai
          return (
            <div className="condition-icon">
              <FontAwesomeIcon
                className="icon"
                icon={icon({ name: 'wand-magic-sparkles' })}
              />
              <>{customField?.name}</>
            </div>
          );
        } else {
          // text area
          return (
            <div className="condition-icon">
              <FontAwesomeIcon
                className="icon"
                icon={icon({ name: 'i-cursor' })}
              />
              <>{customField?.name}</>
            </div>
          );
        }
        break;
      case 15:
        // short text
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 't' })} />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 2:
        // email
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'envelope' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 7:
        // number
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'hashtag' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 0:
        // website
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'globe' })} />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 3:
        // phone
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'phone-flip' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 8:
        // currency
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'dollar-sign' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 6:
        // checkbox
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'square-check' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 4:
        // date
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'calendar' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 16:
        // attachment
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'paperclip' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 12:
        //  Label Custom Field
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'tag' })} />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 19:
        // address
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'location-dot' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 10:
        // users, we need to loop through userIds and print each user - array of numbers
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'user' })} />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 11:
        // this is rating, we should use the type_config?.count prop so we know the total, and then the cardDetails.value for the numeric value user has set
        return (
          <div className="condition-icon">
            <FontAwesomeIcon className="icon" icon={icon({ name: 'star' })} />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 14:
        // manual progress
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'bars-progress' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 9:
        // this is a tasks relationship type_config does not have subcategory_id for any task in Workspace cardDetails.value is an array of task_id strings
        return (
          <div className="condition-icon">
            <img src={ClickUpIcon}></img>
            <>{customField?.name}</>
          </div>
        );
        break;
      case 18:
        // relationship specific list
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon list-relationship"
              icon={icon({ name: 'arrow-right-arrow-left' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
      case 1:
        // dropdown
        return (
          <div className="condition-icon">
            <FontAwesomeIcon
              className="icon"
              icon={icon({ name: 'square-caret-down' })}
            />
            <>{customField?.name}</>
          </div>
        );
        break;
    }
  };

  const getValue = (action) => {
    switch (action.type_id) {
      // 5 is text, ai summary, ai progress update, txt area
      case 5:
      // 15 text area & (ai)
      case 15:
      // 2 short text
      case 2:
      // 7 email
      case 7:
      // 0 number
      case 0:
      // 3 website
      case 3:
      // 8 phone
      case 8:
        // currency
        setValueText(cardDetails.value);
        break;
      // 6 checkbox
      case 6:
        // insert logic to convert boolean to text
        if (valueText) {
          setValueText('checked');
        } else {
          setValueText('unchecked');
        }
        break;
      // 4 date
      case 4:
        // add a function to convert 1713520800000 to a date
        const myUnixTimestamp = fieldValue;
        const myDate = new Date(JSON.parse(myUnixTimestamp)); // converts to milliseconds
        console.log(myDate);
        setValueText(myDate.toDateString());
        break;
      // 16 files
      case 16:
        // add function to loop through attachment URLs and display them
        let attachmentString = '';
        fieldValue.map((item, i) => {
          if (i + 1 === fieldValue.length) {
            // its the last item in the array, and does not need a comma
            let newString = attachmentString.concat(item);
            setValueText(newString);
          } else {
            let newString = attachmentString.concat(item + ', ');
            attachmentString = newString;
          }
        });
        break;
      // 12 label
      case 12:
        // fieldValue is an array of labelIDs, we need to convert them to their txt value
        const labelValueArray = customField?.type_config?.options;
        let labelString = '';
        let labelTxtArray = fieldValue.map((value) => {
          let found = labelValueArray.find((label) => value === label.id);
          return found.label;
        });

        labelTxtArray.map((label, i) => {
          if (i + 1 === labelTxtArray.length) {
            let newString = labelString.concat(label);
            setValueText(newString);
          } else {
            let newString = labelString.concat(label + ', ');
            labelString = newString;
          }
        });
        break;
      // 19 address
      case 19:
        setValueText(cardDetails?.value?.formatted_address);
        break;
      // 10 people 
      case 10:
        // users, we need to loop through userIds and print each user - array of numbers
        let userIdString = '';
        fieldValue.map((item, i) => {
          if (i + 1 === fieldValue.length) {
            // its the last item in the array, and does not need a comma
            let newString = userIdString.concat(item);
            setValueText(newString);
          } else {
            let newString = userIdString.concat(item + ', ');
            userIdString = newString;
          }
        });
        break;
      // 11 rating
      case 11:
        // this is rating, we should use the type_config?.count prop so we know the total, and then the cardDetails.value for the numeric value user has set
        let ratioString = `${fieldValue}/${action?.type_config?.count}`;
        setValueText(ratioString);
        break;
      // 14 manual progress
      case 14:
        // this is an manual progress - total is in type_config?.end prop, and users value is in cardDetails.value.current - its a string
        setValueText({ type: 'manual-progress', value: fieldValue?.current });
        // setValueText(fieldValue?.current)
        break;
      // 18 list relationship
      case 18:
      // relationship specific list - type_config.subcategory_id is the list_id - cardDetails.value is an array of task_ids
      // 9 task relationship
      case 9:
        // this is a tasks relationship type_config does not have subcategory_id for any task in Workspace cardDetails.value is an array of task_id strings
        let taskIdString = '';
        fieldValue.map((item, i) => {
          if (i + 1 === fieldValue.length) {
            // its the last item in the array, and does not need a comma
            let newString = taskIdString.concat(item);
            setValueText(newString);
          } else {
            let newString = taskIdString.concat(item + ', ');
            taskIdString = newString;
          }
        });
        break;
      // 1 dropdown
      case 1:
        // dropdown
        let valueArray = customField?.type_config?.options;
        let result = valueArray?.find((item) => item.id === fieldValue);
        setValueText(result?.name);
        if (result?.color) {
          setValueColor(result?.color)
        }
        break;
    }
  };

  useEffect(() => {
    if (customField !== undefined) {
      // the only way to do this is to switch the field type_id prop
      getValue(customField);
    }
  }, [customField]);

  useEffect(() => {
    getCustomField();
  }, [fieldId]);

  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className="value">
            <FontAwesomeIcon
            className='icon fa-regular'
            icon={icon({name: 'pen-to-square', style: 'regular' })} />
            {`Custom Field`}</Card.Title>
          <span>
            <b className="card-text">CUSTON FIELD</b>
          </span>
          {customField && valueText ? (
            <>
              <Card className="value">{renderIcon(customField)}</Card>
              <Card className="value">{cardDetails.op}</Card>
              <span>
                <b className="card-text">VALUE</b>
              </span>
              {valueText?.type === 'manual-progress' ? (
                <>
                  <ProgressBar
                    variant="success"
                    now={valueText?.value}
                    label={`${valueText?.value}`}
                  />
                </>
              ) : (
                <>
                  <Card className="value" style={{ backgroundColor: valueColor ? `${valueColor}` : 'inherit' }}>{valueText}</Card>
                  <Card className="label">{renderCondition(customField)}</Card>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
export default CustomFieldCard;
