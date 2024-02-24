import { useEffect, useState } from 'react';
import { Button, Breadcrumb, CardBody } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

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

  // variables for the trigger being searched
  const [triggerId, setTriggerId] = useState<string>('');
  const [notFoundList, setNotFoundList] = useState<boolean>(false);
  const [notFoundFolderlessList, setNotFoundFolderlessList] =
    useState<boolean>(false);
  const [notFoundFolder, setNotFoundFolder] = useState<boolean>(false);
  const [notFoundSpace, setNotFoundSpace] = useState<boolean>(false);
  const [findClicked, setFindClicked] = useState<boolean>(false);

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
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      res?.data?.automations.forEach(async (triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts.forEach(async (shortcutObject: any) =>
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
      // console.log('folderlessList automations: ', res.data);

      res?.data?.automations.forEach(async (triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts.forEach(async (shortcutObject: any) =>
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
      res?.data?.automations.forEach(async (triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts.forEach(async (shortcutObject: any) =>
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
      // console.log('space automations: ', res.data);
      res?.data?.automations.forEach(async (triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts.forEach(async (shortcutObject: any) =>
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
    console.log('called Space triggers');
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let spaceAutoTriggers: any[] | undefined = spaceTriggers?.automations;
    let spaceShortcutTriggers: any[] | undefined = spaceTriggers?.shortcuts;
    console.log(spaceTriggers);

    console.log(
      'space auto/short',
      spaceTriggers?.automations.length,
      spaceTriggers?.shortcuts.length
    );
    if (
      foundTrigger === undefined &&
      (spaceAutoTriggers?.length !== 0 || spaceShortcutTriggers?.length !== 0)
    ) {
      console.log('searching Space triggers');
      spaceAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });

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
      if (foundTrigger === undefined) {
        console.log(
          'space triggers exist, but the input trigger isnt one of them'
        );
        setNotFoundSpace(true);
      }
    } else {
      console.log('not found Space search');
      setNotFoundSpace(true);
    }
  };

  const searchFoldersForTrigger = () => {
    console.log('called Folder triggers');

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let folderAutoTriggers: any[] | undefined = folderTriggers?.automations;
    let folderShortcutTriggers: any[] | undefined = folderTriggers?.shortcuts;

    console.log(
      'folder auto/short',
      folderTriggers?.automations.length,
      spaceTriggers?.shortcuts.length
    );
    if (
      foundTrigger === undefined &&
      (folderAutoTriggers?.length !== 0 || folderShortcutTriggers?.length !== 0)
    ) {
      console.log('searching Folder triggers');
      folderAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });

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
      if (foundTrigger === undefined) {
        console.log(
          'folder triggers exist, but the input trigger isnt one of them'
        );
        setNotFoundFolder(true);
      }
    } else {
      console.log('not found Folder search');
      setNotFoundFolder(true);
    }
  };

  const searchFolderlessListsForTrigger = () => {
    console.log('called Folderless list search');

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let folderlessListAutoTriggers: any[] | undefined =
      folderlessListTriggers?.automations;
    let folderlessListShortcutTriggers: any[] | undefined =
      folderlessListTriggers?.shortcuts;
    console.log(
      'folderless auto/short',
      folderlessListTriggers?.automations.length,
      folderlessListTriggers?.shortcuts.length
    );
    if (
      foundTrigger === undefined &&
      (folderlessListAutoTriggers?.length !== 0 ||
        folderlessListShortcutTriggers?.length !== 0)
    ) {
      console.log('searching Folderless list triggers');

      folderlessListAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });

      folderlessListShortcutTriggers?.forEach((trigger: any) => {
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
      if (foundTrigger === undefined) {
        console.log(
          'folderless list triggers exist, but this isnt one of them'
        );
        setNotFoundFolderlessList(true);
      }
    } else {
      console.log('not found Folderless list search');
      setNotFoundFolderlessList(true);
    }
  };

  const searchListsForTrigger = async () => {
    console.log('called List triggers');
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let listAutoTriggers: any[] | undefined = listTriggers?.automations;
    let listShortcutTriggers: any[] | undefined = listTriggers?.shortcuts;

    console.log(
      'list auto/short',
      listTriggers?.automations.length,
      listTriggers?.shortcuts.length
    );
    if (
      foundTrigger === undefined &&
      (listAutoTriggers?.length !== 0 || listShortcutTriggers?.length !== 0)
    ) {
      console.log('searching List triggers');
      listAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });

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
      if (foundTrigger === undefined) {
        console.log('list triggers exist, but this isnt one of them');
        setNotFoundList(true);
      }
    } else {
      console.log('not found list search');
      setNotFoundList(true);
    }
  };

  useEffect(() => {
    console.log(`not found on List: ${notFoundList}`);
  }, [notFoundList]);

  useEffect(() => {
    console.log(token);
  }, [token]);

  useEffect(() => {
    console.log(spaceTriggers?.automations, spaceTriggers?.shortcuts);
  }, [spaceTriggers]);

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
      if (folderlessListIds?.length) {
        getFolderlessListAutomations(folderlessListIds);
      }
      if (listIds?.length) {
        getListAutomations(listIds);
      }
      if (folderIds?.length) {
        getFolderAutomations(folderIds);
      }
      if (spaceIds?.length) {
        getSpaceAutomations(spaceIds);
      }
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
          {foundTrigger ||
          (notFoundList === true &&
            notFoundFolderlessList === true &&
            notFoundFolder === true &&
            notFoundSpace === true) ? (
            <>
              {/*clear button*/}
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
                  setNotFoundList(false);
                  setNotFoundFolderlessList(false);
                  setNotFoundFolder(false);
                  setNotFoundSpace(false);
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
                              (action: any, i: number) => (
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
                  <Spinner animation="border" variant="info" />
                </>
              ) : (
                <>
                  {/*find button*/}
                  <Button
                    className="search-button"
                    onClick={() => {
                      if (listTriggers) {
                        searchListsForTrigger();
                      } else {
                        setNotFoundList(true);
                      }
                      if (folderlessListTriggers) {
                        searchFolderlessListsForTrigger();
                      } else {
                        setNotFoundFolderlessList(true);
                      }
                      if (folderTriggers) {
                        searchFoldersForTrigger();
                      } else {
                        setNotFoundFolder(true);
                      }
                      if (spaceTriggers) {
                        searchSpacesForTrigger();
                      } else {
                        setNotFoundSpace(true);
                      }
                      setFindClicked(true);
                    }}
                  >
                    Find Automation
                  </Button>
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

export default Automations;
