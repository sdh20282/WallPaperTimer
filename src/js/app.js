var now = new Date()
var birth = new Date("1998-9-7")

var year_gap = now.getYear() - birth.getYear()
var day_gap = now.getDay() - birth.getDay()
var total_day = day_gap + year_gap * 365
var hour_gap = now.getHours() - birth.getHours()
var min_gap = now.getMinutes() - birth.getMinutes()
var sec_gap = now.getSeconds() - birth.getSeconds()

document.querySelector('#days').textContent = total_day;
document.querySelector('#hours').textContent = hour_gap;
document.querySelector('#minutes').textContent = min_gap;
document.querySelector('#seconds').textContent = sec_gap;
