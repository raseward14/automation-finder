import { Router, Request, Response } from "express";

export const WorkspaceRoutes = Router();

//get a list of authorized workspaces
WorkspaceRoutes.get(
  "/workspace/teams",
  async (req: Request, res: Response): Promise<any> => {
    const resp = await fetch(`https://api.clickup.com/api/v2/team`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.body.token}`,
      },
    });

    const data = await resp.text();
    console.log(data);
    res.status(200).json(data);
  }
);

//get list of Spaces in a Workspace
WorkspaceRoutes.get(
  "/workspace/spaces",
  async (req: Request, res: Response): Promise<any> => {
    const query = new URLSearchParams({
      archived: "false",
    }).toString();

    const teamId = req.body.teamId;
    const resp = await fetch(
      `https://api.clickup.com/api/v2/team/${teamId}/space?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.body.token}`,
        },
      }
    );

    const data = await resp.text();
    console.log(data);
    res.status(200).json(data);
  }
);

//get list of Folders in a Workspace
WorkspaceRoutes.get(
  "/workspace/folders",
  async (req: Request, res: Response): Promise<any> => {
    const query = new URLSearchParams({
      archived: "false",
    }).toString();

    const spaceId = req.body.spaceId;
    const resp = await fetch(
      `https://api.clickup.com/api/v2/space/${spaceId}/folder?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.body.token}`,
        },
      }
    );

    const data = await resp.text();
    console.log(data);
    res.status(200).json(data);
  }
);

//get list of folderless lists
WorkspaceRoutes.get(
  "/workspace/folderless/lists",
  async (req: Request, res: Response): Promise<any> => {
    const query = new URLSearchParams({
      archived: "false",
    }).toString();

    const spaceId = req.body.spaceId;
    const resp = await fetch(
      `https://api.clickup.com/api/v2/space/${spaceId}/list?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.body.token}`,
        },
      }
    );

    const data = await resp.text();
    console.log(data);
    res.status(200).json(data);
  }
);

//get list of lists
WorkspaceRoutes.get(
  "/workspace/lists",
  async (req: Request, res: Response): Promise<any> => {
    const query = new URLSearchParams({
      archived: "false",
    }).toString();

    const folderId = req.body.folderId;
    const resp = await fetch(
      `https://api.clickup.com/api/v2/folder/${folderId}/list?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.body.token}`,
        },
      }
    );

    const data = await resp.text();
    console.log(data);
    res.status(200).json(data);
  }
);

//get list of tasks
WorkspaceRoutes.get(
  "/workspace/tasks",
  async (req: Request, res: Response): Promise<any> => {
    const query = new URLSearchParams({
      archived: "false",
      // include_markdown_description: 'true',
      // page: '0',
      // order_by: 'string',
      // reverse: 'true',
      // subtasks: 'true',
      // statuses: 'string',
      // include_closed: 'true',
      // assignees: 'string',
      // tags: 'string',
      // due_date_gt: '0',
      // due_date_lt: '0',
      // date_created_gt: '0',
      // date_created_lt: '0',
      // date_updated_gt: '0',
      // date_updated_lt: '0',
      // date_done_gt: '0',
      // date_done_lt: '0',
      // custom_fields: 'string',
      // custom_items: '0'
    }).toString();

    const listId = req.body.listId;
    const resp = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.body.token}`,
        },
      }
    );

    const data = await resp.text();
    console.log(data);
    res.status(200).json(data);
  }
);
