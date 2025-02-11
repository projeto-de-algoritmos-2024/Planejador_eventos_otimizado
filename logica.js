let events = [];

function parseTimeToMinutes(time) {
    if (!time) return null;
    let [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function formatMinutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function addEvent() {
    let name = document.getElementById("event-name").value;
    let startTime = document.getElementById("event-start").value;
    let endTime = document.getElementById("event-end").value;
    let weight = parseInt(document.getElementById("event-weight").value);

    if (!name || !startTime || !endTime || isNaN(weight)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let start = parseTimeToMinutes(startTime);
    let end = parseTimeToMinutes(endTime);

    if (start >= end) {
        alert("O horário de início deve ser menor que o de término.");
        return;
    }

    events.push({ name, start, end, weight });
    events.sort((a, b) => a.end - b.end);
    updateEventList();
    
    document.getElementById("event-name").value = "";
    document.getElementById("event-start").value = "";
    document.getElementById("event-end").value = "";
    document.getElementById("event-weight").value = "";
}

function updateEventList() {
    let eventList = document.getElementById("event-list");
    eventList.innerHTML = "";
    events.forEach(event => {
        let li = document.createElement("li");
        li.textContent = `${event.name} | ${formatMinutesToTime(event.start)} - ${formatMinutesToTime(event.end)} | Importância: ${event.weight}`;
        eventList.appendChild(li);
    });
}

function findCompatible(events) {
    let p = new Array(events.length).fill(0);
    for (let j = 0; j < events.length; j++) {
        for (let i = j - 1; i >= 0; i--) {
            if (events[i].end <= events[j].start) {
                p[j] = i + 1;
                break;
            }
        }
    }
    return p;
}

function weightedIntervalScheduling() {
    let n = events.length;
    let p = findCompatible(events);
    let dp = new Array(n + 1).fill(0);
    let selectedEvents = new Array(n + 1).fill(null);

    for (let j = 1; j <= n; j++) {
        let includeEvent = events[j - 1].weight + dp[p[j - 1]];
        let excludeEvent = dp[j - 1];

        if (includeEvent > excludeEvent) {
            dp[j] = includeEvent;
            selectedEvents[j] = (selectedEvents[p[j - 1]] || []).concat(events[j - 1]);
        } else {
            dp[j] = excludeEvent;
            selectedEvents[j] = selectedEvents[j - 1];
        }
    }
    return selectedEvents[n] || [];
}

function optimizeSchedule() {
    if (events.length === 0) {
        alert("Nenhum evento adicionado!");
        return;
    }

    let optimizedEvents = weightedIntervalScheduling();
    let optimizedList = document.getElementById("optimized-list");
    optimizedList.innerHTML = "";

    optimizedEvents.forEach(event => {
        let li = document.createElement("li");
        li.textContent = `${event.name} | ${formatMinutesToTime(event.start)} - ${formatMinutesToTime(event.end)} | Importância: ${event.weight}`;
        optimizedList.appendChild(li);
    });
}
