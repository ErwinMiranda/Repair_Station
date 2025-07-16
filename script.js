// Initialize jsPDF
const { jsPDF } = window.jspdf;

document.getElementById('upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

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
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1, 
                defval: "",
                range: 0
            });

            const extractedData = jsonData.map(row => {
                const paddedRow = Array(7).fill("").map((_, i) => row[i] || "");
                return paddedRow.slice(0, 7);
            });

            displayTable(extractedData);
            addPDFButton(); // This adds the button after table is created

        } catch (error) {
            alert("Error parsing file: " + error.message);
            console.error(error);
        }
    };
    reader.readAsArrayBuffer(file);
});

function displayTable(data) {
    const output = document.getElementById('output');
    if (!data || data.length === 0) {
        output.innerHTML = "<p>No data found.</p>";
        return;
    }

    let html = "<table id='data-table'>";
    data.forEach((row, rowIndex) => {
        html += "<tr>";
        row.forEach((cell, colIndex) => {
            const tag = rowIndex === 0 ? "th" : "td";
            html += `<${tag}>${cell}</${tag}>`;
        });
        html += "</tr>";
    });
    html += "</table>";
    output.innerHTML = html;
}

function addPDFButton() {
    // Remove existing button if it exists
    const existingBtn = document.getElementById('pdf-export');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create new button
    const btn = document.createElement('button');
    btn.id = 'pdf-export';
    btn.textContent = 'Export to PDF';
    btn.addEventListener('click', exportToPDF);
    
    // Insert after the upload input
    const uploadInput = document.getElementById('upload');
    uploadInput.insertAdjacentElement('afterend', btn);
}

function exportToPDF() {
    const table = document.getElementById('data-table');
    if (!table) {
        alert("No data to export!");
        return;
    }

    const title = "Excel Data (Columns A-G)";
    const fileName = "extracted_columns.pdf";
    const dateStr = new Date().toLocaleDateString();
    
    html2canvas(table).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'mm'
        });
        
        // Add title and date
        pdf.setFontSize(16);
        pdf.text(title, 10, 10);
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${dateStr}`, 10, 15);
        
        // Calculate dimensions
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Add table image
        pdf.addImage(imgData, 'PNG', 10, 20, pdfWidth, pdfHeight);
        pdf.save(fileName);
    });
}
