let studentCount = 1; // Boshlang'ich raqam

// Yangi o'quvchi qatori qo'shish funksiyasi
function addStudentRow() {
    const table = document.getElementById("progressTable").getElementsByTagName('tbody')[0];
    
    let newRow = table.insertRow();
    newRow.innerHTML = 
        `<td contenteditable="true">Student ${studentCount + 1}</td>
        <td contenteditable="true">0</td>
        <td contenteditable="true">0</td>
        <td contenteditable="true">0</td>
        <td contenteditable="true">0</td>
        <td contenteditable="true">0</td>
        <td>0</td>
        <td><button onclick="markAbsent(this)">K</button></td>
    `;
    studentCount++;
}

// Haftalik o'rtacha natijalarni hisoblash funksiyasi
function calculateAverages() {
    const table = document.getElementById("progressTable");
    const rows = table.getElementsByTagName('tbody')[0].rows;
    
    for (let i = 0; i < rows.length; i++) {
        let vocab = parseFloat(rows[i].cells[1].textContent) || 0;
        let speaking = parseFloat(rows[i].cells[2].textContent) || 0;
        let reading = parseFloat(rows[i].cells[3].textContent) || 0;
        let listening = parseFloat(rows[i].cells[4].textContent) || 0;
        let practise = parseFloat(rows[i].cells[5].textContent) || 0;

        let average = (vocab + speaking + reading + listening + practise) / 5;
        rows[i].cells[6].textContent = average.toFixed(2);
        
        // Ranglarni belgilash
        if (average < 40) {
            rows[i].style.backgroundColor = "red";
            rows[i].cells[6].textContent += " (Juda past)";
        } else {
            rows[i].style.backgroundColor = "aqua";
        }

        // Har bir o'quvchining foizini Telegramga yuborish
        let studentName = rows[i].cells[0].textContent;
        let message = `${studentName}: ${average.toFixed(2)}%`;
        sendTelegramMessage(message);  // Har bir o'quvchi uchun xabar yuborish
    }
}

// Telegramga xabar yuborish funksiyasi
function sendTelegramMessage(message) {
    const botToken = '7415072539:AAECefyAzvQxGt3iZTpHA6CfH-Tm7Atbcpg'; // O'zingizning bot tokeningizni joylashtiring
    const chatId = '7024369179'; // O'zingizning chat ID'ingizni joylashtiring

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message,
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log("Xabar Telegramga yuborildi.");
        } else {
            console.error("Xabar yuborishda xato yuz berdi.");
        }
    })
    .catch(error => {
        console.error("Xato: " + error.message);
    });
}

// Haftalik o'rtacha natijalarni yuborish funksiyasi
function sendWeeklyAverages() {
    const table = document.getElementById("progressTable");
    const rows = table.getElementsByTagName('tbody')[0].rows;
    let message = "Haftalik O'rtacha Natijalar:\n";

    for (let i = 0; i < rows.length; i++) {
        let studentName = rows[i].cells[0].textContent;
        let average = rows[i].cells[6].textContent;
        message += `${studentName}: ${average}\n`;
    }

    sendTelegramMessage(message);
}

// 30 foizdan kam ball to'plagan o'quvchilarni Excel formatida saqlash funksiyasi
function downloadExcel() {
    const table = document.getElementById("progressTable");
    const rows = table.getElementsByTagName('tbody')[0].rows;
    let lowScorers = [];

    for (let i = 0; i < rows.length; i++) {
        let average = parseFloat(rows[i].cells[6].textContent) || 0;
        if (average < 30) {
            let studentData = [];
            for (let j = 0; j < rows[i].cells.length - 1; j++) {
                studentData.push(rows[i].cells[j].textContent);}
                lowScorers.push(studentData);
            }
        }
        if (lowScorers.length > 0) {
            let workbook = XLSX.utils.book_new();
            let worksheet = XLSX.utils.aoa_to_sheet([["Ism", "Vocab", "Speaking", "Reading", "Listening", "Practice", "O'rtacha"]].concat(lowScorers));
            XLSX.utils.book_append_sheet(workbook, worksheet, "Low Scorers");
            XLSX.writeFile(workbook, 'LowScorers.xlsx');
        } else {
            alert("30 foizdan kam ball to'plagan o'quvchi yo'q.");
        }
    }
    
    // Kelmagan tugmasini bosganda qatorni muzlatish
    function markAbsent(button) {
        const row = button.parentElement.parentElement;
        row.style.backgroundColor = "gray"; // Muzlatish rangi
        row.cells[0].textContent += " (Kelmagan)";
        row.cells[1].textContent = "N/A"; // Barcha foizlarni N/A ga o'zgartirish
        row.cells[2].textContent = "N/A";
        row.cells[3].textContent = "N/A";
        row.cells[4].textContent = "N/A";
        row.cells[5].textContent = "N/A";
        row.cells[6].textContent = "N/A";
    }
    
    // Sanani ko'rsatish
    function displayCurrentDate() {
        const currentDate = new Date();
        document.getElementById("currentDate").textContent = currentDate.toLocaleDateString();
    }
    
    // Sahna yuklanganda sanani ko'rsatish
    window.onload = displayCurrentDate;