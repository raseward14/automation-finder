import React, { useEffect, useState } from "react";
import * as AutomationAPIFunctions from '../utils/AutomationsAPI';

const Automations= () => {
  const [bearer, setBearer] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNiVkFxWkNGdVJBPSJ9.eyJ1c2VyIjoxNDkxNzI4NywidmFsaWRhdGVkIjp0cnVlLCJzZXNzaW9uX3Rva2VuIjp0cnVlLCJ3c19rZXkiOjI2MTQ1NTczOTMsImlhdCI6MTcwNTIwODYzMSwiZXhwIjoxNzA1MzgxNDMxfQ.9hnFChSCVfuVSLhxQUtpZrkTH1z_svLbGJMmjYfcPoU');
  const [shard, setShard] = useState('prod-us-east-2-1');

  const [workspaceID, setWorkspaceID] = useState(10618731);
  const [spaceIDs, setSpaceIDs] = useState([16903372]);
  const [folderIDs, setFolderIDs] = useState([90111363530]);
  const [listIDs, setListIDs] = useState([192288379]);

  let triggerIDArray;

  
  
  function printBearer(): void {
    const triggerIDValue = document.getElementById('bearer-input') as HTMLInputElement;
    const printValue = document.getElementById('enteredNumber') as HTMLOutputElement;
    const trigID = triggerIDValue.value;
    printValue.textContent = trigID.toString();
  };

  const getListAutomations = (listIDs: number[]) => {
    listIDs.forEach(id => {
      const workflowLog = AutomationAPIFunctions.getListAutomations(shard, id, bearer);
      console.log(`list ${id} workflow: ${workflowLog}`);
    })
  };

  const getFolderAutomations = (folderIDs: number[]) => {
    folderIDs.forEach(id => {
      const workflowLog = AutomationAPIFunctions.getFolderAutomations(shard, id, bearer);
      console.log(`folder ${id} workflow: ${workflowLog}`);
    })
  };

  const getSpaceAutomations = (spaceIDs: number[]) => {
    spaceIDs.forEach(id => {
      const workflowLog = AutomationAPIFunctions.getSpaceAutomations(shard, id, bearer);
      console.log(`space ${id} workflow: ${workflowLog}`);

    } )
  };

  // useEffect(() => {
  //     async (req: Request, res: Response): Promise<any> => {
  //       const request = await fetch(`https://app.clickup.com/shard/v1/handshake/${workspaceID}`, {
  //         method: "GET",
  //       })
  //       const response = await request.text();
  //       console.log('useEffect fired', response);
  //     }
  // },[]);

  // useEffect(() => {
  //   console.log(bearer)
  // });

  return (
    <div>
      <h1>The automations page</h1>
      <span>Enter a trigger ID</span><br/>

      <input 
      type= "text"
      id='bearer-input'
      placeholder="bearer"
      /><br/>
      <button
      onClick={() => printBearer()}>Print</button>
      <h3>You entered: <output id="enteredNumber"></output></h3>
    </div>
  )
};

export default Automations;