const rowData = [
    { status: "Attack [AT]", topValues: {1: "3%", 2: "6%", 3: "9%", 4: "14%", 5: "19%", 6: "24%", 7: "34%", 8: "44%", 9: "54%", 10: "69%", 11: "84%", 12: "99%", 13: "114%", 14: "129%", 15: "144%"} },
    { status: "Critical [CT]", topValues: {1: "15%", 2: "30%", 3: "45%", 4: "70%", 5: "95%", 6: "120%", 7: "170%", 8: "220%", 9: "270%", 10: "345%", 11: "420%", 12: "495%", 13: "570%", 14: "645%", 15: "720%"} },
    { status: "Block [BL]", topValues: {1: "2%", 2: "4%", 3: "6%", 4: "9%", 5: "12%", 6: "15%", 7: "21%", 8: "27%", 9: "33%", 10: "42%", 11: "51%", 12: "60%", 13: "69%", 14: "78%", 15: "87%"} },
    { status: "Evasion [EV]", topValues: {1: "12%", 2: "24%", 3: "36%", 4: "56%", 5: "76%", 6: "96%", 7: "136%", 8: "176%", 9: "216%", 10: "276%", 11: "336%", 12: "369%", 13: "456%", 14: "516%", 15: "576%"} },
    { status: "Health [HP]", topValues: {1: "2%", 2: "4%", 3: "6%", 4: "9%", 5: "12%", 6: "15%", 7: "19%", 8: "23%", 9: "27%", 10: "31%", 11: "35%", 12: "39%", 13: "44%", 14: "49%", 15: "54%"} }
];

const table = document.getElementById('myTable');

function createDropdown(row, data) {
    const imageMap = {
        1: 'img/cld.png',
        2: 'img/cld.png',
        3: 'img/cld.png',
		4: 'img/clc.png',
		5: 'img/clc.png',
		6: 'img/clc.png',
		7: 'img/clb.png',
		8: 'img/clb.png',
		9: 'img/clb.png',
		10: 'img/cla.png',
		11: 'img/cla.png',
		12: 'img/cla.png',
		13: 'img/cls.png',
		14: 'img/cls.png',
        15: 'img/cls.png'
    };

    const select = document.createElement('select');

    for (let i = 1; i <= 15; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = `${i}<img src="${imageMap[i]}" alt="${i}" class="option-image">`;
        select.appendChild(option);
    }
    
    select.addEventListener('change', function() {
        updateTopValue(row, this.value, data.topValues);
    });

    return select;
}

function updateTopValue(row, value, topValues) {
    row.cells[2].textContent = topValues[value];
    checkTopStatus(row);
}

function createNumberInput(row, columnIndex, rowIndex) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 7;

    if (columnIndex === 3 && rowIndex === 2) {
        input.disabled = true;
        input.value = 'ไม่ต้องดูค่านี้';
        input.style.backgroundColor = '#f0f0f0';
        input.style.color = '#888';
    } else {
        input.addEventListener('input', function(e) {
            if (!/^(\d*\.?\d*)$/.test(e.target.value)) {
                alert("กรุณาใส่ตัวเลข");
                e.target.value = e.target.value.replace(/[^\d.]/g, '');
                e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
            }
            if (e.target.value.length > 7) {
                e.target.value = e.target.value.slice(0, 7);
            }
            calculatePercentage(row, rowIndex);
        });
    }

    return input;
}

function calculatePercentage(row, rowIndex) {
    const cloneValue = row.cells[3].querySelector('input').value;
    const initialValue = row.cells[4].querySelector('input').value;
    const percentageCell = row.cells[5];

    if (rowIndex === 2) { // แถวที่ 3 (index 2)
        percentageCell.textContent = initialValue ? initialValue + '%' : 'กรุณาใส่ค่า';
    } else if (cloneValue && initialValue) {
        const percentage = (cloneValue / initialValue) * 100;
        percentageCell.textContent = Math.round(percentage) + '%';
    } else {
        percentageCell.textContent = 'กรุณาใส่ค่า';
    }
    checkTopStatus(row);
}

function checkTopStatus(row) {
    const topValue = row.cells[2].textContent;
    const currentPercentage = row.cells[5].textContent;
    const statusCell = row.cells[6];

    if (topValue && currentPercentage && currentPercentage !== 'กรุณาใส่ค่า') {
        if (topValue === currentPercentage) {
            statusCell.textContent = 'TOP';
            statusCell.className = 'top';
        } else {
            statusCell.textContent = 'ยังไม่ TOP';
            statusCell.className = 'not-top';
        }
    } else {
        statusCell.textContent = '';
        statusCell.className = '';
    }
}

rowData.forEach(function(data, rowIndex) {
    const row = table.insertRow();
    for (let j = 0; j < 7; j++) {
        const cell = row.insertCell();
        if (j === 0) {
            cell.textContent = data.status;
        } else if (j === 1) {
            cell.appendChild(createDropdown(row, data));
        } else if (j === 3 || j === 4) {
            cell.appendChild(createNumberInput(row, j, rowIndex));
        } else if (j === 5) {
            cell.textContent = 'กรุณาใส่ค่า';
        }
    }
    updateTopValue(row, 1, data.topValues);
    calculatePercentage(row, rowIndex); // เพิ่มบรรทัดนี้
});

// เพิ่มหลังจากโค้ด JavaScript ที่มีอยู่
document.addEventListener('DOMContentLoaded', function() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        updateSelectImage(select, selectedOption);

        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            updateSelectImage(this, selectedOption);
        });
    });
});

function updateSelectImage(select, option) {
    const img = option.querySelector('img');
    if (img) {
        select.style.backgroundImage = `url('${img.src}')`;
        select.style.backgroundRepeat = 'no-repeat';
        select.style.backgroundPosition = 'right 5px center';
        select.style.backgroundSize = '20px 20px';
    }
}