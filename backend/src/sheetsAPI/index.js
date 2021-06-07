import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import moment from 'moment-timezone';
import { google } from 'googleapis';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';

export async function createGoogleSheetsClient() {
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_NAME,
    null,
    process.env.CLIENT_KEY.replace(/\\n/gm, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  await jwtClient.authorize();
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  return sheets;
}

export async function getMedicalStatuses(sheets) {
  const currentDate = moment.tz('Asia/Singapore');

  return sheets.spreadsheets.values
    .get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Master!A2:L',
    })
    .then((results) => results.data.values)
    .then((rows) => rows.map((row) => parseRow(row, currentDate)));
}

function parseRow(row, currentDate) {
  const endDate = moment(row[6], 'DD-MMM-YYYY');
  return {
    coy: row[0],
    platoon: row[1],
    name: row[2],
    reason: row[3],
    status: row[4],
    start: row[5],
    end: row[6],
    numberOfDays: row[7],
    recordID: row[8],
    recordLocation: row[9],
    dateSubmit: row[10],
    approved: row[11],
    // Computed Fields
    _statusActive: row[6] === 'PERM' || currentDate < endDate,
    _perm: row[6] === 'PERM',
  };
}
