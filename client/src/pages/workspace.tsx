import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Team,
  Space,
  Folder,
  List,
  ListObject,
} from '../models/workspace_interface';

type WorkspacePropList = {
  teamCallback: (a: string) => void;
  spaceCallback: (a: string[]) => void;
  folderCallback: (a: string[]) => void;
  listCallback: (a: string[]) => void;
  folderlessListCallback: (a: string[]) => void;
  tokenCallback: (a: any) => void;
};

export default function Workspace(props: WorkspacePropList) {
  let { token } = useParams();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState<JSON>();
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const [spaceArray, setSpaceArray] = useState<Space[]>([]);
  const [folderArray, setFolderArray] = useState<Folder[]>([]);
  const [folderlessListArray, setFolderlessListArray] = useState<List[]>([]);
  const [listArray, setListArray] = useState<List[]>([]);
  const [clickedTeam, setClickedTeam] = useState<JSON>();
  const [showNavButton, setShowNavButton] = useState<boolean>(false);
  const [workspacePressed, setWorkspacePressed] = useState<Number>(-1);

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
            individualTeamObjects.push(team); 
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
      .then(  (resp) => {

       
          if (resp.data != undefined) {
            let jsonData = JSON.parse(resp.data);
            const spaceArrayData: Space[] = jsonData.spaces;
            const indvidualArray: Space[] = [];
           for (var i = 0; i < spaceArrayData.length; i++) {
              indvidualArray.push(spaceArrayData[i]);
            }
             setSpaceArray((spaceArray) => [...spaceArray, ...indvidualArray]);
          }
        

         
        
      })
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
                  indvidualArray.push(folderArrayData[i]);
                }
                setFolderArray((folderArray) => [
                  ...folderArray,
                  ...indvidualArray,
                ]);
              }
            }
          )
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
                    }
                    setFolderlessListArray((folderlessListArray) => [
                      ...folderlessListArray,
                      ...indvidualArray,
                    ]);
                  }
                }
              )
              .catch((error) => {
                console.log(error);
              });
          };

      
          const GetLists = async (folderId: string): Promise<void> => {
            await axios
              .post(`http://localhost:3001/workspace/lists`, {
                token: token,
                folderId: folderId,
              })
              .then((resp) => {
                if (resp.data != undefined) {
                  let jsonData = JSON.parse(resp.data);
                  const listArrayData: List[] = jsonData.lists;
                  const indvidualArray: List[] = [];
                    for (var i = 0; i < listArrayData.length; i++) {
                      indvidualArray.push(listArrayData[i]);
                    }
                    setListArray((listArray) => [
                      ...listArray,
                      ...indvidualArray,
                    ]);
                  }
                }
              )
              .catch((error) => {
                console.log(error);
              });
          };

  const getIds = async (teamId: string) => {

    await GetSpaces(teamId);
    

    const setFolderIds = async () => {
      for (var i = 0; i < spaceArray.length; i++) {
        GetFolders(spaceArray[i].id)
      }
    };
    
    await setFolderIds();

     const setFolderlessIds = async () => {
      for (var i = 0; i < spaceArray.length; i++) {
        GetFolderlessLists(spaceArray[i].id)
      }
    };
    
    await setFolderlessIds();

     const setListIds = async () => {
      for (var i = 0; i < folderArray.length; i++) {
        GetLists(folderArray[i].id)
      }
    };

    await setListIds();

    
      props.tokenCallback(token);
      props.spaceCallback(spaceArray.map((space: any) => space.id));
      props.folderCallback(folderArray.map((folder: any) => folder.id));
      props.folderlessListCallback(folderlessListArray.map((list: any) => list.id));
      props.listCallback(listArray.map((list: any) => list.id));
    
    
      setShowNavButton(true);
    

  }

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
              onClick={ async () => {
                setShowNavButton(false);
                setSpaceArray([]);
                setFolderArray([]);
                setFolderlessListArray([]);
                setListArray([]);
                await getIds(team.id);
                i === workspacePressed
                  ? setWorkspacePressed(-1)
                  : setWorkspacePressed(i);
              }}
            >
              {`${team.name} id: ${team.id}`}
            </Button>
          ))}
        </Col>
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
              </>
            ) : (
              <Col></Col>
            )}
          </Row>
        )}
      </Row>
      <Row>
        <h1>STATUS</h1>
      </Row>
      <Row>
        <h5 style={{ fontSize: "x-small"}}> {spaceArray.length} Spaces | {folderArray.length} Folders | {folderlessListArray.length} Folderless Lists | {listArray.length} Lists</h5>
      </Row>
    
    </Container>
  );
}
