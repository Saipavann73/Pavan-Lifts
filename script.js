/* =========================
   WORKOUT DATA
========================= */

const workouts = {

    monday: {
        day: "MONDAY",
        title: "Push",
        exercises: [
            ["Bench Press", "3 × 6–8"],
            ["Incline DB Press", "3 × 8–10"],
            ["Cable Fly", "2 × 12–15"],
            ["Shoulder Press", "3 × 6–10"],
            ["Lateral Raises", "3 × 12–20"],
            ["Triceps Pushdown", "3 × 10–15"],
            ["Overhead Triceps Extension", "2 × 10–15"]
        ]
    },

    tuesday: {
        day: "TUESDAY",
        title: "Pull",
        exercises: [
            ["Lat Pulldown / Pull-ups", "3 × 6–10"],
            ["Chest-Supported Row", "3 × 8–12"],
            ["Seated Cable Row", "2 × 8–12"],
            ["Single-Arm Lat Pulldown", "2 × 10–15"],
            ["Reverse Pec Deck", "3 × 12–20"],
            ["EZ-Bar Curl", "3 × 8–12"],
            ["Incline DB Curl", "2 × 10–15"]
        ]
    },

    wednesday: {
        day: "WEDNESDAY",
        title: "Legs",
        exercises: [
            ["Squat / Hack Squat", "3 × 6–10"],
            ["Leg Press", "3 × 8–12"],
            ["Romanian Deadlift", "3 × 8–10"],
            ["Leg Curl", "3 × 10–15"],
            ["Leg Extension", "2 × 12–15"],
            ["Calf Raises", "3 × 10–20"]
        ]
    },

    thursday: {
        day: "THURSDAY",
        title: "Rest Day",
        exercises: [
            ["Recovery", "Rest & recover"],
            ["Walking", "Optional light activity"],
            ["Mobility", "Optional stretching"]
        ]
    },

    friday: {
        day: "FRIDAY",
        title: "Upper",
        exercises: [
            ["Incline Bench Press", "3 × 6–10"],
            ["Lat Pulldown", "3 × 8–12"],
            ["Machine / DB Chest Press", "2 × 8–12"],
            ["Decline Cable Fly", "3 × 10–15"],
            ["Lateral Raises", "3 × 12–20"],
            ["Biceps Curl", "2 × 10–15"],
            ["Triceps Extension", "2 × 10–15"]
        ]
    },

    saturday: {
        day: "SATURDAY",
        title: "Lower",
        exercises: [
            ["Hack Squat / Squat", "3 × 6–10"],
            ["Romanian Deadlift", "3 × 8–10"],
            ["Leg Press", "2 × 10–15"],
            ["Leg Curl", "3 × 10–15"],
            ["Leg Extension", "2 × 12–15"],
            ["Calf Raises", "4 × 10–20"]
        ]
    },

    sunday: {
        day: "SUNDAY",
        title: "Rest Day",
        exercises: [
            ["Recovery", "Rest & recover"],
            ["Walking", "Optional light activity"],
            ["Mobility", "Optional stretching"]
        ]
    }

};


/* =========================
   SHOW WORKOUT
========================= */

function showWorkout(day) {

    const workout = workouts[day];
    const display = document.getElementById("workout-display");

    if (!display || !workout) return;

    let html = `
        <div class="workout-header">
            <p class="day-label">${workout.day}</p>
            <h3>${workout.title}</h3>
        </div>
    `;

    workout.exercises.forEach(exercise => {

        html += `
            <div class="exercise">
                <div>
                    <strong>${exercise[0]}</strong>
                    <p>${exercise[1]}</p>
                </div>
            </div>
        `;

    });

    display.innerHTML = html;
}


/* =========================
   DIET TRACKER
========================= */

const dietMeals = [
    "breakfast",
    "snack",
    "lunch",
    "preworkout",
    "postworkout",
    "dinner"
];

let dietProgress = {};


