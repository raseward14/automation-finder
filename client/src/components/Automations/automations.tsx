import { useEffect, useState } from 'react';
import { Button, Breadcrumb, CardBody } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// import Nav from "../Nav";

import axios from 'axios';
import './style.css';

type AutomationPropList = {
  teamId: string;
  spaceIds: string[];
  folderIds: string[];
  listIds: string[];
  folderlessListIds: string[];
  token: string;
};

const Automations = (props: AutomationPropList) => {
  // sets dynamically by workspaceID on page load
  const [shard, setShard] = useState<string>('');

  // this is no longer being returned from basic.tsx - token is now returned as undefined
  const yourToken = localStorage.getItem('token');
  const [token, setToken] = useState<any>(yourToken);
  // we could also retrieve the token via prop passing
  // const [token, setToken] = useState<any>(props.token)

  // hard coded token, copy paste from ?workflow network request - working
  // const [token, setToken] = useState<any>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNiVkFxWkNGdVJBPSJ9.eyJ1c2VyIjoxNDkxNzI4NywidmFsaWRhdGVkIjp0cnVlLCJ3c19rZXkiOiI4MDAxMTg2MTg0Iiwic2Vzc2lvbl90b2tlbiI6dHJ1ZSwiaWF0IjoxNzA3MzUxNzA0LCJleHAiOjE3MDc1MjQ1MDR9._-SkWnDVyVcYg_VgUC_50Cxa9B-Cus4x6gXUJU0Z3GA');

  // taken from a login link - not working
  // const [token, setToken] = useState<any>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlNNeFNOYkYvU1lNPSJ9.eyJpZCI6IjE0OTE3Mjg3IiwibG9naW5Ub2tlbiI6dHJ1ZSwiYWRtaW4iOnRydWUsImJ5cGFzcyI6dHJ1ZSwiaWF0IjoxNzA3NDM5MjY3LCJleHAiOjE3MDc2OTg0Njd9.IHsnjqSn4-Ay34GAbn6j4TeTknyPy-njSj-eq6SV_OU')
  // variables for the trigger being searched
  const [triggerId, setTriggerId] = useState<string>('');
  const [foundTrigger, setFoundTrigger] = useState<any>();
  const [foundLink, setFoundLink] = useState<any>();
  const [locationType, setLocationType] = useState<string>();
  const [locationName, setLocationName] = useState<string>();
  const [parentFolder, setParentFolder] = useState<{
    link: string;
    name: string;
  }>();
  const [parentSpace, setParentSpace] = useState<{
    link: string;
    name: string;
  }>();
  const [shortcut, setShortcut] = useState<{
    type: string;
    users: string[];
    description: string;
  }>();

  // will be passed from workspace.tsx - IN PROGRESS
  const [workspaceId, setWorkspaceId] = useState<string>(props.teamId);
  // location ids
  const [spaceIds, setSpaceIds] = useState<string[]>(props.spaceIds);
  const [folderIds, setFolderIds] = useState<string[]>(props.folderIds);
  const [listIds, setListIds] = useState<string[]>(props.listIds);
  const [folderlessListIds, setFolderlessListIds] = useState<string[]>(
    props.folderlessListIds
  );
  // token passed from OAUTH - for workflow requests
  const [oAuthToken, setOAuthToken] = useState<string>(props.token);

  // for us to manually hard code in locationIds
  // const [workspaceId, setWorkspaceId] = useState<string>('18016766');
  // const [spaceIds, setSpaceIds] = useState<string[]>(['30041784', '90170727133']);
  // const [folderIds, setFolderIds] = useState<string[]>(['90170955336']);
  // const [listIds, setListIds] = useState<string[]>(['901701539190', '901701699023', '901701699026']);
  // const [folderlessListIds, setFolderlessListIds] = useState<string[]>(['138161873']);
  // same value, hard coded in in case we bypass OAUTH, and auth public api requests in some other way
  // const [oAuthToken, setOAuthToken] = useState<string>(
  //     '14917287_c9ca7ed4005e10458372ffb5fea33f476c79aaf5260c30b0af339d89028d698d'
  // );

  // this is in progress based on resolving the above
  // const [workspaceUsers, setWorkspaceUsers] = useState<[{id: number; email: string}]>

  // location trigger_ids
  const [listTriggers, setListTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();
  const [folderlessListTriggers, setFolderlessListTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();
  const [folderTriggers, setFolderTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();
  const [spaceTriggers, setSpaceTriggers] = useState<{
    automations: any[];
    shortcuts: any[];
  }>();

  const printShardFromWorkspaceId = async () => {
    if (workspaceId.length > 1) {
      const res = await axios.post('http://localhost:3001/automation/shard', {
        teamId: workspaceId,
      });
      const shard = res.data;
      setShard(shard);
    }
  };

  const getListAutomations = (listIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];

    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      console.log('get list auto call:', id, shard, token);
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      res.data.automations.forEach(async (triggerObject: any) =>
        allAutoTriggers.push(triggerObject)
      );
      res.data.shortcuts.forEach(async (shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      // console.log(`List workflow request:`, res.data);
    });
    setListTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getFolderlessListAutomations = (listIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];
    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      console.log(shard, id, token);
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      res.data.automations.forEach(async (triggerObject: any) =>
        allAutoTriggers.push(triggerObject)
      );
      res.data.shortcuts.forEach(async (shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      // console.log(`folderless list workflow request:`, res.data);
    });
    setFolderlessListTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getFolderAutomations = (folderIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];
    folderIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/folder', {
        shard: shard,
        folderId: id,
        bearer: token,
      });
      res.data.automations.forEach(async (triggerObject: any) =>
        allAutoTriggers.push(triggerObject)
      );
      res.data.shortcuts.forEach(async (shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      // console.log(`folder ${id} workflow request`, res.data);
    });
    setFolderTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getSpaceAutomations = async (spaceIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];
    await spaceIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/space', {
        shard: shard,
        spaceId: id,
        bearer: token,
      });
      console.log('space automations: ', res.data);
      res.data.automations.forEach(async (triggerObject: any) =>
        allAutoTriggers.push(triggerObject)
      );
      res.data.shortcuts.forEach(async (shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
    });
    setSpaceTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getLocation = async (trigger: any) => {
    console.log('made it here');

    let location = trigger.parent_type;
    let id = trigger.parent_id;
    console.log(trigger, location);
    switch (location) {
      case 6:
        const listResponse = await axios.post(
          `http://localhost:3001/workspace/list`,
          {
            listId: id,
            token: oAuthToken,
          }
        );
        let listId = listResponse.data.id;
        setFoundLink(`https://app.clickup.com/${workspaceId}/v/li/${listId}`);
        let listName = listResponse.data.name;
        setLocationType('List: ');
        setLocationName(`${listName}`);
        // check for a parent Folder and Space
        if (listResponse.data?.folder.name !== 'hidden') {
          setParentFolder({
            link: `https://app.clickup.com/${workspaceId}/v/o/f/${listResponse.data?.folder.id}/${listResponse.data?.space.id}`,
            name: listResponse.data?.folder.name,
          });
        }
        setParentSpace({
          link: `https://app.clickup.com/${workspaceId}/v/o/s/${listResponse.data?.space.id}`,
          name: listResponse.data?.space.name,
        });
        break;
      case 5:
        const folderResponse = await axios.post(
          `http://localhost:3001/workspace/folder`,
          {
            folderId: id,
            token: oAuthToken,
          }
        );
        let folderId = folderResponse.data.id;
        let folderSpaceId = folderResponse.data.space.id;
        setFoundLink(
          `https://app.clickup.com/${workspaceId}/v/o/f/${folderId}/${folderSpaceId}`
        );
        let folderName = folderResponse.data.name;
        // check for a parent Space
        setLocationType('Folder: ');
        setLocationName(`${folderName}`);
        setParentSpace({
          link: `https://app.clickup.com/${workspaceId}/v/o/s/${folderResponse.data?.space.id}`,
          name: folderResponse.data?.space.name,
        });
        break;
      case 4:
        const spaceResponse = await axios.post(
          `http://localhost:3001/workspace/space`,
          {
            spaceId: id,
            token: oAuthToken,
          }
        );
        let spaceId = spaceResponse.data.id;
        setFoundLink(`https://app.clickup.com/${workspaceId}/v/o/s/${spaceId}`);
        let spaceName = spaceResponse.data.name;
        setLocationType('Space: ');
        setLocationName(`${spaceName}`);
        break;
    }
  };

  const searchSpacesForTrigger = () => {
    console.log('searching Spaces');
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let spaceAutoTriggers = spaceTriggers?.automations;
    let spaceShortcutTriggers = spaceTriggers?.shortcuts;
    console.log(spaceTriggers);
    if (foundTrigger === undefined) {
      spaceAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      spaceShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          let shortType = '';
          let shortUsers = [];
          let shortDescription = trigger.description;
          console.log(trigger.description);
          if (trigger.shortcut === 'assignee') {
            shortType = 'assign tasks to ';
            shortUsers = trigger.actions[0].input.add_assignees;
          } else {
            shortType = 'watch tasks ';
            shortUsers = trigger.actions[0].input.followers;
          }
          setShortcut({
            type: shortType,
            users: shortUsers,
            description: shortDescription,
          });
        }
      });
    }
  };

  const searchFoldersForTrigger = () => {
    console.log('searching Folders');

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let folderAutoTriggers = folderTriggers?.automations;
    let folderShortcutTriggers = folderTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      folderAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      folderShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          let shortType = '';
          let shortUsers = [];
          let shortDescription = trigger.description;
          if (trigger.shortcut === 'assignee') {
            shortType = 'assign tasks to ';
            shortUsers = trigger.actions[0].input.add_assignees;
          } else {
            shortType = 'watch tasks ';
            shortUsers = trigger.actions[0].input.followers;
          }
          setShortcut({
            type: shortType,
            users: shortUsers,
            description: shortDescription,
          });
        }
      });
    }
    searchSpacesForTrigger();
  };

  const searchFolderlessListsForTrigger = () => {
    console.log('searching Folderless lists');

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let folderlessListAutoTriggers = folderlessListTriggers?.automations;
    let folderlessShortcutTriggers = folderlessListTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      folderlessListAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      folderlessShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          let shortType = '';
          let shortUsers = [];
          let shortDescription = trigger.description;
          if (trigger.shortcut === 'assignee') {
            shortType = 'assign tasks to ';
            shortUsers = trigger.actions[0].input.add_assignees;
          } else {
            shortType = 'watch tasks ';
            shortUsers = trigger.actions[0].input.followers;
          }
          setShortcut({
            type: shortType,
            users: shortUsers,
            description: shortDescription,
          });
        }
      });
    }
    searchFoldersForTrigger();
  };

  const searchListsForTrigger = async () => {
    console.log('searching Lists');
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let listAutoTriggers = listTriggers?.automations;
    let listShortcutTriggers = listTriggers?.shortcuts;
    console.log(listTriggers);
    if (foundTrigger === undefined) {
      listAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      listShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          let shortType = '';
          let shortUsers = [];
          let shortDescription = trigger.description;
          if (trigger.shortcut === 'assignee') {
            shortType = 'assign tasks to ';
            shortUsers = trigger.actions[0].input.add_assignees;
          } else {
            shortType = 'watch tasks ';
            shortUsers = trigger.actions[0].input.followers;
          }
          setShortcut({
            type: shortType,
            users: shortUsers,
            description: shortDescription,
          });
        }
      });
    }
    searchFolderlessListsForTrigger();
  };

  useEffect(() => {
    console.log(token);
  }, [token]);

  useEffect(() => {
    console.log(spaceTriggers?.automations, spaceTriggers?.shortcuts);
  }, [spaceTriggers]);

  useEffect(() => {
    console.log(foundTrigger);
    if (foundTrigger !== undefined) {
      console.log('we found it!', foundTrigger);
      const printDescription = document.getElementById(
        'automation'
      ) as HTMLOutputElement;

      // printTrigger.textContent = foundTrigger.trigger.type;
      if (printDescription !== null) {
        printDescription.textContent = foundTrigger.sentence;
      }
    }
  }, [foundTrigger]);

  // useEffects for what this component has
  useEffect(() => {
    printShardFromWorkspaceId();
    console.log(`workspaceID being searched: ${workspaceId}`);
  }, [workspaceId]);

  useEffect(() => {
    // console.log(`workspace shard: ${shard}`);
    // console.log(`workspace token: ${token}`);
    if (shard.length > 1) {
      // when we have a bearer, we can call get automations functions on page load from here
      // console.log('on page load, token is:', token);
      // console.log('spaceIds:', spaceIds);
      // console.log('folderIds:', folderIds);
      // console.log('listIds:', listIds);
      // console.log('folderlessListIds:', folderlessListIds);

      getFolderlessListAutomations(folderlessListIds);
      getListAutomations(listIds);
      getFolderAutomations(folderIds);
      getSpaceAutomations(spaceIds);
    }
  }, [shard]);
  useEffect(() => {
    console.log(`triggerID being searched: ${triggerId}`);
  }, [triggerId]);

  return (
    <div className="automations-container">
      <br />
      <h1>Find Automation</h1>
      {token ? (
        <>
          <input
            className="search-field"
            type="text"
            id="trigger-input"
            placeholder="Search by a triggerId"
          />
          {foundTrigger ? (
            <>
              {/*find button*/}
              <Button
                className="search-button"
                onClick={() => {
                  const trigger = document.getElementById(
                    'trigger-input'
                  ) as HTMLInputElement;
                  const automation = document.getElementById(
                    'automation'
                  ) as HTMLInputElement;
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
                }}
              >
                Clear
              </Button>
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
                          Shortcut located in this {locationType} {locationName}
                          .
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
                      <td style={{"width": "50%"}}>
                        <h4>When</h4> 
                        this happens:
                        <Card>
                          <Card.Body>
                            <Card.Title>{foundTrigger.trigger.type}</Card.Title>
                          </Card.Body>
                        </Card>
                      </td>
                      {foundTrigger.actions.map((action: any) => (
                        <td>
                          <h4>Then</h4>
                          Do this action:
                          <Card>
                            <Card.Body>
                              <Card.Title>{action.type}</Card.Title>
                            </Card.Body>
                          </Card>
                        </td>
                      ))}
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
                          Your Automation description is:
                          <output id="automation"></output>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              {' '}
              {/*clear button*/}
              <Button
                className="search-button"
                onClick={() => {
                  searchListsForTrigger();
                }}
              >
                Find Automation
              </Button>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Automations;
