// Published Google Sheets TSV URL.
const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRl9xWp_g1v4ErctSEfy0qzkODA8NhFNsaRNHiO06LQqsUlrBuYD1CaQ_QextlNoRE6hdvQ6FiPoX1o/pub?gid=0&single=true&output=tsv';

async function loadTsvData() {
  const tableContainer = document.getElementById('table-container');

  if (!tsvUrl) {
    tableContainer.innerHTML = '<p><em>Schedule sheet is not connected yet.</em></p>';
    return;
  }

  try {
    // Add a unique query parameter on every load so browser/CDN caches cannot
    // reuse an older copy of the published TSV response.
    const separator = tsvUrl.includes('?') ? '&' : '?';
    const freshUrl = `${tsvUrl}${separator}_=${Date.now()}`;

    const response = await fetch(freshUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const tsvData = await response.text();
    tableContainer.innerHTML = convertTsvToHtmlTable(tsvData);
  } catch (error) {
    console.error('Error loading schedule:', error);
    tableContainer.innerHTML = '<p><em>The schedule could not be loaded. Please try again later.</em></p>';
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function convertTsvToHtmlTable(tsv) {
  const rows = tsv
    .split(/\r?\n/)
    .filter(row => row.trim() !== '');

  if (rows.length === 0) {
    return '<p><em>No schedule entries yet.</em></p>';
  }

  let tableHtml = '<table>';

  rows.forEach((row, rowIndex) => {
    const cells = row.split('\t');
    tableHtml += '<tr>';

    cells.forEach(cell => {
      const tag = rowIndex === 0 ? 'th' : 'td';
      const cellContent = escapeHtml(cell.trim());
      tableHtml += `<${tag}>${cellContent}</${tag}>`;
    });

    tableHtml += '</tr>';
  });

  tableHtml += '</table>';
  return tableHtml;
}

window.addEventListener('DOMContentLoaded', loadTsvData);
