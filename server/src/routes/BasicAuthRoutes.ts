import { Router, Request, Response } from "express";
import base64url from "base64url";

// export const WorkspaceRoutes = Router();
const BasicAuthRoutes = require("express").Router();

//get JWT
BasicAuthRoutes.post(
  "/basic",
  async (req: Request, res: Response): Promise<any> => {
    var encode = base64url(req.body.email + ":" + req.body.password);
    //cGJpc2hvcEBjbGlja3VwLmNvbTpQaSR0aW5lODc4OA==
    console.log(encode);
    const resp = await fetch(`https://app.clickup.com/auth/v1/login?include_teams=true`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encode}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        email: req.body.email,
        password: req.body.password,
      }),
    });
    const data = await resp.json();
    // const token = data.token;
    res.status(200).json(data);
  }
);


export default BasicAuthRoutes;
