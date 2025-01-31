function generatePlan() {
    let goal = document.getElementById("goal").value;
    let activity = document.getElementById("activity").value;

    let dietPlan = "";
    let workoutPlan = "";

    if (goal === "weight_loss") {
        dietPlan = "Eat high-protein, low-carb meals. Include vegetables and lean meats.";
        workoutPlan = activity === "low" ? "Walk 30 min daily" : activity === "moderate" ? "Jog 30 min + light strength training" : "HIIT + Strength Training 5 days a week";
    } else if (goal === "muscle_gain") {
        dietPlan = "Consume protein-rich foods like chicken, fish, eggs, and nuts.";
        workoutPlan = activity === "low" ? "Start with bodyweight exercises" : activity === "moderate" ? "Weightlifting 3 times a week" : "Intense strength training + heavy weights 5 times a week";
    } else {
        dietPlan = "Maintain a balanced diet with proteins, carbs, and fats.";
        workoutPlan = activity === "low" ? "Stay active with walking & stretching" : activity === "moderate" ? "Moderate cardio & strength training" : "Varied strength & endurance workouts";
    }

    document.getElementById("dietPlan").innerText = "Diet Plan: " + dietPlan;
    document.getElementById("workoutPlan").innerText = "Workout Plan: " + workoutPlan;

    document.getElementById("recommendations").style.display = "block";
}
