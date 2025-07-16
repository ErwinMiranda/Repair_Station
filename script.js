document.getElementById('upload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        displayTable(json);
    };
    reader.readAsArrayBuffer(file);
});

function displayTable(data) {
    let html = "<table>";
    data.forEach((row, rowIndex) => {
        html += "<tr>";
        row.forEach(cell => {
            // Use <th> for the first row (headers)
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
