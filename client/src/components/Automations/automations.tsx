import { useEffect, useState } from 'react';
import { Button, Breadcrumb } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

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
  const yourToken = localStorage.getItem('token');
  // this token could be passed as a prop
  // const [token, setToken] = useState<any>(props.token)
  const [token, setToken] = useState<any>(yourToken);

  // variables for the trigger being searched
  const [triggerId, setTriggerId] = useState<string>('');
  const [foundTrigger, setFoundTrigger] = useState<any>();
  const [foundLink, setFoundLink] = useState<any>();
  const [locationType, setLocationType] = useState<string>();
  const [locationName, setLocationName] = useState<string>();
  const [parentFolder, setParentFolder] = useState<{ link: string; name: string }>();
  const [parentSpace, setParentSpace] = useState<{ link: string; name: string }>();
  const [shortcut, setShortcut] = useState<{
    type: string;
    users: string[];
    description: string;
  }>();

  // will be passed from workspace.tsx - IN PROGRESS
  // const [workspaceId, setWorkspaceId] = useState<string>(props.teamId || '18016766');
  // location ids
  // const [spaceIds, setSpaceIds] = useState<string[]>(props.spaceIds || ['30041784']);
  // const [folderIds, setFolderIds] = useState<string[]>(props.folderIds || ['90170955336']);
  // const [listIds, setListIds] = useState<string[]>(props.listIds || ['901701539190']);
  // const [folderlessListIds, setFolderlessListIds] = useState<string[]>(props.folderlessListIds || ['138161873']);
  // const [workspaceUsers, setWorkspaceUsers] = useState<[{id: number; email: string}]>

  const [workspaceId, setWorkspaceId] = useState<string>('18016766');
  const [spaceIds, setSpaceIds] = useState<string[]>(['30041784']);
  const [folderIds, setFolderIds] = useState<string[]>(['90170955336']);
  const [listIds, setListIds] = useState<string[]>(['901701539190']);
  const [folderlessListIds, setFolderlessListIds] = useState<string[]>([
    '138161873',
  ]);
  const [oAuthToken, setOAuthToken] = useState<string>(
    '14917287_c9ca7ed4005e10458372ffb5fea33f476c79aaf5260c30b0af339d89028d698d'
  );

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
    automations: [];
    shortcuts: [];
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
    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      console.log('get list auto call:', id, shard, token);
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      setListTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`List workflow request:`, res.data);
    });
  };

  const getFolderlessListAutomations = (listIDs: string[]) => {
    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      setFolderlessListTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`folderless list workflow request:`, res.data);
    });
  };

  const getFolderAutomations = (folderIDs: string[]) => {
    folderIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/folder', {
        shard: shard,
        folderId: id,
        bearer: token,
      });
      setFolderTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`folder ${id} workflow request`, res.data);
    });
  };

  const getSpaceAutomations = (spaceIDs: string[]) => {
    spaceIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/space', {
        shard: shard,
        spaceId: id,
        bearer: token,
      });
      setSpaceTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`space ${id} workflow request:`, res.data);
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
        setLocationType("List: ");
        setLocationName(`${listName}`);
        // check for a parent Folder and Space
        if (listResponse.data?.folder.name !== "hidden") {
          setParentFolder({
            link: `https://app.clickup.com/${workspaceId}/v/o/f/${listResponse.data?.folder.id}/${listResponse.data?.space.id}`,
            name: listResponse.data?.folder.name
          })
        }
        setParentSpace({
          link: `https://app.clickup.com/${workspaceId}/v/o/s/${listResponse.data?.space.id}`,
          name: listResponse.data?.space.name
        })
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
        setLocationType("Folder: ");
        setLocationName(`${folderName}`)
        setParentSpace({
          link: `https://app.clickup.com/${workspaceId}/v/o/s/${folderResponse.data?.space.id}`,
          name: folderResponse.data?.space.name
        })
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
        setLocationType("Space: ")
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
    console.log('searching lists');

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;

    let listAutoTriggers = listTriggers?.automations;
    let listShortcutTriggers = listTriggers?.shortcuts;
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
    console.log('parent Space: ', parentSpace?.link)
  }, [parentSpace])

  useEffect(() => {
    console.log('parent Folder: ', parentFolder?.link)
  }, [parentFolder])

  useEffect(() => {
    console.log(foundTrigger);
    if (foundTrigger !== undefined) {
      console.log('we found it!', foundTrigger);
      const printTrigger = document.getElementById(
        'trigger-output'
      ) as HTMLOutputElement;
      const printDescription = document.getElementById(
        'automation'
      ) as HTMLOutputElement;

      printTrigger.textContent = foundTrigger.trigger.type;
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
                  const output = document.getElementById(
                    'trigger-output'
                  ) as HTMLInputElement;
                  const automation = document.getElementById(
                    'automation'
                  ) as HTMLInputElement;
                  trigger.value = '';
                  output.textContent = '';
                  if (automation !== null) {
                    automation.textContent = '';
                  }
                  setLocationName(undefined);
                  setShortcut(undefined);
                  setFoundTrigger(undefined);
                  setFoundLink(undefined);
                  setParentFolder({link: '', name: ''})
                  setParentSpace({link: '', name: ''})
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
                        <th>
                          {foundTrigger ? (
                            <Breadcrumb>
                              {locationType === "Space: " ?
                                <>
                                  <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "square" })} /> {locationName}</Breadcrumb.Item>
                                </> : (locationType === "Folder: " ?
                                  <>
                                    <Breadcrumb.Item href={`${parentSpace?.link}`}><FontAwesomeIcon icon={icon({ name: "square" })} /> {parentSpace ? parentSpace.name : "NA"}</Breadcrumb.Item>
                                    <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "folder" })} /> {locationName}</Breadcrumb.Item>
                                  </> : (parentFolder?.name ?
                                    <>
                                      <Breadcrumb.Item href={`${parentSpace?.link}`}><FontAwesomeIcon icon={icon({ name: "square" })} /> {parentSpace ? parentSpace.name : "NA"}</Breadcrumb.Item>
                                      <Breadcrumb.Item href={`${parentFolder?.link}`}><FontAwesomeIcon icon={icon({ name: "folder" })} /> {parentFolder ? parentFolder.name : "NA"}</Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "list" })} /> {locationName}</Breadcrumb.Item>
                                    </>
                                    :
                                    <>
                                      <Breadcrumb.Item href={`${parentSpace?.link}`}><FontAwesomeIcon icon={icon({ name: "square" })} /> {parentSpace ? parentSpace.name : "NA"}</Breadcrumb.Item>
                                      <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "list" })} /> {locationName}</Breadcrumb.Item>
                                    </>
                                  )
                                )}
                            </Breadcrumb>
                          ) : (
                            <></>
                          )}
                          Shortcut located in this {locationType} {locationName}.
                        </th>
                      ) : (
                        <th>
                          {foundTrigger ? (
                            <Breadcrumb>
                              {locationType === "Space: " ?
                                <>
                                  <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "square" })} /> {locationName}</Breadcrumb.Item>
                                </> : (locationType === "Folder: " ?
                                  <>
                                    <Breadcrumb.Item href={`${parentSpace?.link}`}><FontAwesomeIcon icon={icon({ name: "square" })} /> {parentSpace ? parentSpace.name : "NA"}</Breadcrumb.Item>
                                    <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "folder" })} /> {locationName}</Breadcrumb.Item>
                                  </> :
                                  <>
                                    <Breadcrumb.Item href={`${parentSpace?.link}`}><FontAwesomeIcon icon={icon({ name: "square" })} /> {parentSpace ? parentSpace.name : "NA"}</Breadcrumb.Item>
                                    <Breadcrumb.Item href={`${parentFolder?.link}`}><FontAwesomeIcon icon={icon({ name: "folder" })} /> {parentFolder ? parentFolder.name : "NA"}</Breadcrumb.Item>
                                    <Breadcrumb.Item href={foundLink}><FontAwesomeIcon icon={icon({ name: "list" })} /> {locationName}</Breadcrumb.Item>
                                  </>
                                )}
                            </Breadcrumb>
                          ) : (
                            <></>
                          )}
                          Automation located in this {locationType} {locationName}.
                        </th>
                      )}
                    </tr>
                    <tr>
                      <td>
                        Your trigger is: <output id="trigger-output"></output>
                      </td>
                    </tr>
                    <tr>
                      {shortcut !== undefined ? (
                        <td>
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
                        <td>
                          Your Automation is:
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
