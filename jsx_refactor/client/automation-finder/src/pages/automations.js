import { useEffect, useState } from 'react';
import { Button, Breadcrumb } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Trigger from '../components/AutoTrigger';
import Actions from '../components/AutoAction';
import Conditions from '../components/AutoCondition';
import axios from 'axios';
import './style.css';

export default function Automations({ socket, workspaceId }) {

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
  const [conditions, setConditions] = useState();
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

  const printShardFromteamId = async (id) => {
    if (id.length > 1) {
      const res = await axios.post('http://localhost:8080/automation/shard', {
        teamId: id
      });
      const shard = res.data;
      if (shard) {
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
    if (res?.data?.shortcut) {
      console.log(res?.data?.shortcut)
      setFoundTrigger(true);
      setShortcut({
        type: res?.data?.shortcut,
        users: [],
        description: res?.data?.sentence
      })
      createBreadcrumbs(res.data);
    } else if (res?.data) {
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
    console.log(conditions)
  }, [conditions])

  useEffect(() => {
    if(foundTrigger?.trigger?.conditions) {
      setConditions(foundTrigger?.trigger?.conditions)
    }
  }, [foundTrigger]);

  useEffect(() => {
    // console.log(`include inactive is: ${includeInactive}`);
  }, [includeInactive]);

  // useEffects for what this component has
  useEffect(() => {
    if (workspaceID) {
      printShardFromteamId(workspaceID);
    }
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
                  setShortcut({
                    type: '',
                    users: [],
                    description: '',
                  });
                  setFoundTrigger(undefined);
                  setFoundLink(undefined);
                  setParentFolder({ link: '', name: '' });
                  setParentSpace({ link: '', name: '' });
                  setNotFound(false);
                  setFindClicked(false);
                  setConditions();
                }}
              >
                Clear
              </Button>

              {foundTrigger ? (
                <>
                  <div className="modal-container">
                    <table id="modal">
                      <tbody>
                        {/*location row*/}
                        <tr>
                          {shortcut?.type !== "" ? (
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
                              Automation located in this {locationType}{' '}
                              {locationName}.
                            </th>
                          )}
                        </tr>

                        {shortcut?.type !== "" ? (
                          <></>
                        ) : (
                          <tr className="modal-body">
                            <td className="modal-body-column">
                              <Trigger automationObject={foundTrigger} />
                            {conditions ? (<Conditions conditionArray={conditions} shard={shard} />) : (<></>)}
                            </td>
                            <td className="modal-body-column">
                              <Actions automationObject={foundTrigger} />
                            </td>
                          </tr>
                        )}

                        <tr>
                          {shortcut?.type !== "" ? (
                            <td colSpan={2}>
                              <Badge pill bg="info">
                                SHORTCUT
                              </Badge>{' '}
                              Always {shortcut?.type}
                              {shortcut?.users?.map((user) => ` ${user}`)}
                              <br />
                              <br />
                              {shortcut?.description}
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