function getTodayKey() {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================
   LOAD DIET
========================= */

function loadDietProgress() {

    const storageKey =
        `pavanLiftsDiet_${getTodayKey()}`;

    const saved =
        localStorage.getItem(storageKey);

    if (saved) {

        try {
            dietProgress = JSON.parse(saved);
        } catch (error) {
            dietProgress = {};
        }

    } else {
        dietProgress = {};
    }


    dietMeals.forEach(meal => {

        if (typeof dietProgress[meal] !== "boolean") {
            dietProgress[meal] = false;
        }

    });


    document
        .querySelectorAll(".diet-card")
        .forEach(card => {

            const meal = card.dataset.meal;

            const checkbox =
                card.querySelector('input[type="checkbox"]');

            if (checkbox) {

                checkbox.checked =
                    dietProgress[meal] === true;

                card.classList.toggle(
                    "completed",
                    checkbox.checked
                );

            }

        });

}


/* =========================
   SAVE DIET
========================= */

function saveDietProgress() {

    const storageKey =
        `pavanLiftsDiet_${getTodayKey()}`;

    localStorage.setItem(
        storageKey,
        JSON.stringify(dietProgress)
    );

}


/* =========================
   TOGGLE DIET MEAL
========================= */

function toggleDietMeal(meal, completed) {

    dietProgress[meal] = completed;

    const card =
        document.querySelector(
            `.diet-card[data-meal="${meal}"]`
        );

    if (card) {

        card.classList.toggle(
            "completed",
            completed
        );

    }

    saveDietProgress();
    updateDietProgress();

}


/* =========================
   UPDATE DIET PROGRESS
========================= */

function updateDietProgress() {

    const completedMeals =
        dietMeals.filter(
            meal => dietProgress[meal] === true
        ).length;

    const totalMeals = dietMeals.length;

    const percentage =
        Math.round(
            (completedMeals / totalMeals) * 100
        );


    /* CORRECT HTML IDs */

    const percentageElement =
        document.getElementById("dietPercentage");

    const progressBar =
        document.getElementById("dietProgressBar");

    const countElement =
        document.getElementById("dietCount");


    if (percentageElement) {
        percentageElement.textContent =
            `${percentage}%`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }

    if (countElement) {
        countElement.textContent =
            `${completedMeals} / ${totalMeals} meals completed`;
    }

}


/* =========================
   RESET DIET
========================= */

function resetDietProgress() {

    const confirmed =
        confirm("Reset today's diet progress?");

    if (!confirmed) return;


    dietMeals.forEach(meal => {
        dietProgress[meal] = false;
    });


    document
        .querySelectorAll(".diet-card")
        .forEach(card => {

            card.classList.remove("completed");

            const checkbox =
                card.querySelector(
                    'input[type="checkbox"]'
                );

            if (checkbox) {
                checkbox.checked = false;
            }

        });


    saveDietProgress();
    updateDietProgress();

}


/* =========================
   SUPPLEMENT TRACKER
========================= */

const supplements = [
    "creatine",
    "whey",
    "fishoil"
];

let supplementProgress = {};


/* =========================
   LOAD SUPPLEMENTS
========================= */

function loadSupplementProgress() {

    const saved =
        localStorage.getItem(
            "pavanLiftsSupplements"
        );

    if (saved) {

        try {
            supplementProgress =
                JSON.parse(saved);
        } catch (error) {
            supplementProgress = {};
        }

    } else {
        supplementProgress = {};
    }


    supplements.forEach(supplement => {

        if (
            typeof supplementProgress[supplement]
            !== "boolean"
        ) {
            supplementProgress[supplement] = false;
        }

    });


    document
        .querySelectorAll(".supplement-card")
        .forEach(card => {

            const supplement =
                card.dataset.supplement;

            const checkbox =
                card.querySelector(
                    'input[type="checkbox"]'
                );

            if (checkbox) {

                checkbox.checked =
                    supplementProgress[supplement] === true;

                card.classList.toggle(
                    "completed",
                    checkbox.checked
                );

            }

        });

}


/* =========================
   TOGGLE SUPPLEMENT
========================= */

function toggleSupplement(
    supplement,
    completed
) {

    supplementProgress[supplement] =
        completed;


    const card =
        document.querySelector(
            `.supplement-card[data-supplement="${supplement}"]`
        );


    if (card) {

        card.classList.toggle(
            "completed",
            completed
        );

    }


    localStorage.setItem(
        "pavanLiftsSupplements",
        JSON.stringify(supplementProgress)
    );


    updateSupplementProgress();

}


/* =========================
   UPDATE SUPPLEMENTS
========================= */

function updateSupplementProgress() {

    const completed =
        supplements.filter(
            supplement =>
                supplementProgress[supplement] === true
        ).length;

    const total =
        supplements.length;

    const percentage =
        Math.round(
            (completed / total) * 100
        );


    const percentageElement =
        document.getElementById(
            "supplementPercentage"
        );

    const progressBar =
        document.getElementById(
            "supplementProgressBar"
        );

    const countElement =
        document.getElementById(
            "supplementCount"
        );


    if (percentageElement) {
        percentageElement.textContent =
            `${percentage}%`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }

    if (countElement) {
        countElement.textContent =
            `${completed} / ${total} supplements completed`;
    }

}


/* =========================
   RESET SUPPLEMENTS
========================= */

function resetSupplementProgress() {

    const confirmed =
        confirm(
            "Reset today's supplement progress?"
        );

    if (!confirmed) return;


    supplements.forEach(supplement => {
        supplementProgress[supplement] = false;
    });


    document
        .querySelectorAll(".supplement-card")
        .forEach(card => {

            card.classList.remove("completed");

            const checkbox =
                card.querySelector(
                    'input[type="checkbox"]'
                );

            if (checkbox) {
                checkbox.checked = false;
            }

        });


    localStorage.setItem(
        "pavanLiftsSupplements",
        JSON.stringify(supplementProgress)
    );


    updateSupplementProgress();

}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showWorkout("monday");

        loadDietProgress();
        updateDietProgress();

        loadSupplementProgress();
        updateSupplementProgress();

    }
);