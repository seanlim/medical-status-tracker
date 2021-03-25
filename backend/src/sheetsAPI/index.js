import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import { google } from 'googleapis';

export async function fetchMedicalStatuses() {
    const jwtClient = new google.auth.JWT(
        process.env.CLIENT_NAME,
        null,
        process.env.CLIENT_KEY.replace(/\\n/gm, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
    );
    await jwtClient.authorize();
    return getData(jwtClient);
}

// Coy, PL, initials, reasoning, status, start, end, duration
function parseRow(row) {
    if (row[0] === 'BNHQ') {
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
    const sheets = google.sheets({ version: 'v4', auth });

    return Promise.all([
        sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Animal!A2:H',
        }),
        sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Boron!A2:H',
        }),
        sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Bn!A2:H',
        }),
    ])
        .then((results) => results.map((r) => r.data.values))
        .then(flatten)
        .then((r) => r.map(parseRow))
        .then((r) => groupBy(r, 'coy'))
        .catch(console.error);
}
