import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

type AutomationPropList = {
  teamId: string;
  spaceIds: string[];
  folderIds: string[];
  listIds: string[];
  folderlessListIds: string[];
};

const Automations = (props: AutomationPropList) => {
  // inputs - manual
  const [bearer, setBearer] = useState<string>('');
  const [triggerId, setTriggerId] = useState<string>('');
  const [foundTrigger, setFoundTrigger] = useState<any>();

  // passed from workspace.tsx - done
  const [workspaceId, setWorkspaceId] = useState<string>(props.teamId);
  // sets dynamically by workspaceID on page load
  const [shard, setShard] = useState<string>('');

  // location ids
  const [spaceIds, setSpaceIds] = useState<string[]>(props.spaceIds);
  const [folderIds, setFolderIds] = useState<string[]>(props.folderIds);
  const [listIds, setListIds] = useState<string[]>(props.listIds);
  const [folderlessListIds, setFolderlessListIds] = useState<string[]>(
    props.folderlessListIds
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
    const printValue = document.getElementById('shard') as HTMLOutputElement;
    if (workspaceId.length > 1) {
      const res = await axios.post('http://localhost:3001/automation/shard', {
        teamId: workspaceId,
      });
      const shard = res.data;
      printValue.textContent = shard;
      setShard(shard);
    }
  };

  const getListAutomations = (listIDs: string[]) => {
    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: bearer,
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
        bearer: bearer,
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
        bearer: bearer,
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
        bearer: bearer,
      });
      setSpaceTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`space ${id} workflow request:`, res.data);
    });
  };

  function printBearer(): void {
    const bearerValue = document.getElementById(
      'bearer-input'
    ) as HTMLInputElement;
    const printValue = document.getElementById(
      'enteredNumber'
    ) as HTMLOutputElement;
    const bearerInput = bearerValue.value;
    printValue.textContent = bearerInput.toString();
    setBearer(bearerInput);
  }

  const searchSpacesForTrigger = () => {
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    const printValue = document.getElementById(
      'trigger-output'
    ) as HTMLOutputElement;

    let spaceAutoTriggers = spaceTriggers?.automations;
    let spaceShortcutTriggers = spaceTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      spaceAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      spaceShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === false && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    }

  };

  const searchFoldersForTrigger = () => {
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    const printValue = document.getElementById(
      'trigger-output'
    ) as HTMLOutputElement;

    let folderAutoTriggers = folderTriggers?.automations;
    let folderShortcutTriggers = folderTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      folderAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    };

    if (foundTrigger === undefined) {
      folderShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === false && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    };

    searchSpacesForTrigger()
  };

  const searchFolderlessListsForTrigger = () => {
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    const printValue = document.getElementById(
      'trigger-output'
    ) as HTMLOutputElement;

    let folderlessListAutoTriggers = folderlessListTriggers?.automations;
    let folderlessShortcutTriggers = folderlessListTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      folderlessListAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      folderlessShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === false && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    }

    searchFoldersForTrigger()

  };

  const searchListsForTrigger = async () => {
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    const printValue = document.getElementById(
      'trigger-output'
    ) as HTMLOutputElement;
    let listAutoTriggers = listTriggers?.automations;
    let listShortcutTriggers = listTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      listAutoTriggers?.forEach((trigger: any) => {
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      listShortcutTriggers?.forEach((trigger: any) => {
        if (foundTrigger === false && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
        }
      });
    }

    searchFolderlessListsForTrigger();

    // if((listAutoTriggers !== undefined) && (foundTrigger === undefined)) {
    //   listAutoTriggers.forEach((trigger: any, i: number) => {
    //     console.log(trigger.id, triggerInput)
    //     if(trigger.id === triggerInput)
    //     setFoundTrigger(trigger);
    //   })
    // } else if ((listShortcutTriggers !== undefined) && (foundTrigger === undefined)) {
    //   listShortcutTriggers.forEach((trigger: any, i: number) => {
    //     console.log(trigger.id, triggerInput)
    //     if(trigger.id === triggerInput)
    //     setFoundTrigger(trigger);
    //   })
    // } else if ((folderAutoTriggers !== undefined) && (foundTrigger === undefined)) {
    //   folderAutoTriggers.forEach((trigger: any, i: number) => {
    //     console.log(trigger.id, triggerInput)
    //     if(trigger.id === triggerInput)
    //     setFoundTrigger(trigger);
    //   })
    // } else if((folderShortcutTriggers !== undefined) && (foundTrigger === undefined)) {
    //   folderShortcutTriggers.forEach((trigger: any, i: number) => {
    //     console.log(trigger.id, triggerInput)
    //     if(trigger.id === triggerInput)
    //     setFoundTrigger(trigger);
    //   })
    // } else if((spaceAutoTriggers !== undefined) && (foundTrigger === undefined)) {
    //   spaceAutoTriggers.forEach((trigger: any, i: number) => {
    //     console.log(trigger.id, triggerInput)
    //     if(trigger.id === triggerInput)
    //     setFoundTrigger(trigger);
    //   })
    // } else if((spaceShortcutTriggers !== undefined) && (foundTrigger === undefined)) {
    //   spaceShortcutTriggers.forEach((trigger: any, i: number) => {
    //     console.log(trigger.id, triggerInput)
    //     if(trigger.id === triggerInput)
    //     setFoundTrigger(trigger);
    //   })
    // } else {
    //   console.log('its been deleted or exists in a different workspace')
    // }

    // console.log('folderless list auto triggers', folderlessListTriggers?.automations);
    // console.log('folderless list shortcut triggers', folderlessListTriggers?.shortcuts);

    // console.log('folder auto triggers', folderTriggers?.automations);
    // console.log('folder shortcut triggers', folderTriggers?.shortcuts);

    // console.log('space auto triggers', spaceTriggers?.automations);
    // console.log('space shortcut triggers', spaceTriggers?.shortcuts);

    // printValue.textContent = triggerInput.toString();
    // setTriggerId(triggerInput);
  };

  useEffect(() => {
    if (foundTrigger !== undefined) {
      console.log('we found it!', foundTrigger);
      const printValue = document.getElementById(
        'trigger-output'
      ) as HTMLOutputElement;
      printValue.textContent = foundTrigger.toString();

    }
  }, [foundTrigger]);


  // useEffects for what this component has
  useEffect(() => {
    printShardFromWorkspaceId();
    console.log(`workspaceID being searched: ${workspaceId}`);
  }, [workspaceId]);
  useEffect(() => {
    console.log(`workspace shard: ${shard}`);
    if (shard.length > 1) {
      // when we have a bearer, we can call get automations functions on page load from here
      // getListAutomations(listIds);
      // getFolderAutomations(folderIds);
      // getSpaceAutomations(spaceIds);
    }
  }, [shard]);
  useEffect(() => {
    console.log(`triggerID being searched: ${triggerId}`);
  }, [triggerId]);
  useEffect(() => {
    console.log(`bearer token for ?workflow endpoint: ${bearer}`);
    if (bearer !== '') {
      getSpaceAutomations(spaceIds);
      getFolderAutomations(folderIds);
      getListAutomations(listIds);
      getFolderlessListAutomations(folderlessListIds);
    }
  }, [bearer]);

  return (
    <div className="automations-container">
      <h3>
        Your shard is: <output id="shard"></output>
      </h3>
      <h1>The automations page</h1>
      <span>Enter a bearer token</span>
      <br />

      <input type="text" id="bearer-input" placeholder="bearer" />
      <br />
      <button
        onClick={() => {
          printBearer();
        }}
      >
        Print
      </button>
      <h4>
        Your bearer token is: <output id="enteredNumber"></output>
      </h4>

      <span>Enter a trigger_id</span>
      <br />
      <input type="text" id="trigger-input" placeholder="triggerId" />
      <br />
      <button
        onClick={() => {
          searchListsForTrigger();
        }}
      >
        Find Automation
      </button>
      <h4>
        Your trigger_id: <output id="trigger-output"></output>
      </h4>
      <h4>
        Your Automation is: <output id="automation">placeholder</output>
      </h4>
    </div>
  );
};

export default Automations;
