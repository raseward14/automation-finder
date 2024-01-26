import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Col, ContainerProps, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Team, Space, Folder, List } from "../models/workspace_interface";

type workspacePropList = {
  teamCallback: (a: string) => void;
};

export default function Workspace({ teamCallback }: workspacePropList) {
  let { token } = useParams();
  const navigate = useNavigate();
  //containers for response object
  const [teamData, setTeamData] = useState<JSON>();
  const [spaceData, setSpaceData] = useState<JSON>();
  const [folderData, setFolderData] = useState<JSON>();
  const [folderlessListData, setFolderlessListData] = useState<JSON>();
  const [listData, setListData] = useState<JSON>();
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  //containers for
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const [spaceArray, setSpaceArray] = useState<Space[]>([]);
  const [folderArray, setFolderArray] = useState<Folder[]>([]);
  const [folderlessListArray, setFolderlessListArray] = useState<List[]>([]);
  const [listArray, setListArray] = useState<List[]>([]);

  //
  const [clickedTeam, setClickedTeam] = useState<JSON>();
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
          setListArray((listArray) => [...listArray, ...indvidualArray]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      const jsonData = JSON.parse(data);
      const teamArr = jsonData.teams;
      const teamObject = teamArr.filter((team: any) => {
        if (team.name === clickedTeam) {
          return team;
        }
      });
      teamCallback(teamObject);
      navigate("/automations");
    }
  };

  useEffect(() => {
    sendTeam(teamData);
  }, [clickedTeam]);

  useEffect(() => {
    if (teamData !== undefined) {
      createButtons(teamData);
    }
  }, [teamData]);

  useEffect(() => {
    GetTeams();
  }, []);

  useEffect(() => {
    for (var i = 0; i < spaceArray.length; i++) {
      GetFolders(spaceArray[i].id);
      GetFolderlessLists(spaceArray[i].id);
    }
  }, [spaceArray]);

  useEffect(() => {
    for (var i = 0; i < folderArray.length; i++) {
      GetLists(folderArray[i].id);
    }
  }, [folderArray]);

  const style = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      justifyContent: "center",
      width: "100vw",
      margin: "0 auto",
    },
    button: {
      width: "auto", // Make the button only as wide as needed
      margin: "5px", // Optional: Add margin for spacing
    },
  };

  return (
    <Container fluid style={style.container as React.CSSProperties}>
      <Row></Row>
      <Row style={style.row}>
        <Col id="hierarchy_col">
          <h1>Select a Team</h1>
          {teamArray?.map((team: any, i: number) => (
            <Button
              style={style.button}
              variant={workspacePressed == i ? "dark" : "outline-dark"}
              key={i}
              onClick={() => {
                setClickedTeam(team);
                setSpaceArray([]);
                setFolderArray([]);
                setFolderlessListArray([]);
                setListArray([]);
                GetSpaces(team.id);
                i === workspacePressed
                  ? setWorkspacePressed(-1)
                  : setWorkspacePressed(i);
              }}>
              {`${team.name} id: ${team.id}`}
            </Button>
          ))}
        </Col>
      </Row>
      {workspacePressed === -1 ? (
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
      )}
    </Container>
  );
}
