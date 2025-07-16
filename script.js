document.getElementById('upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        alert("Please upload an Excel file (.xlsx or .xls)!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            if (workbook.SheetNames.length === 0) {
                alert("No sheets found in the file!");
                return;
            }

            const firstSheet = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheet];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            displayTable(json);
            addExportButton(); // Optional: Add export button
        } catch (error) {
            alert("Error parsing file: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
});

function displayTable(data) {
    if (!data || data.length === 0) {
        document.getElementById('output').innerHTML = "<p>No data found.</p>";
        return;
    }

    let html = "<table>";
    data.forEach((row, rowIndex) => {
        html += "<tr>";
        row.forEach(cell => {
            if (rowIndex === 0) {
                html += `<th>${cell !== undefined ? cell : ""}</th>`;
            } else {
                html += `<td>${cell !== undefined ? cell : ""}</td>`;
            }
        });
        html += "</tr>";
    });
    html += "</table>";
    document.getElementById('output').innerHTML = html;
}

// Optional: Export functionality
function addExportButton() {
    if (document.getElementById('exportBtn')) return;

    const button = document.createElement('button');
    button.id = 'exportBtn';
    button.textContent = 'Export to Excel';
    button.style.margin = '10px 0';
    button.onclick = exportToExcel;
    document.body.insertBefore(button, document.getElementById('output'));
}

function exportToExcel() {
    const table = document.querySelector('#output table');
    if (!table) {
        alert("No table to export!");
        return;
    }
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, 'exported_data.xlsx');
}
