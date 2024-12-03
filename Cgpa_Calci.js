document.getElementById("addRow").addEventListener("click", () => {
    const table = document.getElementById("cgpaTable").querySelector("tbody");
    const newRow = document.createElement("tr");
  
    newRow.innerHTML = `
        <td><input type="text" placeholder="Course Name" /></td>
        <td>
          <select>
            <option value="5">A</option>
            <option value="4">B</option>
            <option value="3">C</option>
            <option value="2">D</option>
            <option value="1">E</option>
            <option value="0">F</option>
          </select>
        </td>
        <td><input type="number" min="1" max="6" placeholder="Unit" /></td>
        <td><button class="removeRow">-</button></td>
      `;
  
    table.appendChild(newRow);
  
    // Attach click event for removing the row
    newRow.querySelector(".removeRow").addEventListener("click", () => {
      newRow.remove();
    });
  });
  
  document.getElementById("calculate").addEventListener("click", () => {
    const rows = document.querySelectorAll("#cgpaTable tbody tr");
    let totalUnits = 0;
    let totalPoints = 0;
  
    const data = [];
  
    rows.forEach((row) => {
      const course = row.querySelector("input[type='text']").value;
      const grade = parseFloat(row.querySelector("select").value);
      const unitLoad = parseFloat(
        row.querySelector("input[type='number']").value
      );
  
      if (course && !isNaN(grade) && !isNaN(unitLoad)) {
        totalUnits += unitLoad;
        totalPoints += grade * unitLoad;
        data.push({ course, grade, unitLoad });
      }
    });
  
    const cgpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";
    document.getElementById("result").innerText = `CGPA: ${cgpa}`;
  
    if (data.length > 0) {
      document.getElementById("downloadCSV").style.display = "inline";
      document.getElementById("downloadPDF").style.display = "inline";
  
      document.getElementById("downloadCSV").onclick = () =>
        downloadCSV(data, cgpa);
      document.getElementById("downloadPDF").onclick = () =>
        downloadPDF(data, cgpa);
    }
  });
  
  function downloadCSV(data, cgpa) {
    let csvContent = "Course,Grade,Unit Load\n";
    data.forEach((row) => {
      csvContent += `${row.course},${row.grade},${row.unitLoad}\n`;
    });
    csvContent += `\nCGPA:,${cgpa}`;
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cgpa.csv";
    link.click();
  }
  
  function downloadPDF(data, cgpa) {
    const doc = new jsPDF();
    let y = 10;
  
    doc.text("Course", 10, y);
    doc.text("Grade", 60, y);
    doc.text("Unit Load", 110, y);
  
    y += 10;
    data.forEach((row) => {
      doc.text(row.course, 10, y);
      doc.text(row.grade.toString(), 60, y);
      doc.text(row.unitLoad.toString(), 110, y);
      y += 10;
    });
  
    y += 10;
    doc.text(`CGPA: ${cgpa}`, 10, y);
  
    doc.save("cgpa.pdf");
  }