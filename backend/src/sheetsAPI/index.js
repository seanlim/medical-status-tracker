import moment from 'moment-timezone';
import { google } from 'googleapis';

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

export async function updateApprovalStatus(sheets, index, status) {
  return sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `Master!L${index + 2}`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[status]],
    },
  });
}

export async function getMedicalStatuses(sheets) {
  const currentDate = moment.tz('Asia/Singapore');

  return sheets.spreadsheets.values
    .get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Master!A2:L',
    })
    .then((results) => results.data.values)
    .then((rows) =>
      rows.map((row, index) => parseRow(row, currentDate, index))
    );
}

function parseRow(row, currentDate, index) {
  const endDate = moment(row[6], 'DD-MMM-YYYY');
  return {
    id: index,
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
    _approved: ApprovedMap[row[11]],
    _statusActive:
      row[6] === 'PERM' ||
      currentDate < endDate ||
      currentDate.diff(endDate, 'days') < 1,
    _lightDuty: endDate && currentDate.diff(endDate, 'days') < 2,
    _perm: row[6] === 'PERM',
  };
}

const ApprovedMap = {
  0: 'PENDING',
  1: 'APPROVED',
  2: 'REJECTED',
};
