import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, ContainerProps, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Team,
  Space,
  Folder,
  List,
  ListObject,
} from '../models/workspace_interface';
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
  // const [spaceData, setSpaceData] = useState<JSON>();
  // const [folderData, setFolderData] = useState<JSON>();
  // const [folderlessListData, setFolderlessListData] = useState<JSON>();
  // const [listData, setListData] = useState<JSON>();
  // const [selectedTeam, setSelectedTeam] = useState<string>('');
  //containers for
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const [spaceArray, setSpaceArray] = useState<Space[]>([]);
  const [folderArray, setFolderArray] = useState<Folder[]>([]);
  const [folderlessListArray, setFolderlessListArray] = useState<List[]>([]);
  const [listArray, setListArray] = useState<ListObject[]>([]);

  const [spacePending, setSpacePending] = useState<boolean>(true);
  const [folderPending, setFolderPending] = useState<boolean>(true);
  const [folderlessListPending, setFolderlessListPending] =
    useState<boolean>(true);
  const [listPending, setListPending] = useState<boolean>(true);

  //
  const [clickedTeam, setClickedTeam] = useState<JSON>();
  const [showNavButton, setShowNavButton] = useState<boolean>(false);
  const [workspacePressed, setWorkspacePressed] = useState<Number>(-1);
  // const [spacePressed, setSpacePressed] = useState<Number>(-1);
  // const [folderlessPressed, setFolderlessPressed] = useState<Number>(-1);
  // const [folderPressed, setFolderPressed] = useState<Number>(-1);
  // const [listPressed, setListPressed] = useState<Number>(-1);
  // for progress bar
  // const [spaceIndex, setSpaceIndex] = useState<any>(0);

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
          let spaceCount = spaceArrayData.length;
          for (var i = 0; i < spaceArrayData.length; i++) {
            let spaceIndex = i + 1;
            // setSpaceIndex(spaceIndex);
            indvidualArray.push(spaceArrayData[i]);
            GetFolders(spaceArrayData[i].id, spaceIndex, spaceCount);
            GetFolderlessLists(spaceArrayData[i].id, spaceIndex, spaceCount);
            // if its the last Space in the Space array
            if (spaceIndex === spaceCount) {
              console.log(
                `this Spaces index: ${spaceIndex}, and total Space count: ${spaceCount}`
              );
              setSpacePending(false);
            }
          }
          setSpaceArray((spaceArray) => [...spaceArray, ...indvidualArray]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetFolders = async (
    spaceId: string,
    spaceIndex: number,
    spaceCount: number
  ): Promise<void> => {
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
          let folderCount = folderArrayData.length;

          if (spaceIndex === spaceCount && folderArrayData.length === 0) {
            // if its the last Space in the Space array, and this Space doesn't have any Folders
            setFolderPending(false);
          } else {
            for (var i = 0; i < folderArrayData.length; i++) {
              let folderIndex = i + 1;
              indvidualArray.push(folderArrayData[i]);
              let folderLists: ListObject[] = folderArrayData[i].lists;
              storeLists(
                folderLists,
                folderIndex,
                folderCount,
                spaceIndex,
                spaceCount
              );
              // if its the last Space in the Space array, and this is the last Folder in that Space
              if (spaceIndex === spaceCount && folderIndex === folderCount) {
                console.log(
                  `this Folders index: ${folderIndex}, and total Folder count: ${folderCount}`
                );
                setFolderPending(false);
              }
            }
            setFolderArray((folderArray) => [
              ...folderArray,
              ...indvidualArray,
            ]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const GetFolderlessLists = async (
    spaceId: string,
    spaceIndex: number,
    spaceCount: number
  ): Promise<void> => {
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
          let folderlessListCount = folderlessListArrayData.length;
          if (
            spaceIndex === spaceCount &&
            folderlessListArrayData.length === 0
          ) {
            // if its the last Space in the Space array, and this Space does not have any Folderless lists
            setFolderlessListPending(false);
          } else {
            for (var i = 0; i < folderlessListArrayData.length; i++) {
              let folderlessListIndex = i + 1;
              indvidualArray.push(folderlessListArrayData[i]);
              console.log(
                spaceIndex,
                spaceCount,
                folderlessListIndex,
                folderlessListCount
              );
              // if its the last Space in the Space array, and this is the last list in that Space
              if (
                spaceIndex === spaceCount &&
                folderlessListIndex === folderlessListCount
              ) {
                console.log(
                  `this Folderless list index: ${folderlessListIndex}, and total Folderless list count: ${folderlessListCount}`
                );
                setFolderlessListPending(false);
              }
            }
            setFolderlessListArray((folderlessListArray) => [
              ...folderlessListArray,
              ...indvidualArray,
            ]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const storeLists = (
    listArray: ListObject[],
    folderIndex: number,
    folderCount: number,
    spaceIndex: number,
    spaceCount: number
  ) => {
    const listArrayData: ListObject[] = listArray;
    const indvidualArray: ListObject[] = [];
    let listCount = listArrayData.length;
    for (var i = 0; i < listArrayData.length; i++) {
      let listIndex = i + 1;
      indvidualArray.push(listArrayData[i]);
      // if its the last Folder in the Folder array, and this is the last Space in the Space array, and this is the last list in that Folder
      if (
        folderIndex === folderCount &&
        spaceIndex === spaceCount &&
        listIndex === listCount
      ) {
        console.log(
          `this lists index: ${listIndex}, and total list count: ${listCount}`
        );
        setListPending(false);
      }
    }
    setListArray((listArray) => [...listArray, ...indvidualArray]);
  };

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
      setShowNavButton(true);
    }
  }, [spacePending, folderPending, folderlessListPending, listPending]);

  useEffect(() => {
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
              <><br/><br/>
                <span className="spinner-text">Collecting workspace details...</span><br/><br/>
                <Spinner
                  className="spinner"
                  animation="border"
                  variant="info"
                />
                {/* <ProgressBar now={spaceIndex/spaceArray.length} /> */}
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
