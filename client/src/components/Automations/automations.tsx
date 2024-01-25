import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

type AutomationPropList = {
  teamId: string;
  spaceIds: string[];
  folderIds: string[];
  listIds: string[];
};

const Automations = (props: AutomationPropList) => {
  // inputs - manual
  const [bearer, setBearer] = useState<string>('');
  const [triggerId, setTriggerId] = useState<string>('');

  // passed from workspace.tsx - done
  const [workspaceId, setWorkspaceId] = useState<string>(props.teamId);
  // sets dynamically by workspaceID on page load
  const [shard, setShard] = useState<string>('');
  
  // still need these, temporary placeholders - in progress
  const [spaceIds, setSpaceIds] = useState<string[]>(props.spaceIds);
  const [folderIds, setFolderIds] = useState<string[]>(props.folderIds);
  const [listIds, setListIds] = useState<string[]>(props.listIds);

  // to store all triggerIds from all spaces, folders, lists
  let triggerIDArray;

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

    // with workspace ID and shard:
    // get Spaces
    // for each Space, get Folders, get Folderless lists
    // for each Folder, get lists
  };

  const getListAutomations = (listIDs: number[]) => {
    listIDs.forEach((id) => {
      // const workflowLog = AutomationAPIFunctions.getListAutomations(
      //   shard,
      //   id,
      //   bearer
      // );
      // console.log(`list ${id} workflow: ${workflowLog}`);
    });
  };

  const getFolderAutomations = (folderIDs: number[]) => {
    folderIDs.forEach((id) => {
      // const workflowLog = AutomationAPIFunctions.getFolderAutomations(
      //   shard,
      //   id,
      //   bearer
      // );
      // console.log(`folder ${id} workflow: ${workflowLog}`);
    });
  };

  const getSpaceAutomations = (spaceIDs: number[]) => {
    spaceIDs.forEach((id) => {
      // const workflowLog = AutomationAPIFunctions.getSpaceAutomations(
      //   shard,
      //   id,
      //   bearer
      // );
      // console.log(`space ${id} workflow: ${workflowLog}`);
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

  const printTriggerId = () => {
    // use functions above to find automation by trigger_id
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    const printValue = document.getElementById(
      'trigger-output'
    ) as HTMLOutputElement;
    printValue.textContent = triggerInput.toString();
    setTriggerId(triggerInput);
  };

  useEffect(() => {
    console.log('from automations.tsx', spaceIds, folderIds, listIds)
  }, [listIds]);

  // useEffects for what this component has
  useEffect(() => {
    printShardFromWorkspaceId();
    console.log(`workspaceID being searched: ${workspaceId}`);
  }, [workspaceId, props.teamId]);
  useEffect(() => {
    console.log(`workspace shard: ${shard}`);
  }, [shard]);
  useEffect(() => {
    console.log(`triggerID being searched: ${triggerId}`);
  }, [triggerId]);
  useEffect(() => {
    console.log(`bearer token for ?workflow endpoint: ${bearer}`);
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
      <button onClick={() => printBearer()}>Print</button>
      <h4>
        Your bearer token is: <output id="enteredNumber"></output>
      </h4>

      <span>Enter a trigger_id</span>
      <br />
      <input type="text" id="trigger-input" placeholder="triggerId" />
      <br />
      <button onClick={() => printTriggerId()}>Find Automation</button>
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
