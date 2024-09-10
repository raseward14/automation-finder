import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ClickUpIcon from '../images/cu-white.png';
import './style.css';

const CustomFieldCard = ({ cardDetails, key }) => {
  const [fieldId, setFieldId] = useState(cardDetails.name.slice(3));
  const [fieldValue, setFieldValue] = useState(cardDetails.value);
  const [valueText, setValueText] = useState();
  const [customField, setCustomField] = useState();
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

  const getCustomField = async (id) => {
    const res = await axios.post(
      'http://localhost:8080/automation/customField',
      {
        shard: cardDetails.shard,
        fieldId: fieldId,
        bearer: JWT,
      }
    );
    if (res?.data) {
      setCustomField(res.data);
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
      // text area & (ai)
      case 15:
      // short text
      case 2:
      // email
      case 7:
      // number
      case 0:
      // website
      case 3:
      // phone
      case 8:
        // currency
        setValueText(cardDetails.value);
        break;
      case 6:
        // checkbox
        // insert logic to convert boolean to text
        if (valueText) {
          setValueText('checked');
        } else {
          setValueText('unchecked');
        }
        break;
      case 4:
        // add a function to convert 1713520800000 to a date
        const myUnixTimestamp = fieldValue;
        const myDate = new Date(JSON.parse(myUnixTimestamp)); // converts to milliseconds
        console.log(myDate);
        setValueText(myDate.toDateString());
        break;
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
      case 19:
        setValueText(cardDetails?.value?.formatted_address);
        break;
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
      case 11:
        // this is rating, we should use the type_config?.count prop so we know the total, and then the cardDetails.value for the numeric value user has set
        let ratioString = `${fieldValue}/${action?.type_config?.count}`;
        setValueText(ratioString);
        break;
      case 14:
        // this is an manual progress - total is in type_config?.end prop, and users value is in cardDetails.value.current - its a string
        setValueText({ type: 'manual-progress', value: fieldValue?.current });
        // setValueText(fieldValue?.current)
        break;
      case 18:
      // relationship specific list - type_config.subcategory_id is the list_id - cardDetails.value is an array of task_ids
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
      case 1:
        // dropdown
        let valueArray = customField?.type_config?.options;
        let result = valueArray?.find((item) => item.id === fieldValue);
        setValueText(result?.name);
        break;
    }
  };

  useEffect(() => {
    if (customField !== undefined) {
      // the only way to do this is to switch the field type_id prop
      // will need to call function from here
      // function can perform this find method
      getValue(customField);
    }
  }, [customField]);

  useEffect(() => {
    getCustomField(fieldId);
  }, [fieldId]);

  return (
    <>
      <Card className="condition-card" key={key}>
        <Card.Body>
          <Card.Title className="value">{`Custom Field`}</Card.Title>
          <Card className="value">{cardDetails.op}</Card>
          <span>
            <b className="card-text">FIELD</b>
          </span>
          {customField && valueText ? (
            <>
              <Card className="value">{renderIcon(customField)}</Card>
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
                  <Card className="value">{valueText}</Card>
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
