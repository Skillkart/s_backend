if (userrole == "recuirter") {
  let datas;
  let r = 0;
  let cmonth = "";
  let hoursindicate = 1;
  let minuteindicate = 0;

  today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  selectYear = document.getElementById("year");
  selectMonth = document.getElementById("month");

  createYear = generate_year_range(1970, 2050);
  async function makingslotes(bookingdate, hour) {
    document.getElementsByClassName(
      "timecollector"
    )[0].innerHTML = `<div class="loading"></div>`;
    const reques = await axios
      .post("/api/v1/dateadder", {
        date: bookingdate,
        time: hour,
        user_id: user_id,
      })
      .then(() => {
        document.getElementsByClassName(
          "timecollector"
        )[0].innerHTML = `<div class="time-hours">1</div>
    <div class="indicator">
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="increaseHours()"
      >
        expand_less
      </span>
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="decreaseHours()"
      >
        expand_more
      </span>
    </div>
    <div class="time-minutes">00</div>
    <!-- <div class="indicator">
      <span class="material-symbols-outlined indicator-arrow" onclick="increasemin()">
        expand_less
      </span>
      <span class="material-symbols-outlined indicator-arrow" onclick="decreasemin()">
        expand_more
      </span>
    </div> -->
    <div class="time-format">AM</div>
    <div class="indicator">
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="increaseformat()"
      >
        expand_less
      </span>
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="decreaseformat()"
      >
        expand_more
      </span>
    </div>`;
        window.location.reload();
      })
      .catch((error) => {
        document.getElementsByClassName(
          "timecollector"
        )[0].innerHTML = `<div class="time-hours">1</div>
    <div class="indicator">
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="increaseHours()"
      >
        expand_less
      </span>
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="decreaseHours()"
      >
        expand_more
      </span>
    </div>
    <div class="time-minutes">00</div>
    <!-- <div class="indicator">
      <span class="material-symbols-outlined indicator-arrow" onclick="increasemin()">
        expand_less
      </span>
      <span class="material-symbols-outlined indicator-arrow" onclick="decreasemin()">
        expand_more
      </span>
    </div> -->
    <div class="time-format">AM</div>
    <div class="indicator">
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="increaseformat()"
      >
        expand_less
      </span>
      <span
        class="material-symbols-outlined indicator-arrow"
        onclick="decreaseformat()"
      >
        expand_more
      </span>
    </div>`;
        document.getElementsByClassName("hourserrormessag")[0].style.display =
          "flex";
        document.getElementsByClassName(
          "hourserrormessag"
        )[0].innerHTML = `<span class="material-symbols-outlined"> error </span> ${error?.response?.data?.message}`;
        setTimeout(() => {
          document.getElementsByClassName("hourserrormessag")[0].style.display =
            "none";
        }, 3000);
      });
    return reques;
  }

  async function makeschedule() {
    let bookindate =
      document.getElementsByClassName("indicator-date")[0].innerText;
    let hour = `0${
      document.getElementsByClassName("time-hours")[0].innerText
    }:${document.getElementsByClassName("time-minutes")[0].innerText} ${
      document.getElementsByClassName("time-format")[0].innerText
    }`;
    makingslotes(bookindate, hour);
  }

  async function userdata() {
    const request = await axios.post("/api/v1/userdata", {
      email: useremail,
      role: userrole,
    });
    datas = request.data.data;
    return request;
  }

  function decreaseformat() {
    document.getElementsByClassName("time-format")[0].innerText = "PM";
  }

  function increaseformat() {
    document.getElementsByClassName("time-format")[0].innerText = "AM";
  }

  function decreaseHours() {
    if (hoursindicate == 1) {
      hoursindicate = 12;
    } else {
      hoursindicate -= 1;
    }
    document.getElementsByClassName("time-hours")[0].innerText = hoursindicate;
  }

  function increaseHours() {
    if (hoursindicate < 12) {
      hoursindicate += 1;
    } else {
      hoursindicate = 1;
    }
    document.getElementsByClassName("time-hours")[0].innerText = hoursindicate;
  }

  function cancelschedule() {
    let schduler = document.getElementsByClassName("scheduler")[0];
    schduler.style.display = "none";
  }
  async function datefixer(date) {
    document.getElementsByClassName("Slots")[0].style.display = "flex";
    const f = datas.filter((state) => state.date == date);
    if (f.length) {
      if (f[0].time) {
        let html = "";
        {
          f[0].time.map((t) => (html += `<div class="slt">${t}</div>`));
        }
        document.getElementsByClassName("slotsavi")[0].innerHTML = html;
      }
    }
    let schduler = document.getElementsByClassName("scheduler")[0];
    let bookindate = document.getElementsByClassName("indicator-date")[0];
    bookindate.innerText = date;
    let cumonth = document
      .getElementById("monthAndYear")
      .innerText.split(" ")[0];
    let m = date.split(" ")[1];
    if (cumonth == cmonth) {
      let currentdate = parseInt(
        document.getElementsByClassName("selected")[0].innerText
      );
      let d = parseInt(date.split(" ")[0]);
      if (currentdate > d) {
        alert("not allow");
        return;
      } else {
        schduler.style.display = "flex";
        return;
      }
    } else {
      var today = new Date();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      console.log(time);
      schduler.style.display = "flex";
    }
  }

  function generate_year_range(start, end) {
    var years = "";
    for (var year = start; year <= end; year++) {
      years += "<option value='" + year + "'>" + year + "</option>";
    }
    return years;
  }

  /** or
   * createYear = generate_year_range( 1970, currentYear );
   */

  var calendar = document.getElementById("calendar");
  var lang = calendar.getAttribute("data-lang");

  var months = "";
  var days = "";

  var monthDefault = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var dayDefault = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (lang == "en") {
    months = monthDefault;
    days = dayDefault;
  } else if (lang == "id") {
    months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    days = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  } else if (lang == "fr") {
    months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    days = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
  } else {
    months = monthDefault;
    days = dayDefault;
  }

  var $dataHead = "<tr>";
  for (dhead in days) {
    $dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + "</th>";
  }
  $dataHead += "</tr>";

  //alert($dataHead);
  document.getElementById("thead-month").innerHTML = $dataHead;

  monthAndYear = document.getElementById("monthAndYear");
  showCalendar(currentMonth, currentYear);

  function next() {
    if (r === 0 && r < 2) {
      currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      currentMonth = (currentMonth + 1) % 12;
      showCalendar(currentMonth, currentYear);
      r += 1;
    }
  }

  function previous() {
    if (r > 0 || r === 2) {
      currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      showCalendar(currentMonth, currentYear);
      r--;
    }
  }

  function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
  }

  async function showCalendar(month, year) {
    var firstDay = new Date(year, month).getDay();
    tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";

    monthAndYear.innerHTML = months[month] + " " + year;

    await userdata();

    // }
    var date = 1;
    for (var i = 0; i < 6; i++) {
      var row = document.createElement("tr");
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          cell = document.createElement("td");
          cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > daysInMonth(month, year)) {
          break;
        } else {
          // console.log(
          //   date + " " + document.getElementById("monthAndYear").innerText
          if (datas.length) {
            const bdate = datas.filter(
              (state) =>
                state.date ==
                date + " " + document.getElementById("monthAndYear").innerText
            );
            // console.log(
            //   date + " " + document.getElementById("monthAndYear").innerText
            // );

            cell = document.createElement("td");
            cell.addEventListener("click", function handleClick(event) {
              let value =
                event.target.innerText || event.originalTarget.innerText;
              datefixer(
                value + " " + document.getElementById("monthAndYear").innerText
              );
            });
            cell.setAttribute("data-date", date);
            cell.setAttribute("data-month", month + 1);
            cell.setAttribute("data-year", year);
            cell.setAttribute("data-month_name", months[month]);
            if (bdate.length) {
              cell.className = "date-picker busydates";
            } else {
              cell.className = "date-picker";
            }
            cell.innerHTML = "<span>" + date + "</span>";

            if (
              date === today.getDate() &&
              year === today.getFullYear() &&
              month === today.getMonth()
            ) {
              cell.className = "date-picker selected";
            }
            row.appendChild(cell);
            date++;
          } else {
            cell = document.createElement("td");
            cell.addEventListener("click", function handleClick(event) {
              let value =
                event.target.innerText || event.originalTarget.innerText;
              datefixer(
                value + " " + document.getElementById("monthAndYear").innerText
              );
            });
            cell.setAttribute("data-date", date);
            cell.setAttribute("data-month", month + 1);
            cell.setAttribute("data-year", year);
            cell.setAttribute("data-month_name", months[month]);

            cell.className = "date-picker";

            cell.innerHTML = "<span>" + date + "</span>";

            if (
              date === today.getDate() &&
              year === today.getFullYear() &&
              month === today.getMonth()
            ) {
              cell.className = "date-picker selected";
            }
            row.appendChild(cell);
            date++;
          }
        }
      }

      tbl.appendChild(row);
    }
  }

  function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  cmonth = document.getElementById("monthAndYear").innerText.split(" ")[0];
}
