import { useEffect, useState } from 'react';
import { Button, Breadcrumb } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import './style.css';

export default function Automations({ socket, workspaceId, spaceIds, folderIds, folderlessListIds, listIds }) {
 
  const [workspaceID, setWorkspaceID] = useState(workspaceId)

  // sets dynamically by teamId on page load
  const [shard, setShard] = useState('');

  // this is no longer being returned from basic.tsx - token is now returned as undefined
  const [JWT, setJWT] = useState(localStorage.getItem('jwt'));

  // variables for the trigger being searched
  const [includeInactive, setIncludeInactive] = useState(false);
  const [triggerId, setTriggerId] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [findClicked, setFindClicked] = useState(false);

  const [foundTrigger, setFoundTrigger] = useState();
  const [foundLink, setFoundLink] = useState();
  const [locationType, setLocationType] = useState();
  const [locationName, setLocationName] = useState();
  const [parentFolder, setParentFolder] = useState({
    link: '',
    name: '',
  });
  const [parentSpace, setParentSpace] = useState({
    link: '',
    name: '',
  });
  const [shortcut, setShortcut] = useState({
    type: '',
    users: [],
    description: '',
  });

  const [showFindButton, setShowFindButton] = useState(false);

  // token passed from OAUTH - for workflow requests
  const [oAuthToken, setOAuthToken] = useState(JWT);

  const printShardFromteamId = async (id) => {
    if (id.length > 1) {
      const res = await axios.post('http://localhost:8080/automation/shard', {
        teamId: id
      });
      const shard = res.data;
      if(shard) {
        setShard(shard);
        setShowFindButton(true);
      }
    }
  };

  const getAutomation = async () => {
    const triggerInput = document.getElementById("trigger-input").value.trim();
    const res = await axios.post('http://localhost:8080/automation/trigger', {
        shard: shard,
        triggerId: triggerInput,
        bearer: JWT,
      });
    if(res?.data){
      setFoundTrigger(res.data);
      createBreadcrumbs(res.data);
      console.log(res.data)
    }
  }

  const createBreadcrumbs = async (automation) => {
    let location = automation?.parent_type;
    let id = automation?.parent_id
    switch (location) {
      case 6:
        setFoundLink(`https://app.clickup.com/${workspaceId}/v/li/${id}`);
        setLocationType('List: ');
        setLocationName(`${automation?.subcategory?.name}`);
        // check for a parent Folder and Space
        if (automation?.subcategory?.category?.name !== 'hidden') {
          setParentFolder({
            link: `https://app.clickup.com/${workspaceId}/v/o/f/${automation?.subcategory?.category?.id}/${automation?.subcategory?.project?.id}`,
            name: automation?.subcategory?.category?.name,
          });
        }
        setParentSpace({
          link: `https://app.clickup.com/${workspaceId}/v/o/s/${automation?.subcategory?.project?.id}`,
          name: automation?.subcategory?.project?.name,
        });
        break;
      case 5:
        setFoundLink(
          `https://app.clickup.com/${workspaceId}/v/o/f/${id}/${automation?.category?.project?.id}`
        );
        // check for a parent Space
        setLocationType('Folder: ');
        setLocationName(`${automation?.category?.name}`);
        setParentSpace({
          link: `https://app.clickup.com/${workspaceId}/v/o/s/${automation?.category?.project?.id}`,
          name: automation?.category?.project?.name,
        });
        break;
      case 4:
        setFoundLink(`https://app.clickup.com/${workspaceId}/v/o/s/${id}`);
        setLocationType('Space: ');
        setLocationName(`${automation?.project?.name}`);
        break;
    }
  };

  useEffect(() => {
    console.log(`include inactive is: ${includeInactive}`);
  }, [includeInactive]);


  useEffect(() => {
    console.log(`shard is: ${JSON.stringify(shard)}`, typeof shard)
  }, [shard])

  useEffect(() => {
    console.log(JWT);
  }, [JWT]);

  
  useEffect(() => {
    console.log(`triggerID being searched: ${triggerId}`);
  }, [triggerId]);

  // useEffects for what this component has
  useEffect(() => {
    if(workspaceID) {
      printShardFromteamId(workspaceID);
    }
    console.log(`automations.js team_id is: ${workspaceID}`);
  }, [workspaceID]);
  
  return (
    <div className="automations-container">
      <br />
      <h1>Find Automation</h1>
      {shard ? (
        <>
          <input
            className="search-field"
            type="text"
            id="trigger-input"
            placeholder="Search by a triggerId"
          />
          {foundTrigger ||
          (notFound === true) ? (
            <>
              {/*clear button*/}
              <Button
                className="search-button"
                onClick={() => {
                  const trigger = document.getElementById(
                    'trigger-input'
                  );
                  const automation = document.getElementById(
                    'automation'
                  );
                  trigger.value = '';
                  if (automation !== null) {
                    automation.textContent = '';
                  }
                  setLocationName(undefined);
                  setShortcut(undefined);
                  setFoundTrigger(undefined);
                  setFoundLink(undefined);
                  setParentFolder({ link: '', name: '' });
                  setParentSpace({ link: '', name: '' });
                  setNotFound(false);
                  setFindClicked(false);
                }}
              >
                Clear
              </Button>

              {foundTrigger ? (
                <>
                  <div className="modal-container">
                    <table id="modal">
                      <tbody>
                        <tr>
                          {/*location row*/}
                          {shortcut !== undefined ? (
                            <th colSpan={2}>
                              {foundTrigger ? (
                                <Breadcrumb>
                                  {locationType === 'Space: ' ? (
                                    <>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  ) : locationType === 'Folder: ' ? (
                                    <>
                                      <Breadcrumb.Item
                                        href={`${parentSpace?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {parentSpace?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'folder' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  ) : parentFolder?.name ? (
                                    <>
                                      <Breadcrumb.Item
                                        href={`${parentSpace?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {parentSpace?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item
                                        href={`${parentFolder?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'folder' })}
                                        />{' '}
                                        {parentFolder?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'list' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  ) : (
                                    <>
                                      <Breadcrumb.Item
                                        href={`${parentSpace?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {parentSpace?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'list' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  )}
                                </Breadcrumb>
                              ) : (
                                <></>
                              )}
                              Shortcut located in this {locationType}{' '}
                              {locationName}.
                            </th>
                          ) : (
                            <th colSpan={2}>
                              {foundTrigger ? (
                                <Breadcrumb>
                                  {locationType === 'Space: ' ? (
                                    <>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  ) : locationType === 'Folder: ' ? (
                                    <>
                                      <Breadcrumb.Item
                                        href={`${parentSpace?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {parentSpace?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'folder' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  ) : parentFolder?.name ? (
                                    <>
                                      <Breadcrumb.Item
                                        href={`${parentSpace?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {parentSpace?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item
                                        href={`${parentFolder?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'folder' })}
                                        />{' '}
                                        {parentFolder?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'list' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  ) : (
                                    <>
                                      <Breadcrumb.Item
                                        href={`${parentSpace?.link}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'square' })}
                                        />{' '}
                                        {parentSpace?.name}
                                      </Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}>
                                        <FontAwesomeIcon
                                          icon={icon({ name: 'list' })}
                                        />{' '}
                                        {locationName}
                                      </Breadcrumb.Item>
                                    </>
                                  )}
                                </Breadcrumb>
                              ) : (
                                <></>
                              )}
                              Automation located in this {locationType}{' '}
                              {locationName}.
                            </th>
                          )}
                        </tr>
                        <tr>
                          <td style={{ width: '50%' }}>
                            <h4>When</h4>
                            this happens:
                            <Card>
                              <Card.Body>
                                <Card.Title>
                                  {foundTrigger?.trigger.type}
                                </Card.Title>
                              </Card.Body>
                            </Card>
                          </td>
                          <td>
                            <h4>Then</h4>
                            Do this action:
                            {foundTrigger?.actions.map(
                              (action, i) => (
                                <Card key={i}>
                                  <Card.Body>
                                    <Card.Title>{action.type}</Card.Title>
                                  </Card.Body>
                                </Card>
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          {shortcut !== undefined ? (
                            <td colSpan={2}>
                              <Badge pill bg="info">
                                SHORTCUT
                              </Badge>{' '}
                              Always {shortcut.type}
                              {shortcut.users.map((user) => ` ${user}`)}
                              <br />
                              <br />
                              {shortcut.description}
                            </td>
                          ) : (
                            <td colSpan={2}>
                              <span>Automation: {foundTrigger?.sentence}</span>
                              <br />
                              <span>
                                Description: {foundTrigger?.description}
                              </span>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <br />
                  <Badge pill bg="warning" text="dark">
                    Not found.
                  </Badge>
                </>
              )}
            </>
          ) : (
            <>
              {foundTrigger === undefined && findClicked ? (
                <>
                  <br />
                  <span className="spinner-text">
                    loading...
                  </span>
                  <br />
                  <Spinner
                    className="spinner"
                    animation="border"
                    variant="info"
                  />
                </>
              ) : showFindButton ? (
                <>
                  {/*find button*/}
                  <Dropdown as={ButtonGroup} autoClose="outside">
                    <Button
                      variant="primary"
                      onClick={() => {
                        getAutomation()
                      }}
                    >
                      Find Automation
                    </Button>

                    <Dropdown.Toggle
                      split
                      variant="info"
                      id="dropdown-autoclose-outside"
                    />

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">
                        View Inactive triggers
                        <br />
                        <label className="switch">
                          <input type="checkbox" />
                          <span
                            onClick={() => {
                              if (includeInactive) {
                                setIncludeInactive(false);
                              } else {
                                setIncludeInactive(true);
                              }
                            }}
                            className="slider round"
                          ></span>
                        </label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <><br /><br />
                  <span className="spinner-text">Collecting automation details...</span>
                  <br /><br />
                  <Spinner
                    className="auto-spinner"
                    animation="border"
                    variant="info"
                  />
                </>
              )}
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

