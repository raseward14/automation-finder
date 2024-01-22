import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Col, ContainerProps, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Space, Team } from "../models/workspace_interface";

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
  //containers for
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const [spaceArray, setSpaceArray] = useState<Space[]>([]);
  const [folderArray, setFolderArray] = useState<Object[]>([]);
  const [folderlessListArray, setFolderlessListArray] = useState<Object[]>([]);
  const [listArray, setListArray] = useState<Object[]>();
  //
  const [clickedTeam, setClickedTeam] = useState<JSON>();

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
          setSpaceArray([]);
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

  const GetFolders = async (data: any): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/folders`, {
        token: token,
      })
      .then((resp) => {
        setTeamData(resp.data);
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const GetFolderlessLists = async (data: any): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/folderless/lists`, {
        token: token,
      })
      .then((resp) => {
        setTeamData(resp.data);
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const GetLists = async (data: any): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/lists`, {
        token: token,
      })
      .then((resp) => {
        setTeamData(resp.data);
        console.log(resp.data);
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
    if (teamArray!.length > 0) {
      for (var i = 0; i < teamArray!.length; i++) {
        GetSpaces(teamArray![i].id);
      }
    }
  }, [teamArray]);

  return (
    <Container fluid>
      <Row>
        <Col xxl={6}>
          {teamArray?.map((team: any, i: number) => (
            <Button
              key={i}
              onClick={() => {
                setClickedTeam(team);
              }}>
              {`${team.name} id: ${team.id}`}
            </Button>
          ))}
        </Col>
        <Col xxl={6}>
          {spaceArray?.map((space: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button key={i} onClick={() => {}}>
                  {`${space.name} id: ${space.id}`}
                </Button>
              </td>
            </tr>
          ))}
        </Col>
      </Row>
      {/* <table>
        <tbody>
          <th>Click Workspace to find Automation</th>
          {teamArray?.map((team: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button
                  key={i}
                  onClick={() => {
                    setClickedTeam(team);
                  }}>
                  {`${team.name} id: ${team.id}`}
                </Button>
              </td>
            </tr>
          ))}
          {spaceArray?.map((space: any, i: number) => (
            <tr key={i}>
              <td key={i}>
                <Button key={i} onClick={() => {}}>
                  {`${space.name} id: ${space.id}`}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </Container>
  );
}
