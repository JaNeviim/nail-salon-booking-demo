window.addEventListener('load', () => {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
});

const dayBtns = document.querySelectorAll(".day-btn");
const dayInputs = [...document.querySelectorAll(".day-input")];
const timeInputs = document.querySelectorAll(".time-input");

let dayCounter = 0;

const translateDays = {
    0: "Ne",
    1: "Po",
    2: "Ut",
    3: "St",
    4: "Št",
    5: "Pi",
    6: "So"
}

dayBtns.forEach((dayBtn) => {
    let date = new Date();
    date.setDate(date.getDate() + dayCounter);
    dayInputs[dayCounter].value = date.toLocaleDateString("sv-SE", {
    timeZone: "Europe/Prague"});
    dayBtn.textContent = date.toLocaleDateString("sk-SK", {weekday: "short", day: "numeric", month: "numeric"})
    dayCounter++;
})

let bookingsData = [];

async function selectQuerry() {
    const res = await fetch("/api/booking");
    const data = await res.json();
    bookingsData = data.slice();
    setChangeEvents();
}

function setChangeEvents() {
    dayInputs.forEach((dayInput) => {
        dayInput.addEventListener("change", (e) => {
            timeInputs.forEach((timeInput) => {timeInput.disabled = false;});
            for (let obj of bookingsData) {
                console.log(bookingsData)
                if (obj.date == e.target.value) {
                    for (let timeInput of timeInputs) {
                        if (timeInput.value == obj.time) {
                            timeInput.disabled = true;
                            timeInput.checked = false;
                        }
                    }   
                }
            }
        })
    })
}

selectQuerry();