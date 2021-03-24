import fs from "fs";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import readline from "readline";
import { google } from "googleapis";

import promisify from "../promisify";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const TOKEN_PATH = "token.json";

export async function fetchMedicalStatuses() {
  // Authorize a client with credentials, then call the Google Sheets API.
  const authorizePromise = promisify(authorize);
  try {
    const authClient = await authorizePromise(
      JSON.parse(process.env.CREDENTIALS)
    );
    return getData(authClient);
  } catch {
    console.error(err);
  }
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(null, oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err, null);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return callback(err, null);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(null, oAuth2Client);
    });
  });
}

// Coy, PL, initials, reasoning, status, start, end, duration
function parseRow(row) {
  if (row[0] === "BNHQ") {
    return {
      coy: row[0],
      platoon: null,
      initials: row[1],
      reasoning: row[2],
      status: row[3],
      start: row[4],
      end: row[5],
      duration: row[6],
    };
  }
  return {
    coy: row[0],
    platoon: row[1],
    initials: row[2],
    reasoning: row[3],
    status: row[4],
    start: row[5],
    end: row[6],
    duration: row[7],
  };
}

function getData(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  return Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Animal!A2:H",
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Boron!A2:H",
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Bn!A2:H",
    }),
  ])
    .then((results) => results.map((r) => r.data.values))
    .then(flatten)
    .then((r) => r.map(parseRow))
    .then((r) => groupBy(r, "coy"))
    .catch(console.error);
}
