import { Request, Response } from 'express';
const AutomationRoutes = require('express').Router()

// get shard
AutomationRoutes.post(
  '/shard',
  async (req: Request, res: Response): Promise<any> => {
    const teamId = req.body.teamId;
    try {
      const response = await fetch(
        `https://app.clickup.com/shard/v1/handshake/${teamId}`,
        { method: "GET" }
      );
      const data = await response.json();
      const shard = data.shardId;
      res.status(200).json(shard);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);


// get space automations
AutomationRoutes.post(
  '/space',
  async (req: Request, res: Response): Promise<any> => {
    const shard = req.body.shard;
    const spaceId = req.body.spaceId;
    const token = req.body.bearer;

    try {
      const response = await fetch(
        `https://${shard}.clickup.com/automation/filters/project/${spaceId}/workflow?paging=true`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer: ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.text();
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// get folder automations
AutomationRoutes.post(
  '/folder',
  async (req: Request, res: Response): Promise<any> => {
    const shard = req.body.shard;
    const folderId = req.body.folderId;
    const token = req.body.bearer;

    try {
      const response = await fetch(
        `https://${shard}.clickup.com/automation/filters/category/${folderId}/workflow?paging=true`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer: ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.text();
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// get list automations
AutomationRoutes.post(
  '/list',
  async (req: Request, res: Response): Promise<any> => {
    const shard = req.body.shard;
    const listId = req.body.listId;
    const token = req.body.bearer;

    try {
      const response = await fetch(
        `https://${shard}.clickup.com/automation/filters/category/${listId}/workflow?paging=true`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer: ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.text();
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default AutomationRoutes;

