import React, { useEffect, useState } from 'react';
// import fetch from 'node-fetch';
// import { HttpsProxyAgent } from 'https-proxy-agent';
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
    // cors error
    // proxy config
    // const proxyHost = `localhost`;
    // const proxyPort = 3000;
    
    // target website URL
    // const targetURL = `https://app.clickup.com/shard/v1/handshake/${workspaceID}`;

    // proxy URL
    // const proxyURL = `http://${proxyHost}:${proxyPort}`;

    // new proxy agent
    // const proxyAgent = new HttpsProxyAgent(proxyURL);

    // const response = await fetch(targetURL, { agent: proxyAgent });
    // const html = await response.text();
    // console.log(html);
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

  // useEffect(() => {
  //   console.log('useEffet fired');
  //   // getShard();
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
