import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

type AutomationPropList = {
  firstProp: JSON | undefined
}

const Automations = (props: AutomationPropList) => {
  const [bearer, setBearer] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNiVkFxWkNGdVJBPSJ9.eyJ1c2VyIjoxNDkxNzI4NywidmFsaWRhdGVkIjp0cnVlLCJzZXNzaW9uX3Rva2VuIjp0cnVlLCJ3c19rZXkiOjI2MTQ1NTczOTMsImlhdCI6MTcwNTIwODYzMSwiZXhwIjoxNzA1MzgxNDMxfQ.9hnFChSCVfuVSLhxQUtpZrkTH1z_svLbGJMmjYfcPoU');
  const [shard, setShard] = useState('prod-us-east-2-1');

  const [workspaceID, setWorkspaceID] = useState('10618731');
  const [spaceIDs, setSpaceIDs] = useState([16903372]);
  const [folderIDs, setFolderIDs] = useState([90111363530]);
  const [listIDs, setListIDs] = useState([192288379]);

  let triggerIDArray;

  const printShard = async () => {
    const workspaceId = document.getElementById(
      'workspaceId-input'
    ) as HTMLInputElement;
    const printValue = document.getElementById(
      'shard'
    ) as HTMLOutputElement;
    const workspaceInput = workspaceId.value;
    setWorkspaceID(workspaceInput)
    
    const res = await axios.post('http://localhost:3001/automation/shard', {
        teamId: props.firstProp
    });
    const shard = res.data;
    console.log('from Automations page', props.firstProp)
    printValue.textContent = shard;
    setShard(shard);
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

  useEffect(() => {
    printShard();
    // console.log(yourTeamData)
    // get Spaces
    // for each Space, get Folders, get Folderless lists
    // for each Folder, get lists
  })

  return (
    <div className="automations-container">
      <h1>The automations page</h1>
      <span>Enter a bearer token</span>
      <br />

      <input type="text" id="bearer-input" placeholder="bearer" />
      <br />
      <button onClick={() => printBearer()}>Print</button>
      <h3>
        Your bearer token is: <output id="enteredNumber"></output>
      </h3>

      <input type="text" id="workspaceId-input" placeholder="workspaceId" />
      <br />
      <button onClick={() => printShard()}>Print Shard</button>
      <h3>
        Your shard is: <output id="shard"></output>
      </h3>

    </div>
  );
};

export default Automations;
