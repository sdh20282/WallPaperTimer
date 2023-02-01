const day = document.querySelector('#days');
const hour = document.querySelector('#hours');
const minute = document.querySelector('#minutes');
const second = document.querySelector('#seconds');

let timerId;
const daySecond = 24 * 60 * 60;
const hourSecond = 60 * 60;
const minuteSecond = 60;

const addZero = (number) => {
    if (number < 10) {
        return '0' + number;
    }

    return number;
}

const renderCalendar = ({ thisMonth, today, currentYear, currentMonth, currentDate }) => {
    currentYear = thisMonth.getFullYear();
    currentMonth = thisMonth.getMonth();
    currentDate = thisMonth.getDate();

    const startDay = new Date(currentYear, currentMonth, 0);
    const prevDate = startDay.getDate();
    const prevDay = startDay.getDay();

    const endDay = new Date(currentYear, currentMonth + 1, 0);
    const nextDate = endDay.getDate();
    const nextDay = endDay.getDay();

    document.querySelector('.calendarTitle').textContent = currentYear + '.' + (currentMonth + 1);

    const calendar = document.querySelector('.dates');
    calendar.innerHTML = '';

    for (let i = prevDate - prevDay; i <= prevDate; i++) {
        const li = document.createElement('li');
        const button = document.createElement('button');

        li.classList.add('day');
        li.classList.add('prev');
        li.classList.add('disable');
        li.appendChild(button);

        button.classList.add('dayButton');
        button.textContent = i;

        calendar.appendChild(li);
    }
    // 이번달
    for (let i = 1; i <= nextDate; i++) {
        const li = document.createElement('li');
        const button = document.createElement('button');

        li.classList.add('day');
        li.classList.add('current');
        li.appendChild(button);

        button.classList.add('dayButton');
        button.dataset.time = new Date(currentYear, currentMonth, i).getTime();
        button.textContent = i;

        button.addEventListener('click', async (e) => {
            localStorage.setItem('targetDate', e.target.dataset.time);
            document.querySelector('.calendarBackground').style.display = 'none';
            clearInterval(timerId);

            startTimer();
        })

        calendar.appendChild(li);
    }

    // 다음달
    for (let i = 1; i <= (7 - (nextDay + 1) == 7 ? 0 : 7 - (nextDay + 1)); i++) {

        const li = document.createElement('li');
        const button = document.createElement('button');

        li.classList.add('day');
        li.classList.add('next');
        li.classList.add('disable');
        li.appendChild(button);

        button.classList.add('dayButton');
        button.textContent = i;
        calendar.appendChild(li);
    }

    if (today.getFullYear() == currentYear && today.getMonth() == currentMonth) {
        const todayDate = today.getDate();
        const currentMonthDate = document.querySelectorAll('.dates .current');
        currentMonthDate[todayDate - 1].classList.add('today');
    }

    return { currentYear: currentYear, currentMonth: currentMonth, currentDate: currentDate };
}

const calendarInit = () => {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
    const kstGap = 9 * 60 * 60 * 1000;
    const today = new Date(utc + kstGap);
    let thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let currentYear = thisMonth.getFullYear();
    let currentMonth = thisMonth.getMonth();
    let currentDate = thisMonth.getDate();

    ({ currentYear, currentMonth, currentDate } = renderCalendar({ thisMonth: thisMonth, today: today, currentYear: currentYear, currentMonth: currentMonth, currentDate: currentDate }));

    const prevButton = document.querySelector('.prevMonth');
    const nextButton = document.querySelector('.nextMonth');
    let calendarId;

    prevButton.addEventListener('click', () => {
        thisMonth = new Date(currentYear, currentMonth - 1, 1);
        ({ currentYear, currentMonth, currentDate } = renderCalendar({ thisMonth: thisMonth, today: today, currentYear: currentYear, currentMonth: currentMonth, currentDate: currentDate }));
    });

    prevButton.addEventListener('mousedown', (e) => {
        calendarId = setInterval(() => {
            e.target.click();
        }, 80);
    });

    prevButton.addEventListener('mouseup', (e) => {
        clearInterval(calendarId);
    });

    nextButton.addEventListener('click', () => {
        thisMonth = new Date(currentYear, currentMonth + 1, 1);
        ({ currentYear, currentMonth, currentDate } = renderCalendar({ thisMonth: thisMonth, today: today, currentYear: currentYear, currentMonth: currentMonth, currentDate: currentDate }));
    });

    nextButton.addEventListener('mousedown', (e) => {
        calendarId = setInterval(() => {
            e.target.click();
        }, 80);
    });

    nextButton.addEventListener('mouseup', (e) => {
        clearInterval(calendarId);
    });
}

const startTimer = async () => {
    if (!localStorage.getItem('targetDate')) {
        return;
    }

    let target = localStorage.getItem('targetDate');
    let gap;

    timerId = setInterval(() => {
        gap = Math.abs(target - new Date().getTime()) / 1000;

        day.textContent = parseInt(gap / daySecond);
        gap = gap % daySecond;

        hour.textContent = addZero(parseInt(gap / hourSecond));
        gap = gap % hourSecond;

        minute.textContent = addZero(parseInt(gap / minuteSecond));
        gap = gap % minuteSecond;

        second.textContent = addZero(parseInt(gap));
    }, 1000);
}

window.onload = () => {
    document.querySelector('.calendarBackground').addEventListener('click', (event) => {
        event.currentTarget.style.display = 'none';
    });

    document.querySelector('.calendarButton').addEventListener('click', () => {
        document.querySelector('.calendarBackground').style.display = 'flex';
    });

    document.querySelector('.calendarBody').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    calendarInit();
    startTimer();
}
