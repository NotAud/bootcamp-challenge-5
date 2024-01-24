// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// Create a date object to be used throughout app
// const currentDate = new Date();
const currentDate = dayjs();

$(function () {
  // Initialize local storage
  let schedule = JSON.parse(localStorage.getItem("schedule"));

  // Schedule can be undefined, this avoids an extra if check before calling isSameDay (More readable)
  if (!schedule) {
    schedule = resetStorageState();
  }

  // Verify the day is still current, if not reset the schedule
  const isNewDay = !currentDate.isSame(schedule.lastUpdated, "day");
  if (isNewDay) {
    schedule = resetStorageState();
  }

  // Not important for this project, but set a variable for our start and end time
  // Based on 24hr time
  const startTime = 9;
  const endTime = 17;

  // Calculate work hours
  const workHours = endTime - startTime;

  // Generate Timeblocks dynamically
  for (let i = 0; i <= workHours; i++) {
    // Convert index to start at 1 for a more standard time format
    const blockHour = i + startTime;

    // Convert 24hr time to standard time for display
    const standardHour = convertHoursToStandard(blockHour);

    // Ternary for AM / PM
    const amPm = blockHour < 12 ? "AM" : "PM";

    // Determine past, present, future
    const currentHour = currentDate.hour();

    // Ternary chain to determine past, present, future (Determines styling)
    const pastPresentFuture =
      blockHour < currentHour
        ? "past"
        : blockHour > currentHour
        ? "future"
        : "present";

    // Create timeblock element
    const timeId = `hour-${blockHour}`;
    const timeBlock = $("<div>", {
      class: `row time-block ${pastPresentFuture}`,
      id: `hour-${blockHour}`,
    });

    // Create hour element
    const hour = $("<div>", {
      class: "col-2 col-md-1 hour text-center py-3",
    }).text(`${standardHour}${amPm}`);

    // Create textarea element
    const textArea = $("<textarea>", {
      class: "col-8 col-md-10 description",
      rows: "3",
    });

    // Check if there is a saved entry for this timeblock
    if (schedule.timeline[timeId]) {
      textArea.val(schedule.timeline[timeId]);
    }

    // Create save button element
    const saveBtn = $("<button>", {
      class: "btn saveBtn col-2 col-md-1",
    }).html('<i class="fas fa-save"></i>');

    $("#timeline").append(timeBlock.append([hour, textArea, saveBtn]));
  }

  let saveTimeout;
  $(".saveBtn").on("click", function () {
    // Get the entry number from the timeblock id
    const entry = $(this).closest(".time-block").attr("id");

    // Get the text value from the textarea
    const text = $(this).siblings(".description").val();

    // Check if text is empty
    if (text == "" && schedule.timeline[entry]) {
      // Remove entry from schedule
      delete schedule.timeline[entry];
    } else {
      // Update the schedule
      schedule.timeline[entry] = text;
    }

    $("#saved-text").removeClass("hidden");

    // Debounce timeout for hiding the saved text
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      $("#saved-text").addClass("hidden");
    }, 1000);

    // Save / Update the schedule to local storage
    localStorage.setItem("schedule", JSON.stringify(schedule));
  });

  // Format date object to display expected output (based on locale)
  // Reuse our date object
  const formattedDate = currentDate.format("dddd, MMMM D");

  // Use Jquery to set in DOM
  $("#currentDay").text(formattedDate);
});

// Helper to reset storage and return the default / reset state
function resetStorageState() {
  // Set a default state for schedule
  localStorage.setItem(
    "schedule",
    JSON.stringify({
      timeline: {},
      lastUpdated: currentDate.toISOString(),
    })
  );

  // Get updated schedule state
  return JSON.parse(localStorage.getItem("schedule"));
}

// Helper function to convert 24hr time to standard time
function convertHoursToStandard(hour) {
  if (hour <= 12) {
    return hour;
  } else if (hour >= 12) {
    return hour - 12;
  }
}
