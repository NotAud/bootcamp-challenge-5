// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Create a date object to be used throughout app
  const currentDate = new Date();

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
    const standardHour = convertHoursToStandard(blockHour);

    // Ternary for AM / PM
    const amPm = blockHour < 12 ? "AM" : "PM";

    // Determine past, present, future
    const currentHour = currentDate.getHours();

    // Ternary chain to determine past, present, future (Determines styling)
    const pastPresentFuture =
      blockHour < currentHour
        ? "past"
        : blockHour > currentHour
        ? "future"
        : "present";

    // Create timeblock element
    const timeBlock = $("<div>", {
      class: `row time-block ${pastPresentFuture}`,
      id: `hour-${blockHour}`,
    }).data("entry", i);

    // Create hour element
    const hour = $("<div>", {
      class: "col-2 col-md-1 hour text-center py-3",
    }).text(`${standardHour}${amPm}`);

    // Create textarea element
    const textArea = $("<textarea>", {
      class: "col-8 col-md-10 description",
      rows: "3",
    });

    // Create save button element
    const saveBtn = $("<button>", {
      class: "btn saveBtn col-2 col-md-1",
    }).html('<i class="fas fa-save"></i>');

    $("#timeline").append(timeBlock.append([hour, textArea, saveBtn]));
  }

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?

  $("#target").on("click", function () {
    alert("Handler for `click` called.");
  });

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //

  // Format date object to display expected output (based on locale)
  // Reuse our date object
  const formattedDate = currentDate.toLocaleDateString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Use Jquery to set in DOM
  $("#currentDay").text(formattedDate);
});

// Helper function to convert 24hr time to standard time
function convertHoursToStandard(hour) {
  if (hour <= 12) {
    return hour;
  } else if (hour >= 12) {
    return hour - 12;
  }
}
