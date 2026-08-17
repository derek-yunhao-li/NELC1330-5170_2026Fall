// Published Google Sheets TSV URL.
// After publishing your schedule sheet, paste its TSV URL between the quotes below.
const tsvUrl = '';

async function loadTsvData() {
  const tableContainer = document.getElementById('table-container');

  if (!tsvUrl) {
    tableContainer.innerHTML = '<p><em>Schedule sheet is not connected yet.</em></p>';
    return;
  }

  try {
    const response = await fetch(tsvUrl, { cache: 'no-store' });
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
