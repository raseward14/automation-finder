import { useEffect, useState } from 'react';
import { Button, Breadcrumb, CardBody } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Trigger from '../components/Auto-Trigger';
import Actions from '../components/Auto-Actions';


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
  const yourToken = localStorage.getItem('jwt');
  const [token, setToken] = useState<any>(yourToken);

  // variables for the trigger being searched
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);
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
  const [spacePending, setSpacePending] = useState<boolean>(true);
  const [folderPending, setFolderPending] = useState<boolean>(true);
  const [folderlessListPending, setFolderlessListPending] =
    useState<boolean>(true);
  const [listPending, setListPending] = useState<boolean>(true);
  const [showFindButton, setShowFindButton] = useState<boolean>(false);

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

    listIDs.forEach(async (id, i) => {
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      res?.data?.automations?.forEach((triggerObject: any) => {
        // at this point, we would have already not included inactive triggers
        // we need to retrieve
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
        // push the trigger if includeInactive is toggled on, otherwise check its active before pushing
        // if(includeInactive) {
        //   allAutoTriggers.push(triggerObject);
        // } else if (triggerObject.active !== false) {
        //   allAutoTriggers.push(triggerObject);
        // }
      });
      res?.data?.shortcuts?.forEach((shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      if (i + 1 === listIDs.length) {
        setListPending(false);
      }
    });
    setListTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getFolderlessListAutomations = (listIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];

    listIDs.forEach(async (id, i) => {
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      res?.data?.automations?.forEach((triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts?.forEach((shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      if (i + 1 === listIDs.length) {
        setFolderlessListPending(false);
      }
    });
    setFolderlessListTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getFolderAutomations = (folderIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];
    folderIDs.forEach(async (id, i) => {
      const res = await axios.post('http://localhost:3001/automation/folder', {
        shard: shard,
        folderId: id,
        bearer: token,
      });
      res?.data?.automations?.forEach(async (triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts?.forEach(async (shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      if (i + 1 === folderIDs.length) {
        setFolderPending(false);
      }
    });
    setFolderTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getSpaceAutomations = async (spaceIDs: string[]) => {
    let allAutoTriggers: any = [];
    let allShortTriggers: any = [];
    await spaceIDs.forEach(async (id, i) => {
      const res = await axios.post('http://localhost:3001/automation/space', {
        shard: shard,
        spaceId: id,
        bearer: token,
      });
      res?.data?.automations?.forEach((triggerObject: any) => {
        // we only want to search active triggers
        if (triggerObject.active !== false) {
          allAutoTriggers.push(triggerObject);
        }
      });
      res?.data?.shortcuts?.forEach((shortcutObject: any) =>
        allShortTriggers.push(shortcutObject)
      );
      if (i + 1 === spaceIDs.length) {
        setSpacePending(false);
      }
    });
    setSpaceTriggers({
      automations: allAutoTriggers,
      shortcuts: allShortTriggers,
    });
  };

  const getLocation = async (trigger: any) => {
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
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value.trim();

    let spaceAutoTriggers: any[] | undefined = spaceTriggers?.automations;
    let spaceShortcutTriggers: any[] | undefined = spaceTriggers?.shortcuts;
    console.log(spaceTriggers);

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
    const triggerInput = trigger.value.trim();

    let folderAutoTriggers: any[] | undefined = folderTriggers?.automations;
    let folderShortcutTriggers: any[] | undefined = folderTriggers?.shortcuts;

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
    const triggerInput = trigger.value.trim();

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
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value.trim();

    let listAutoTriggers: any[] | undefined = listTriggers?.automations;
    let listShortcutTriggers: any[] | undefined = listTriggers?.shortcuts;
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
    console.log(`include inactive is: ${includeInactive}`);
  }, [includeInactive]);

  useEffect(() => {
    console.log(`not found on List: ${notFoundList}`);
  }, [notFoundList]);

  useEffect(() => {
    console.log(token);
  }, [token]);

  useEffect(() => {
    console.log(spaceTriggers?.automations, spaceTriggers?.shortcuts);
  }, [spaceTriggers]);

  useEffect(() => {
    console.log(`pending spaces: ${spacePending}`);
    console.log(`pending folders: ${folderPending}`);
    console.log(`pending folderlessLists: ${folderlessListPending}`);
    console.log(`pending lists: ${listPending}`);

    if (
      !spacePending &&
      !folderPending &&
      !folderlessListPending &&
      !listPending
    ) {
      setShowFindButton(true);
    }
  }, [spacePending, folderPending, folderlessListPending, listPending]);

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
        console.log('folderlessLists being searched', folderlessListIds.length);
        getFolderlessListAutomations(folderlessListIds);
      } else {
        setFolderlessListPending(false);
      }
      if (listIds?.length) {
        console.log('lists being searched', listIds.length);
        getListAutomations(listIds);
      } else {
        setListPending(false);
      }
      if (folderIds?.length) {
        console.log('folders being searched', folderIds.length);
        getFolderAutomations(folderIds);
      } else {
        setFolderPending(false);
      }
      if (spaceIds?.length) {
        console.log('spaces being searched', spaceIds.length);
        getSpaceAutomations(spaceIds);
      } else {
        setSpacePending(false);
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
                            <Trigger triggerObject={foundTrigger} />
                          </td>
                          <td>
                            <Actions triggerObject={foundTrigger}/>
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
      {/* {foundTrigger ? 
      <Trigger triggerObject={foundTrigger} />
      : 
      <></>
      } */}
    </div>
  );
};

export default Automations;
