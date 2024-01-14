import React, { useEffect, useState } from 'react';
import * as AutomationAPIFunctions from '../utils/AutomationsAPI';

const Automations = () => {
  const [bearer, setBearer] = useState('');
  const [shard, setShard] = useState('prod-us-east-2-1');

  const [workspaceID, setWorkspaceID] = useState(10618731);
  const [spaceIDs, setSpaceIDs] = useState([16903372]);
  const [folderIDs, setFolderIDs] = useState([90111363530]);
  const [listIDs, setListIDs] = useState([192288379]);

  let triggerIDArray;

  const getShard = async () => {
    fetch(`https://app.clickup.com/shard/v1/handshake/${workspaceID}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  function printBearer(): void {
    const triggerIDValue = document.getElementById(
      'bearer-input'
    ) as HTMLInputElement;
    const printValue = document.getElementById(
      'enteredNumber'
    ) as HTMLOutputElement;
    const trigID = triggerIDValue.value;
    printValue.textContent = trigID.toString();
    setBearer(trigID);
  }

  const getListAutomations = (listIDs: number[]) => {
    listIDs.forEach((id) => {
      const workflowLog = AutomationAPIFunctions.getListAutomations(
        shard,
        id,
        bearer
      );
      console.log(`list ${id} workflow: ${workflowLog}`);
    });
  };

  const getFolderAutomations = (folderIDs: number[]) => {
    folderIDs.forEach((id) => {
      const workflowLog = AutomationAPIFunctions.getFolderAutomations(
        shard,
        id,
        bearer
      );
      console.log(`folder ${id} workflow: ${workflowLog}`);
    });
  };

  const getSpaceAutomations = (spaceIDs: number[]) => {
    spaceIDs.forEach((id) => {
      const workflowLog = AutomationAPIFunctions.getSpaceAutomations(
        shard,
        id,
        bearer
      );
      console.log(`space ${id} workflow: ${workflowLog}`);
    });
  };

  useEffect(() => {
    console.log('useEffet fired');
    getShard();
  });

  // useEffect(() => {
  //   console.log(bearer)
  // });

  return (
    <div>
      <h1>The automations page</h1>
      <span>Enter a trigger ID</span>
      <br />

      <input type="text" id="bearer-input" placeholder="bearer" />
      <br />
      <button onClick={() => printBearer()}>Print</button>
      <h3>
        You entered: <output id="enteredNumber"></output>
      </h3>
    </div>
  );
};

export default Automations;
