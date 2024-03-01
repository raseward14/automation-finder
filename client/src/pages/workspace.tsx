import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, ContainerProps, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { Team, Space, Folder, List, ListObject } from '../models/workspace_interface';
// import "./component.css";

type WorkspacePropList = {
  teamCallback: (a: string) => void;
  spaceCallback: (a: string[]) => void;
  folderCallback: (a: string[]) => void;
  listCallback: (a: string[]) => void;
  folderlessListCallback: (a: string[]) => void;
  tokenCallback: (a: any) => void;
};

// type WorkspacePropList = {
//   teams: object[]
// };

export default function Workspace(props: WorkspacePropList) {
  let { token } = useParams();
  const navigate = useNavigate();
  //containers for response object
  const [teamData, setTeamData] = useState<JSON>();
  const [spaceData, setSpaceData] = useState<JSON>();
  const [folderData, setFolderData] = useState<JSON>();
  const [folderlessListData, setFolderlessListData] = useState<JSON>();
  const [listData, setListData] = useState<JSON>();
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  //containers for
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const [spaceArray, setSpaceArray] = useState<Space[]>([]);
  const [folderArray, setFolderArray] = useState<Folder[]>([]);
  const [folderlessListArray, setFolderlessListArray] = useState<List[]>([]);
  const [listArray, setListArray] = useState<ListObject[]>([]);

  const [spacePending, setSpacePending] = useState<boolean>(true);
  const [folderPending, setFolderPending] = useState<boolean>(true);
  const [folderlessListPending, setFolderlessListPending] = useState<boolean>(true);
  const [listPending, setListPending] = useState<boolean>(true);

  //
  const [clickedTeam, setClickedTeam] = useState<JSON>();
  const [showNavButton, setShowNavButton] = useState<boolean>(false);
  const [workspacePressed, setWorkspacePressed] = useState<Number>(-1);
  const [spacePressed, setSpacePressed] = useState<Number>(-1);
  const [folderlessPressed, setFolderlessPressed] = useState<Number>(-1);
  const [folderPressed, setFolderPressed] = useState<Number>(-1);
  const [listPressed, setListPressed] = useState<Number>(-1);

  const GetTeams = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/teams`, {
        token: token,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const teamsArrayData: Team[] = jsonData.teams;
          const individualTeamObjects: Team[] = [];
          for (const team of teamsArrayData) {
            individualTeamObjects.push(team); // Add the team object to the new array
          }
          setTeamArray(individualTeamObjects);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetSpaces = async (teamId: string): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/spaces`, {
        token: token,
        teamId: teamId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const spaceArrayData: Space[] = jsonData.spaces;
          const indvidualArray: Space[] = [];
          for (var i = 0; i < spaceArrayData.length; i++) {
            // console.log('how many spaces in this workspace', spaceArrayData.length)
            // console.log('space number', i + 1)
            indvidualArray.push(spaceArrayData[i]);
            console.log('space data', spaceArrayData[i]);
            GetFolders(spaceArrayData[i].id);
            GetFolderlessLists(spaceArrayData[i].id);  

            if((i + 1) === spaceArrayData.length) {
              setSpacePending(false);
            };
          }
          setSpaceArray((spaceArray) => [...spaceArray, ...indvidualArray]);
        }
      })
      // .then(() => {
      //   console.log('last then')
      //   setShowNavButton(true);
      // })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetFolders = async (spaceId: string): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/folders`, {
        token: token,
        spaceId: spaceId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const folderArrayData: Folder[] = jsonData.folders;
          const indvidualArray: Folder[] = [];
          for (var i = 0; i < folderArrayData.length; i++) {
            console.log('how many lists in this folder', folderArrayData.length)
            console.log('list number', i + 1)
            indvidualArray.push(folderArrayData[i]);
            let folderLists: ListObject[] = (folderArrayData[i].lists)
            // GetLists(folderArrayData[i].id);
            storeLists(folderLists)
            if((i + 1) === folderArrayData.length) {
              setFolderPending(false);
            };
          }
          setFolderArray((folderArray) => [...folderArray, ...indvidualArray]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const GetFolderlessLists = async (spaceId: string): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/folderless/lists`, {
        token: token,
        spaceId: spaceId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const folderlessListArrayData: List[] = jsonData.lists;
          const indvidualArray: List[] = [];
          for (var i = 0; i < folderlessListArrayData.length; i++) {
            indvidualArray.push(folderlessListArrayData[i]);
            console.log(folderlessListArrayData[i])
            if((i + 1) === folderlessListArrayData.length) {
              setFolderlessListPending(false);
            };

          }
          setFolderlessListArray((folderlessListArray) => [
            ...folderlessListArray,
            ...indvidualArray,
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const storeLists = (listArray: ListObject[]) => {
    console.log('storing these lists from a single Folder', listArray)
    const listArrayData: ListObject[] = listArray;
    const indvidualArray: ListObject[] = [];
    for (var i = 0; i < listArrayData.length; i++) {
      indvidualArray.push(listArrayData[i]);
      if((i + 1) === listArrayData.length) {
        setListPending(false);
      };
    }
    setListArray((listArray) => [...listArray, ...indvidualArray]);
  }

  // const GetLists = async (folderId: string): Promise<void> => {
  //   console.log('made it here')
  //   await axios
  //     .post(`http://localhost:3001/workspace/lists`, {
  //       token: token,
  //       folderId: folderId,
  //     })
  //     .then((resp) => {
  //       if (resp.data != undefined) {
  //         let jsonData = JSON.parse(resp.data);
  //         const listArrayData: List[] = jsonData.lists;
  //         const indvidualArray: List[] = [];
  //         for (var i = 0; i < listArrayData.length; i++) {
  //           indvidualArray.push(listArrayData[i]);
  //           if((i + 1) === listArrayData.length) {
  //             setListPending(false);
  //           };
  //         }
  //         setListArray((listArray) => [...listArray, ...indvidualArray]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const createButtons = (data: any) => {
    if (data !== undefined) {
      let jsonData = JSON.parse(data);
      let teamArr = jsonData.teams;

      const teamNames = teamArr.map((team: any) => {
        return team.name;
      });
      setTeamArray(teamNames);
    }
  };

  const sendTeam = (data: any) => {
    if (data !== undefined) {
      props.teamCallback(data);
    }
  };

  useEffect(() => {
    GetTeams();
  }, []);

  useEffect(() => {
    sendTeam(clickedTeam);
  }, [clickedTeam]);

  useEffect(() => {
    if (teamData !== undefined) {
      createButtons(teamData);
    }
  }, [teamData]);

  // useEffect(() => {
  //   for (var i = 0; i < spaceArray.length; i++) {
  //     GetFolders(spaceArray[i].id);
  //     GetFolderlessLists(spaceArray[i].id);
  //   }
  // }, [spaceArray]);

  // useEffect(() => {
  //   if (clickedTeam && folderArray.length === 0) {
  //     props.spaceCallback(spaceArray.map((space: any) => space.id));
  //     props.folderlessListCallback(
  //       folderlessListArray.map((list: any) => list.id)
  //     );
  //   }
  // }, [folderArray]);

  useEffect(() => {
    if(!spacePending && !folderPending && !folderlessListPending && !listPending) {
      setShowNavButton(true)
    }
  }, [spacePending, folderPending, folderlessListPending, listPending]);

  useEffect(() => {
    console.log('list array changed', listArray);
    console.log('FolderlessList array changed', folderlessListArray);
    console.log('Folder array changed', folderArray);
    console.log('Space array changed', spaceArray);

    props.tokenCallback(token);
    props.spaceCallback(spaceArray.map((space: any) => space.id));
    props.folderCallback(folderArray.map((folder: any) => folder.id));
    props.listCallback(listArray.map((list: any) => list.id));
    props.folderlessListCallback(
      folderlessListArray.map((list: any) => list.id)
    );
  }, [listArray, folderlessListArray]);

  const style = {
    container: {
      margin: '5% 10% 10% 10%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      justifyContent: 'center',
      width: '100vw',
      margin: '0 auto',
    },
    button: {
      width: 'auto', // Make the button only as wide as needed
      margin: '5px', // Optional: Add margin for spacing
    },
  };

  return (
    <Container fluid style={style.container as React.CSSProperties}>
      <Row></Row>
      <Row style={style.row}>
        <Col id="hierarchy_col">
          <h1>Select a Workspace</h1>
          {teamArray?.map((team: any, i: number) => (
            <Button
              style={style.button}
              variant={workspacePressed == i ? 'dark' : 'outline-dark'}
              key={i}
              onClick={() => {
                console.log(team);
                setClickedTeam(team);
                setSpaceArray([]);
                setFolderArray([]);
                setFolderlessListArray([]);
                setListArray([]);
                GetSpaces(team.id);
                i === workspacePressed
                  ? setWorkspacePressed(-1)
                  : setWorkspacePressed(i);
              }}
            >
              {`${team.name} id: ${team.id}`}
            </Button>
          ))}
        </Col>
        {/* <Col id="hierarchy_col">
          <h1>Spaces</h1>

          {spaceArray?.map((space: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button variant="dark" key={i} onClick={() => {}}>
                  {`${space.name} id: ${space.id}`}
                </Button>
              </td>
            </tr>
          ))}
        </Col>
        <Col id="hierarchy_col">
          <h1>Folders</h1>
          {folderArray?.map((folder: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button variant="dark" key={i} onClick={() => {}}>
                  {`${folder.name} id: ${folder.id}`}
                </Button>
              </td>
            </tr>
          ))}
        </Col>
        <Col id="hierarchy_col">
          <h1>Folderless Lists</h1>
          {folderlessListArray?.map((list: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button variant="dark" key={i} onClick={() => {}}>
                  {`${list.name} id: ${list.id}`}
                </Button>
              </td>
            </tr>
          ))}
        </Col>
        <Col id="hierarchy_col">
          <h1>Lists</h1>
          {listArray?.map((list: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button variant="dark" key={i} onClick={() => {}}>
                  {`${list.name} id: ${list.id}`}
                </Button>
              </td>
            </tr>
          ))}
        </Col> */}
        {showNavButton ? (
          <Col>
            <h3>Find Automations</h3>
            <tr>
              <td>
                <Button
                  onClick={() => {
                    navigate('/automations');
                  }}
                >
                  Automations
                </Button>
              </td>
            </tr>
          </Col>
        ) : (
          <Row>
            {clickedTeam ? (
              <>
                <Spinner animation="border" variant="info" />
              </>
            ) : (
              <Col></Col>
              )}
          </Row>
        )}
        </Row>
      {/* {workspacePressed === -1 ? (
        <></>
      ) : (
        <Container fluid style={style.container as React.CSSProperties}>
          <Row style={style.row}>
            <Col id="hierarchy_col">
              <h1>Spaces</h1>

              {spaceArray?.map((space: any, i: number) => (
                <tr key={i}>
                  <td key={i}>
                    <Button
                      style={style.button}
                      variant={spacePressed == i ? "dark" : "outline-dark"}
                      key={i}
                      onClick={() => {
                        i === spacePressed
                          ? setSpacePressed(-1)
                          : setSpacePressed(i);
                      }}>
                      {`${space.name} id: ${space.id}`}
                    </Button>
                  </td>
                </tr>
              ))}
            </Col>
          </Row>
          <Row style={style.row}>
            <Col id="hierarchy_col">
              <h1>Folders</h1>
              {folderArray?.map((folder: any, i: number) => (
                <tr key={i}>
                  <td key={i}>
                    <Button
                      style={style.button}
                      variant={folderPressed == i ? "dark" : "outline-dark"}
                      key={i}
                      onClick={() => {
                        i === folderPressed
                          ? setFolderPressed(-1)
                          : setFolderPressed(i);
                      }}>
                      {`${folder.name} id: ${folder.id}`}
                    </Button>
                  </td>
                </tr>
              ))}
            </Col>
          </Row>
          <Row style={style.row}>
            <Col id="hierarchy_col">
              <h1>Folderless Lists</h1>
              {folderlessListArray?.map((list: any, i: number) => (
                <tr key={i}>
                  <td key={i}>
                    <Button
                      style={style.button}
                      variant={folderlessPressed == i ? "dark" : "outline-dark"}
                      key={i}
                      onClick={() => {
                        i === folderlessPressed
                          ? setFolderlessPressed(-1)
                          : setFolderlessPressed(i);
                      }}>
                      {`${list.name} id: ${list.id}`}
                    </Button>
                  </td>
                </tr>
              ))}
            </Col>
          </Row>
          <Row style={style.row}>
            <Col id="hierarchy_col">
              <h1>Lists</h1>
              {listArray?.map((list: any, i: number) => (
                <tr key={i}>
                  <td key={i}>
                    <Button
                      style={style.button}
                      variant={listPressed == i ? "dark" : "outline-dark"}
                      key={i}
                      onClick={() => {
                        i === listPressed
                          ? setListPressed(-1)
                          : setListPressed(i);
                      }}>
                      {`${list.name} id: ${list.id}`}
                    </Button>
                  </td>
                </tr>
              ))}
            </Col>
          </Row>
        </Container>
      )} */}
    </Container>
  );
}
