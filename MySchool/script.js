const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

const appState = {
  currentPage: 'dashboard',
  selectedStudentId: 'bianca',
  selectedActivityId: null,
  selectedDate: null,
  calendarMonth: new Date(2026, 7, 1),
  schoolYearStart: new Date(2026, 7, 17),
  schoolYearEnd: new Date(2027, 4, 28),
  students: [
    {
      id: 'bianca',
      name: 'Bianca',
      grade: 2,
      focus: 'Reading fluency and number sense',
      notes: '2nd grade pacing with strong phonics and place-value practice.'
    },
    {
      id: 'aylen',
      name: 'Aylen',
      grade: 4,
      focus: 'Multi-step problem solving and writing clarity',
      notes: '4th grade pacing with deeper fractions, evidence-based writing, and projects.'
    }
  ],
  activitiesByStudent: {}
};

const curriculumByGrade = {
  2: [
    {
      subject: 'Math',
      sessionsPerWeek: 5,
      standards: [
        { code: 'CCSS.MATH.CONTENT.2.NBT.B.5', goal: 'Fluently add and subtract within 100.' },
        { code: 'CCSS.MATH.CONTENT.2.MD.C.7', goal: 'Tell and write time to the nearest 5 minutes.' },
        { code: 'CCSS.MATH.CONTENT.2.G.A.1', goal: 'Recognize and draw shapes with specific attributes.' }
      ]
    },
    {
      subject: 'ELA',
      sessionsPerWeek: 5,
      standards: [
        { code: 'CCSS.ELA-LITERACY.RL.2.1', goal: 'Ask and answer who/what/where/when/why/how questions.' },
        { code: 'CCSS.ELA-LITERACY.RF.2.4', goal: 'Read with sufficient accuracy and fluency.' },
        { code: 'CCSS.ELA-LITERACY.W.2.2', goal: 'Write informative texts using facts and definitions.' }
      ]
    },
    {
      subject: 'Science',
      sessionsPerWeek: 2,
      standards: [
        { code: 'NGSS 2-PS1-1', goal: 'Describe and classify materials by properties.' },
        { code: 'NGSS 2-LS4-1', goal: 'Compare diversity of life in different habitats.' }
      ]
    },
    {
      subject: 'Social Studies',
      sessionsPerWeek: 2,
      standards: [
        { code: 'C3.D2.Civ.1.3-5', goal: 'Explain the purpose of rules and laws in communities.' },
        { code: 'C3.D2.Geo.1.3-5', goal: 'Use maps and location words to describe places.' }
      ]
    },
    {
      subject: 'Technology',
      sessionsPerWeek: 1,
      standards: [
        { code: 'ISTE 1.1.a', goal: 'Use technology with teacher guidance to set simple goals.' }
      ]
    },
    {
      subject: 'Bible',
      sessionsPerWeek: 1,
      standards: [
        { code: 'Faith Literacy', goal: 'Read and retell major Bible stories and memory verses.' }
      ]
    }
  ],
  4: [
    {
      subject: 'Math',
      sessionsPerWeek: 5,
      standards: [
        { code: 'CCSS.MATH.CONTENT.4.NF.B.3', goal: 'Understand and perform fraction operations.' },
        { code: 'CCSS.MATH.CONTENT.4.OA.A.3', goal: 'Solve multistep word problems.' },
        { code: 'CCSS.MATH.CONTENT.4.MD.B.4', goal: 'Make and interpret line plots.' }
      ]
    },
    {
      subject: 'ELA',
      sessionsPerWeek: 5,
      standards: [
        { code: 'CCSS.ELA-LITERACY.RI.4.1', goal: 'Refer to details and examples in a text.' },
        { code: 'CCSS.ELA-LITERACY.W.4.1', goal: 'Write opinion pieces with reasons and evidence.' },
        { code: 'CCSS.ELA-LITERACY.L.4.1', goal: 'Use conventions of standard English grammar and usage.' }
      ]
    },
    {
      subject: 'Science',
      sessionsPerWeek: 2,
      standards: [
        { code: 'NGSS 4-PS3-2', goal: 'Analyze data for energy transfer in systems.' },
        { code: 'NGSS 4-ESS2-2', goal: 'Analyze Earth process patterns from maps.' }
      ]
    },
    {
      subject: 'Social Studies',
      sessionsPerWeek: 2,
      standards: [
        { code: 'C3.D2.His.1.3-5', goal: 'Create timelines and describe historical causation.' },
        { code: 'C3.D2.Eco.1.3-5', goal: 'Explain choices and tradeoffs in economics.' }
      ]
    },
    {
      subject: 'Technology',
      sessionsPerWeek: 1,
      standards: [
        { code: 'ISTE 1.4.a', goal: 'Define and solve authentic problems using digital tools.' }
      ]
    },
    {
      subject: 'Bible',
      sessionsPerWeek: 1,
      standards: [
        { code: 'Faith Literacy', goal: 'Analyze themes and character choices in scripture passages.' }
      ]
    }
  ]
};

