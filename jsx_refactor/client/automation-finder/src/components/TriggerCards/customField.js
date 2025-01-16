import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ClickUpIcon from '../images/cu-white.png';
import Card from 'react-bootstrap/Card';
import "./style.css";

// 8651cc40-e1e0-43a6-81f9-233398e11dc6 - all
// 268ac10f-187c-4eab-9960-b7d012711457 - building
// d4cdc1cd-6fba-49d6-89f9-d79abfbab812 - single condition work

// Custom Field changes
const CustomFieldCard = ({ triggerName, cardDetails, shard, teamId }) => {
    // all have from and to except
    // signature
    // checkbox
    // voting
    // files does not have a border

    // the fieldId need to trim off cf_ for the api call
    const [fieldId, setFieldId] = useState((cardDetails?.trigger?.type).slice(3))
    // the field
    const [customField, setCustomField] = useState();


    // token
    const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

    const renderIcon = (field) => {
        console.log(field)
        if (field !== undefined) {
            switch (field.type_id) {
                // 5 is text, ai summary, ai progress update, txt area
                case 5:
                    // text area & (ai)
                    if (field?.type_config?.ai) {
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
                    };
                case 15:
                    // short text
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon className="icon" icon={icon({ name: 't' })} />
                            <>{customField?.name}</>
                        </div>
                    );
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
                case 0:
                    // website
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon className="icon" icon={icon({ name: 'globe' })} />
                            <>{customField?.name}</>
                        </div>
                    );
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
                case 12:
                    //  Label Custom Field
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon className="icon" icon={icon({ name: 'tag' })} />
                            <>{customField?.name}</>
                        </div>
                    );
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
                case 10:
                    // users, we need to loop through userIds and print each user - array of numbers
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon className="icon" icon={icon({ name: 'user' })} />
                            <>{customField?.name}</>
                        </div>
                    );
                case 11:
                    // this is rating, we should use the type_config?.count prop so we know the total, and then the cardDetails.value for the numeric value user has set
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon className="icon" icon={icon({ name: 'star' })} />
                            <>{customField?.name}</>
                        </div>
                    );
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
                case 9:
                    // this is a tasks relationship type_config does not have subcategory_id for any task in Workspace cardDetails.value is an array of task_id strings
                    return (
                        <div className="condition-icon">
                            <img src={ClickUpIcon}></img>
                            <>{customField?.name}</>
                        </div>
                    );
                case 17:
                    // formula Custom Field
                    return (
                        <div className='condition-icon'>
                            <FontAwesomeIcon
                                className='icon'
                                icon={icon({ name: 'florin-sign' })} />
                            <>{customField?.name}</>
                        </div>
                    );
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
                case 21:
                    // voting
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon
                                className="icon"
                                icon={icon({ name: 'chart-column' })}
                            />
                            <>{customField?.name}</>
                        </div>
                    );
                case 22:
                    // signature
                    return (
                        <div className="condition-icon">
                            <FontAwesomeIcon
                                className="icon"
                                icon={icon({ name: 'pen-fancy' })}
                            />
                            <>{customField?.name}</>
                        </div>
                    );
                default:
                    console.log('icon case needed for', field.type_id, field)
            };
        };
    };


    const getCustomField = async () => {
        console.log('getCustomField')
        const res = await axios.post(
            'http://localhost:8080/automation/customField',
            {
                shard: shard,
                fieldId: fieldId,
                bearer: JWT,
            }
        );
        if (res?.data) {
            console.log('Custom Field is', res.data);
            setCustomField(res.data);
        }
    };

    useEffect(() => {
        getCustomField()
    }, [fieldId])

    useEffect(() => {
        console.log('card details: ', cardDetails)
        console.log('the field id is: ', cardDetails?.trigger?.type)
        console.log('before value is: ', cardDetails?.trigger?.conditions[0]?.before[0])
        console.log('after value is: ', cardDetails?.trigger?.conditions[1]?.after[0])
        console.log('trigger shard', shard)
        console.log('trigger team id', teamId)
    }, [])
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className="value">
                        <FontAwesomeIcon
                            className='icon fa-regular'
                            icon={icon({ name: 'pen-to-square', style: 'regular' })} />
                        {triggerName}</Card.Title>
                        <span>
            <b className="card-text">Field</b>
          </span>
                    {customField ? (
                        <>
                            <Card className="value label-container">{renderIcon(customField)}</Card>

                        </>
                    ) : (
                        <></>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}
export default CustomFieldCard;