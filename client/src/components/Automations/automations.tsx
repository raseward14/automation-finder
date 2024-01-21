import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

type AutomationPropList = {
  firstProp: string
}

const Automations = (props: AutomationPropList) => {
  const [bearer, setBearer] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNiVkFxWkNGdVJBPSJ9.eyJ1c2VyIjoxNDkxNzI4NywidmFsaWRhdGVkIjp0cnVlLCJzZXNzaW9uX3Rva2VuIjp0cnVlLCJ3c19rZXkiOjI2MTQ1NTczOTMsImlhdCI6MTcwNTIwODYzMSwiZXhwIjoxNzA1MzgxNDMxfQ.9hnFChSCVfuVSLhxQUtpZrkTH1z_svLbGJMmjYfcPoU');
  const [shard, setShard] = useState('prod-us-east-2-1');

  const [workspaceID, setWorkspaceID] = useState<string>(props.firstProp);
  const [spaceIDs, setSpaceIDs] = useState([16903372]);
  const [folderIDs, setFolderIDs] = useState([90111363530]);
  const [listIDs, setListIDs] = useState([192288379]);
  // const [triggerId, setTriggerId] = useState<string>();

  let triggerIDArray;

  const printShard = async () => {
    const printValue = document.getElementById(
      'shard'
    ) as HTMLOutputElement;
    console.log(props.firstProp)
    console.log(workspaceID)
    if(workspaceID.length > 1) {
      const res = await axios.post('http://localhost:3001/automation/shard', {
          teamId: workspaceID
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

  const findAutomation = () => {
    // use functions above to find automation by trigger_id
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    const printValue = document.getElementById(
      'trigger-output'
    ) as HTMLOutputElement;
    printValue.textContent = triggerInput.toString();
    // setTriggerId(triggerInput);
  };

  useEffect(() => {
    console.log(props.firstProp)
    if(workspaceID !== undefined) {
      console.log(props.firstProp);
      console.log(workspaceID);
      printShard();
    }
  },[props.firstProp])

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
      <button onClick={() => findAutomation()}>Find Automation</button>
      <h4>
        Your trigger_id: <output id="trigger-output"></output>
      </h4>
      <h4>
        Your Automation is: <output id="automation"></output>
      </h4>
    </div>
  );
};

export default Automations;