const subjectColors = {
  Math: '#2e6be7',
  ELA: '#17b26a',
  Science: '#f5b301',
  'Social Studies': '#ef4f4f',
  Technology: '#6a83f5',
  Bible: '#20c997'
};

const holidayLabels = {
  '2026-09-07': 'Labor Day',
  '2026-11-26': 'Thanksgiving Break',
  '2026-11-27': 'Thanksgiving Break',
  '2026-12-21': 'Winter Break',
  '2026-12-22': 'Winter Break',
  '2026-12-23': 'Winter Break',
  '2026-12-24': 'Winter Break',
  '2026-12-25': 'Winter Break',
  '2026-12-28': 'Winter Break',
  '2026-12-29': 'Winter Break',
  '2026-12-30': 'Winter Break',
  '2026-12-31': 'Winter Break',
  '2027-01-01': 'Winter Break',
  '2027-01-18': 'MLK Day',
  '2027-02-15': 'Presidents Day',
  '2027-03-15': 'Spring Break',
  '2027-03-16': 'Spring Break',
  '2027-03-17': 'Spring Break',
  '2027-03-18': 'Spring Break',
  '2027-03-19': 'Spring Break'
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatLongDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatShortDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isSchoolHoliday(date) {
  return Object.prototype.hasOwnProperty.call(holidayLabels, dateKey(date));
}

function isSchoolDay(date) {
  return !isWeekend(date) && !isSchoolHoliday(date) && date >= appState.schoolYearStart && date <= appState.schoolYearEnd;
}

function getSchoolDays() {
  const days = [];
  const current = new Date(appState.schoolYearStart);
  while (current <= appState.schoolYearEnd) {
    if (isSchoolDay(current)) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function pickFirstValidDate() {
  const today = new Date();
  if (isSchoolDay(today)) {
    return dateKey(today);
  }
  const days = getSchoolDays();
  const next = days.find((d) => d >= today) || days[0];
  return dateKey(next);
}

function planSubjectsForWeekday(weekday) {
  const map = {
    1: ['Math', 'ELA', 'Science'],
    2: ['Math', 'ELA', 'Social Studies'],
    3: ['Math', 'ELA', 'Technology'],
    4: ['Math', 'ELA', 'Science'],
    5: ['Math', 'ELA', 'Bible', 'Social Studies']
  };
  return map[weekday] || [];
}

function activityTitle(subject, standardGoal, weekIndex, grade, studentName) {
  const stems = {
    Math: [`Practice set ${weekIndex + 1}`, `Word problems ${weekIndex + 1}`, `Fluency check ${weekIndex + 1}`],
    ELA: [`Reading response ${weekIndex + 1}`, `Writing draft ${weekIndex + 1}`, `Vocabulary cycle ${weekIndex + 1}`],
    Science: [`Investigation lab ${weekIndex + 1}`, `Notebook observation ${weekIndex + 1}`],
    'Social Studies': [`Map/history inquiry ${weekIndex + 1}`, `Community discussion ${weekIndex + 1}`],
    Technology: [`Digital skill mini-project ${weekIndex + 1}`],
    Bible: [`Scripture reading + reflection ${weekIndex + 1}`]
  };
  const list = stems[subject] || [`Lesson ${weekIndex + 1}`];
  const stem = list[weekIndex % list.length];
  return `${subject}: ${stem} (${studentName}, Grade ${grade}) - ${standardGoal}`;
}

function generateStudentActivities(student) {
  const schoolDays = getSchoolDays();
  const plan = {};
  const curriculum = curriculumByGrade[student.grade] || curriculumByGrade[2];

  const standardIndexes = {};
  curriculum.forEach((subjectPlan) => {
    standardIndexes[subjectPlan.subject] = 0;
  });

  schoolDays.forEach((day, dayIndex) => {
    const weekday = day.getDay();
    const plannedSubjects = planSubjectsForWeekday(weekday);
    const activities = [];

    plannedSubjects.forEach((subject) => {
      const subjectPlan = curriculum.find((item) => item.subject === subject);
      if (!subjectPlan) {
        return;
      }
      const standards = subjectPlan.standards;
      const idx = standardIndexes[subject] % standards.length;
      const standard = standards[idx];
      standardIndexes[subject] += 1;
      const weekIndex = Math.floor(dayIndex / 5);

      activities.push({
        id: `${student.id}-${dateKey(day)}-${subject.replace(/\s+/g, '').toLowerCase()}`,
        subject,
        title: activityTitle(subject, standard.goal, weekIndex, student.grade, student.name),
        standardCode: standard.code,
        completed: false,
        note: '',
        subTasks: []
      });
    });

    plan[dateKey(day)] = activities;
  });

  return plan;
}

function ensureStudentPlans() {
  appState.students.forEach((student) => {
    if (!appState.activitiesByStudent[student.id]) {
      appState.activitiesByStudent[student.id] = generateStudentActivities(student);
    }
  });
}

function getSelectedStudent() {
  return appState.students.find((student) => student.id === appState.selectedStudentId) || appState.students[0];
}

function getActivitiesForDate(studentId, key) {
  const studentPlan = appState.activitiesByStudent[studentId] || {};
  return studentPlan[key] || [];
}

function renderDashboardStudents() {
  const list = document.getElementById('dashboardStudentList');
  list.innerHTML = '';

  appState.students.forEach((student) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `student-item${student.id === appState.selectedStudentId ? ' active' : ''}`;
    button.innerHTML = `<span class="avatar">${student.name[0]}</span> ${student.name}`;
    button.addEventListener('click', () => {
      appState.selectedStudentId = student.id;
      appState.selectedActivityId = null;
      renderAll();
    });
    li.appendChild(button);
    list.appendChild(li);
  });
}

function renderDashboardActivities() {
  const selectedStudent = getSelectedStudent();
  const date = parseDateKey(appState.selectedDate);
  const activities = getActivitiesForDate(selectedStudent.id, appState.selectedDate);
  const groups = {};

  activities.forEach((activity) => {
    if (!groups[activity.subject]) {
      groups[activity.subject] = [];
    }
    groups[activity.subject].push(activity);
  });

  document.getElementById('dashboardHeading').textContent = `${selectedStudent.name}'s Activities`;
  document.getElementById('dashboardDatePill').textContent = formatLongDate(date);

  const holder = document.getElementById('subjectTaskGroups');
  holder.innerHTML = '';

  Object.keys(groups).forEach((subject) => {
    const card = document.createElement('article');
    card.className = 'subject-card';
    card.style.borderLeftColor = subjectColors[subject] || '#8faedd';

    const subjectTitle = document.createElement('h3');
    subjectTitle.textContent = subject;

    const list = document.createElement('ul');

    groups[subject].forEach((activity) => {
      const item = document.createElement('li');
      item.className = `activity-item${activity.completed ? ' completed' : ''}${activity.id === appState.selectedActivityId ? ' selected' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = activity.completed;
      checkbox.addEventListener('change', () => {
        activity.completed = checkbox.checked;
        renderDashboardActivities();
        renderTaskDetails();
      });

      const bodyButton = document.createElement('button');
      bodyButton.type = 'button';
      bodyButton.style.all = 'unset';
      bodyButton.style.cursor = 'pointer';
      bodyButton.innerHTML = `<span>${activity.title}</span><br /><small>${activity.standardCode}</small>`;
      bodyButton.addEventListener('click', () => {
        appState.selectedActivityId = activity.id;
        renderDashboardActivities();
        renderTaskDetails();
      });

      item.appendChild(checkbox);
      item.appendChild(bodyButton);
      list.appendChild(item);
    });

    card.appendChild(subjectTitle);
    card.appendChild(list);
    holder.appendChild(card);
  });

  if (activities.length === 0) {
    holder.innerHTML = '<p class="detail-empty">No activities for this date (weekend/holiday).</p>';
  }
}

function findSelectedActivity() {
  if (!appState.selectedActivityId) {
    return null;
  }
  const selectedStudent = getSelectedStudent();
  const activities = getActivitiesForDate(selectedStudent.id, appState.selectedDate);
  return activities.find((activity) => activity.id === appState.selectedActivityId) || null;
}

function renderTaskDetails() {
  const details = document.getElementById('taskDetailContent');
  const noteField = document.getElementById('taskNote');
  const activity = findSelectedActivity();

  if (!activity) {
    details.className = 'detail-empty';
    details.textContent = 'Select an activity to view details.';
    noteField.value = '';
    noteField.disabled = true;
    return;
  }

  details.className = '';
  const subtasks = activity.subTasks.length
    ? `<ul class="detail-list">${activity.subTasks.map((item) => `<li>${item}</li>`).join('')}</ul>`
    : '<p class="detail-empty">No sub-activities yet.</p>';

  details.innerHTML = `
    <ul class="detail-list">
      <li><strong>Title:</strong> ${activity.title}</li>
      <li><strong>Subject:</strong> ${activity.subject}</li>
      <li><strong>Standard:</strong> ${activity.standardCode}</li>
      <li><strong>Status:</strong> ${activity.completed ? 'Completed' : 'Pending'}</li>
    </ul>
    <h4>Sub-activities</h4>
    ${subtasks}
  `;

  noteField.disabled = false;
  noteField.value = activity.note || '';
}

function attachDashboardActions() {
  document.getElementById('addActivityBtn').addEventListener('click', () => {
    const selectedStudent = getSelectedStudent();
    const title = window.prompt('New activity title:');
    if (!title) {
      return;
    }
    const subject = window.prompt('Subject (Math, ELA, Science, Social Studies, Technology, Bible):', 'Math') || 'Math';

    const activities = getActivitiesForDate(selectedStudent.id, appState.selectedDate);
    const cleanSubject = subject.trim() || 'Math';

    activities.push({
      id: `${selectedStudent.id}-${Date.now()}`,
      subject: cleanSubject,
      title,
      standardCode: 'Parent Planned',
      completed: false,
      note: '',
      subTasks: []
    });

    appState.selectedActivityId = activities[activities.length - 1].id;
    renderDashboardActivities();
    renderTaskDetails();
    renderCalendar();
  });

  document.getElementById('addSubtaskBtn').addEventListener('click', () => {
    const activity = findSelectedActivity();
    if (!activity) {
      return;
    }
    const subTask = window.prompt('Sub-activity description:');
    if (!subTask) {
      return;
    }
    activity.subTasks.push(subTask);
    renderTaskDetails();
  });

  document.getElementById('deleteActivityBtn').addEventListener('click', () => {
    const selectedStudent = getSelectedStudent();
    const activities = getActivitiesForDate(selectedStudent.id, appState.selectedDate);
    const idx = activities.findIndex((activity) => activity.id === appState.selectedActivityId);
    if (idx < 0) {
      return;
    }
    activities.splice(idx, 1);
    appState.selectedActivityId = null;
    renderDashboardActivities();
    renderTaskDetails();
    renderCalendar();
  });

  document.getElementById('taskNote').addEventListener('input', (event) => {
    const activity = findSelectedActivity();
    if (!activity) {
      return;
    }
    activity.note = event.target.value;
  });
}

function renderCalendar() {
  const label = document.getElementById('calendarMonthLabel');
  const grid = document.getElementById('calendarGrid');
  const selectedStudent = getSelectedStudent();

  const monthStart = new Date(appState.calendarMonth.getFullYear(), appState.calendarMonth.getMonth(), 1);
  const monthEnd = new Date(appState.calendarMonth.getFullYear(), appState.calendarMonth.getMonth() + 1, 0);
  const startGrid = new Date(monthStart);
  startGrid.setDate(monthStart.getDate() - monthStart.getDay());

  label.textContent = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  grid.innerHTML = '';

  for (let i = 0; i < 42; i += 1) {
    const day = new Date(startGrid);
    day.setDate(startGrid.getDate() + i);

    const key = dateKey(day);
    const activities = getActivitiesForDate(selectedStudent.id, key);
    const isOutside = day < monthStart || day > monthEnd;
    const weekend = isWeekend(day);
    const holiday = isSchoolHoliday(day);

    const card = document.createElement('article');
    card.className = 'day';
    if (isOutside) card.classList.add('is-outside');
    if (weekend) card.classList.add('is-weekend');
    if (holiday) card.classList.add('is-holiday');
    if (appState.selectedDate === key) card.classList.add('is-selected');

    const header = document.createElement('header');
    header.innerHTML = `<span>${day.toLocaleDateString('en-US', { weekday: 'short' })}</span><span>${day.getDate()}</span>`;

    const body = document.createElement('div');

    if (holiday) {
      body.innerHTML = `<p class="small-note">No school: ${holidayLabels[key]}</p>`;
    } else if (weekend) {
      body.innerHTML = '<p class="small-note">Weekend</p>';
    } else if (activities.length === 0) {
      body.innerHTML = '<p class="small-note">No planned activities</p>';
    } else {
      const list = document.createElement('ul');
      activities.slice(0, 4).forEach((activity) => {
        const li = document.createElement('li');
        li.textContent = activity.title;
        list.appendChild(li);
      });
      if (activities.length > 4) {
        const overflow = document.createElement('li');
        overflow.textContent = `+${activities.length - 4} more`;
        list.appendChild(overflow);
      }
      body.appendChild(list);
    }

    card.appendChild(header);
    card.appendChild(body);

    card.addEventListener('click', () => {
      appState.selectedDate = key;
      appState.selectedActivityId = null;
      renderCalendar();
      renderDashboardActivities();
      renderTaskDetails();
      document.querySelector('[data-page="dashboard"]').click();
    });

    grid.appendChild(card);
  }
}

function renderCurriculum() {
  const grid = document.getElementById('curriculumGrid');
  grid.innerHTML = '';

  appState.students.forEach((student) => {
    const standards = curriculumByGrade[student.grade] || curriculumByGrade[2];
    const card = document.createElement('article');
    card.className = 'curriculum-card';

    const chips = standards
      .map((subjectPlan) => `<span class="subject-chip">${subjectPlan.subject}: ${subjectPlan.sessionsPerWeek}x/week</span>`)
      .join('');

    const sampleStandards = standards
      .flatMap((subjectPlan) => subjectPlan.standards.map((std) => ({ subject: subjectPlan.subject, ...std })))
      .slice(0, 8)
      .map((std) => `<li><strong>${std.subject}</strong> - ${std.code}<br />${std.goal}</li>`)
      .join('');

    card.innerHTML = `
      <h3>${student.name} - Grade ${student.grade}</h3>
      <p class="meta">${student.focus}</p>
      <div>${chips}</div>
      <ul class="standard-list">${sampleStandards}</ul>
    `;

    grid.appendChild(card);
  });
}

function renderStudentsPage() {
  const container = document.getElementById('studentCards');
  container.innerHTML = '';

  appState.students.forEach((student) => {
    const card = document.createElement('article');
    const progressSnapshot = getProgressForStudent(student.id);
    card.innerHTML = `
      <h4>${student.name}</h4>
      <p>Grade ${student.grade}</p>
      <small>${student.notes}</small>
      <p><strong>Today:</strong> ${progressSnapshot.total} activities, ${progressSnapshot.done} completed</p>
      <button type="button" class="add-btn" data-pick-student="${student.id}">Open in Dashboard</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('[data-pick-student]').forEach((button) => {
    button.addEventListener('click', () => {
      appState.selectedStudentId = button.dataset.pickStudent;
      appState.selectedActivityId = null;
      renderAll();
      document.querySelector('[data-page="dashboard"]').click();
    });
  });
}

function getProgressForStudent(studentId) {
  const activities = getActivitiesForDate(studentId, appState.selectedDate);
  const done = activities.filter((activity) => activity.completed).length;
  return { total: activities.length, done };
}

function attachCalendarActions() {
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    appState.calendarMonth = new Date(appState.calendarMonth.getFullYear(), appState.calendarMonth.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    appState.calendarMonth = new Date(appState.calendarMonth.getFullYear(), appState.calendarMonth.getMonth() + 1, 1);
    renderCalendar();
  });
}

function attachStudentsForm() {
  document.getElementById('addStudentForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.studentName.value.trim();
    const grade = Number(form.studentGrade.value);
    const focus = form.studentFocus.value.trim() || 'Balanced progress across core subjects';

    if (!name) {
      return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + `-${Date.now().toString().slice(-4)}`;

    const newStudent = {
      id,
      name,
      grade,
      focus,
      notes: `${ordinal(grade)} grade homeschool plan with parent-led pacing.`
    };

    appState.students.push(newStudent);
    appState.activitiesByStudent[newStudent.id] = generateStudentActivities(newStudent);

    form.reset();
    appState.selectedStudentId = newStudent.id;
    appState.selectedActivityId = null;
    renderAll();
  });
}

function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th';
  return `${n}${suffix}`;
}

function setPage(pageId) {
  appState.currentPage = pageId;
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  pages.forEach((page) => {
    page.classList.toggle('active', page.id === pageId);
  });
}

function renderAll() {
  ensureStudentPlans();
  renderDashboardStudents();
  renderDashboardActivities();
  renderTaskDetails();
  renderCalendar();
  renderCurriculum();
  renderStudentsPage();
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => setPage(btn.dataset.page));
});

appState.selectedDate = pickFirstValidDate();
appState.calendarMonth = new Date(parseDateKey(appState.selectedDate).getFullYear(), parseDateKey(appState.selectedDate).getMonth(), 1);

attachDashboardActions();
attachCalendarActions();
attachStudentsForm();
renderAll();
setPage('dashboard');