
import { Order, GPData } from '../types';

const SHEET_ID = '1Q-FWc9tnZhhLtn0kpp_9HmvPR9g_8VQOD12WBWPzboM';
const SHEET_NAME = 'Latam_Reserve'; // Corrected: Removed space before underscore
// Fetching columns A through I as specified in the user's schema
const SHEET_RANGE = 'A:I';

const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&range=${SHEET_RANGE}&t=${new Date().getTime()}`;

// Helper to parse Google's special date format "Date(YYYY,M,D)"
const parseGoogleDate = (googleDate: string): string => {
    if (!googleDate || !googleDate.startsWith('Date(')) {
        // Return a parsable date string as a fallback.
        return new Date().toISOString();
    }
    const parts = googleDate.match(/\d+/g);
    if (parts && parts.length === 3) {
        // Parts are Year, Month, Day. Month is 0-indexed in JS Date constructor.
        // Google Sheet's format provides the month 0-indexed as well (e.g., 0 for January).
        return new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])).toISOString();
    }
    return new Date().toISOString(); // Fallback for safety
};


export const fetchOrders = async (): Promise<Order[]> => {
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let responseText = await response.text();
        
        // Google Sheets JSONP response is wrapped in a function call. We need to extract the JSON.
        if (!responseText.includes('google.visualization.Query.setResponse')) {
            // This indicates an error response from Google which is often HTML, not the expected JSONP
            throw new Error("Invalid response format from Google Sheet. Check if the sheet name is correct and it's public.");
        }
        const jsonString = responseText.substring(responseText.indexOf('(') + 1, responseText.lastIndexOf(')'));
        
        const json = JSON.parse(jsonString);

        if (!json.table || !json.table.rows) {
            // Can happen with an empty sheet. Return empty array gracefully.
            return [];
        }

        // FIX: Removed .slice(1). The gviz API response `rows` array does not contain headers.
        // This was the bug causing the first row of data to be skipped.
        const rows = json.table.rows;

        const orders: Order[] = rows.map((row: any) => {
            // 'c' is an array of cells for the row
            const cells = row.c;

            // Gracefully handle potentially null or missing cells for each column
            const order: Order = {
                // Handle date: if cell is missing or null, it's problematic. Fallback to now.
                date: (cells && cells[0]?.v) ? parseGoogleDate(cells[0].v) : new Date().toISOString(),
                // Handle text: if cell is missing, null, or empty, default to 'N/A'.
                orderFy: (cells && cells[1]?.v) ?? 'N/A',
                partyName: (cells && cells[2]?.v) ?? 'N/A',
                // Handle numbers: if cell is missing or null, default to 0.
                // Google Sheets API returns numbers in 'v' (value).
                amount: (cells && cells[3]?.v) ?? 0,
                reserve: (cells && cells[4]?.v) ?? 0,
                total: (cells && cells[5]?.v) ?? 0,
                // Handle text
                orderNo: (cells && cells[6]?.v) ?? 'N/A',
                segment: (cells && cells[7]?.v) ?? 'N/A',
                // Handle numbers
                reqReserve12: (cells && cells[8]?.v) ?? 0,
            };
            return order;
        }).filter(order => order.partyName && order.partyName !== 'N/A' && order.partyName.trim() !== '');

        return orders;

    } catch (error) {
        console.error("Failed to fetch or parse Google Sheet data:", error);
        throw error;
    }
};

const GP_SHEET_NAME = 'Country Wise Highest Selling GP';
const GP_SHEET_RANGE = 'A:F';

const GOOGLE_GP_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(GP_SHEET_NAME)}&range=${GP_SHEET_RANGE}&t=${new Date().getTime()}`;


export const fetchGPData = async (): Promise<GPData[]> => {
    try {
        const response = await fetch(GOOGLE_GP_SHEET_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let responseText = await response.text();
        
        if (!responseText.includes('google.visualization.Query.setResponse')) {
            throw new Error("Invalid response format from Google Sheet. Check if the sheet name is correct and it's public.");
        }
        const jsonString = responseText.substring(responseText.indexOf('(') + 1, responseText.lastIndexOf(')'));
        
        const json = JSON.parse(jsonString);

        if (!json.table || !json.table.rows) {
            return [];
        }

        const rows = json.table.rows;

        const gpData: GPData[] = rows.map((row: any) => {
            const cells = row.c;
            const data: GPData = {
                country: (cells && cells[0]?.v) ?? 'N/A',
                segment: (cells && cells[1]?.v) ?? 'N/A',
                bonhorfferCode: (cells && cells[2]?.v) ?? 'N/A',
                exportValue: (cells && cells[3]?.v) ?? 0,
                importValue: (cells && cells[4]?.v) ?? 0,
                gp: (cells && cells[5]?.v) ?? 0,
            };
            return data;
        }).filter(item => item.country && item.country !== 'N/A' && item.country.trim() !== '');

        return gpData;

    } catch (error) {
        console.error("Failed to fetch or parse Google Sheet data for GP:", error);
        throw error;
    }
};
