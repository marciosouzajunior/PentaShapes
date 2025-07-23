let progression = [];

// add-to-progression click handler
$('#add-to-progression').click(function() {

	// check if root is set
	if ($('#root-note').hasClass('info-message')) {
		alert('Please select a root note on the guitar neck first.');
		return;
	}

	const scaleSelect = $('#scale-select option:selected');
	const scaleId = scaleSelect.val();
	const scaleName = scaleSelect.text();
	const rootNote = $('#root-note').text();	
	const shapeIds = $('.shape-checkbox:checked').map(function() {
		return $(this).attr('id');
	}).get().join(', ');
	const notesHtml = document.querySelector('.notes').innerHTML;

	progression.push({
		index: progression.length,
		scaleId: scaleId,
		scaleName: scaleName,
		root: rootNote,
		shapeIds: shapeIds,
		html: notesHtml
	});

	updateProgressionTable();

	console.log("Progression updated:", progression);

});

function updateProgressionTable() {
	const tbody = $('#progression-table tbody');
	tbody.empty();

	// append each item in the progression array to the table 
	progression.forEach((item, i) => {
		const row = $(`
			<tr data-index="${i}">		
				<td>${i + 1}</td>
				<td>${item.scaleName}</td>
				<td>${item.root}</td>
				<td><a href="#" class="remove-row" title="Remove">×</a></td>
			</tr>
		`);
		tbody.append(row);
	});

	// Remove item
	$('.remove-row').off('click').on('click', function(e) {
		e.preventDefault();
		const index = $(this).closest('tr').data('index');
		progression.splice(index, 1);
		updateProgressionTable();
	});

	// Select item
	$('#progression-table tbody tr').off('click').on('click', function(e) {
		
		// Avoid conflict with remove-row click
		if ($(e.target).hasClass('remove-row')) return;

		const index = $(this).data('index');
		const item = progression[index];

		// Update selected row
		$('#progression-table tbody tr').removeClass('selected');
		$(this).addClass('selected');

		// Re-render scale data
		crossfadeNotes(item.html);

		// Update other info
		$('#scale-select').val(item.scaleId);
		$('#root-note').removeClass('info-message').text(item.root);
		
		// Select shapes based on item.shapeIds
		$('.shape-checkbox').prop('checked', false).prop('disabled', true);
		item.shapeIds.split(', ').forEach(shapeId => {
			$('#' + shapeId).prop('checked', true).removeAttr('disabled');
		});		

		$('#reset-button').removeAttr('disabled');
	});
}

function crossfadeNotes(newHtml) {
	const $notes = $('.notes');
  
	// Create a temporary div to hold the new HTML
	const $temp = $('<div class="notes-temp"></div>').html(newHtml).css({
	  width: '100%',
	  opacity: 0,
	  zIndex: 10
	});

	// Add the temporary div to the notes container
	$notes.append($temp);

	// Fade out current children except the temp div
	$notes.children(':not(.notes-temp)').fadeOut(500);

	// Fade in the temp div
	$temp.animate({opacity: 1}, 500, function() {
		// After fade in completes:
		// Remove old notes content (everything except .notes-temp)
		$notes.children(':not(.notes-temp)').remove();
	
		// Remove the temporary styling/class to make it the official notes container content
		$temp.css({
		  zIndex: '',
		  opacity: ''
		}).removeClass('notes-temp');
	});
}

let rotationInterval = null;
let currentIndex = 0;
let intervalSeconds = 5;

function startRotation() {	
	stopScalesRotation(); // clear any existing interval
  
	intervalSeconds = parseFloat($('#intervalInput').val()) || 5;
	
	playCurrentRow();
	rotationInterval = setInterval(() => {
		playCurrentRow();
	}, intervalSeconds * 1000);
}

function playCurrentRow() {
	const rows = $('#progression-table tbody tr');

	// simulate a click on the current row
	const row = rows[currentIndex];
	$(row).trigger('click');
	startProgressCircle(intervalSeconds * 1000);

	// move to the next row, looping back to the start
	currentIndex = (currentIndex + 1) % rows.length;
}

function stopScalesRotation() {
  if (rotationInterval) {
    clearInterval(rotationInterval);
    rotationInterval = null;
  }
  stopProgressCircle();
}

$('#play-stop-btn').click(function() {
  if (rotationInterval) {
    stopScalesRotation();
    $(this).text('▶ Play');
  } else {
	if (progression.length < 2) {
		alert('Please add at least two items to the progression before starting rotation.');
		return;
	}
    startRotation();
    $(this).text('■ Stop');
  }
});

let progressAnimationTimeout;

function startProgressCircle(intervalMs) {
	const fill = document.querySelector('.progress-circle .fill');
	const circle = document.querySelector('.progress-circle');
	const radius = 7;
	const total = 2 * Math.PI * radius;
  
	circle.style.display = 'block';  // show the circle
  
	// Remove transiction to reset the circle
	fill.style.transition = 'none';
	fill.style.strokeDashoffset = total;
  
	// Force the browser to recalculate the styles
	fill.getBoundingClientRect();
  
	// Animate from empty to full
	fill.style.transition = `stroke-dashoffset ${intervalMs}ms linear`;
	fill.style.strokeDashoffset = 0;  	
}

function stopProgressCircle() {
  const fill = document.querySelector('.progress-circle .fill');
  const circle = document.querySelector('.progress-circle');

  clearTimeout(progressAnimationTimeout);
  fill.style.transition = '';
  fill.style.strokeDashoffset = 2 * Math.PI * 7;
  circle.style.display = 'none';
}

$('#load-preset').on('click', () => {
	const selectedPreset = $('#preset-select').val();
	if (!selectedPreset) {
	  alert('Please select a valid preset.');
	  return;
	}
	console.log("Loading preset:", selectedPreset);

	progression = [...circleOfFourthsMinor];
	updateProgressionTable();
});

$(document).keydown(function(e) {
	if (e.key === " " || e.code === "Space") {
	  e.preventDefault();
	  playCurrentRow();
	}
});