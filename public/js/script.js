
var notes = {
	e_high: ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
	b:  	['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
	g:  	['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
	d:  	['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
	a:  	['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', "A", 'A#', 'B', 'C', 'C#', 'D'],
	e_low:  ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
}

for (var i = 0; i < notes.e_low.length; i++) {
	$('.mask.high-e ul').append('<li class="inactive" data-index=' + i + ' data-note=' + notes.e_high[i] 	+ ' data-shape=\'\' onclick="renderShapes(\'e_high\',' 	+ i + ')">' + notes.e_high[i] + '</li>')
	$('.mask.b ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.b[i] 		+ ' data-shape=\'\' onclick="renderShapes(\'b\',' 		+ i + ')">' + notes.b[i] + '</li>')
	$('.mask.d ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.d[i] 		+ ' data-shape=\'\' onclick="renderShapes(\'d\',' 		+ i + ')">' + notes.d[i] + '</li>')
	$('.mask.g ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.g[i] 		+ ' data-shape=\'\' onclick="renderShapes(\'g\',' 		+ i + ')">' + notes.g[i] + '</li>')
	$('.mask.a ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.a[i] 		+ ' data-shape=\'\' onclick="renderShapes(\'a\',' 		+ i + ')">' + notes.a[i] + '</li>')
	$('.mask.low-e ul')	.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.e_low[i] 	+ ' data-shape=\'\' onclick="renderShapes(\'e_low\',' 	+ i + ')">' + notes.e_low[i] + '</li>')
}

$('#scale-select').change(function() {
	$('#reset-button').click();
});

$('#reset-button').click(function() {
	deactivateNotes();
	showAllNotes();
	$('#root-note').addClass('info-message');
	$('#root-note').text('Select a root note on the guitar neck to see the scale.');
	$('#reset-button').attr('disabled', 'disabled');
	$('.info-message').show();
});

function deactivateNotes() {

	$('.guitar-neck .notes li').each(function() {

		// Reset the text to the note name
		var note = $(this).data('note');
		$(this).text(note);

		// Remove the class active
		$(this).removeClass('active active-root');
		$(this).addClass('inactive');

		// Clean data-shape attr
		$(this).attr('data-shape', '');

	});

	// Reset all checkboxes
	$('.shape-checkbox')
		.prop('checked', false)
			.prop('disabled', true);

}

function hideNotes() {
	$('.guitar-neck .notes li').each(function() {
		$(this).css('visibility', 'hidden');
	});
}

function showAllNotes() {
	$('.guitar-neck .notes li').each(function() {
		$(this).css('visibility', 'visible');
	});
}

function renderShapes(string, index) {

	// Get selected scale
	var selectedScaleName = $('#scale-select').val();
	
	// Display the root note
	var rootNote = notes[string][index];
	$('#root-note').text(rootNote);

	// For the roots scale, we use a different function
	if (selectedScaleName == 'roots') {
		activateNotes(rootNote);
		return;
	}

	// Get the selected scale data
	var selectedScale = scales[selectedScaleName];

	// Get available strings
	var availableStrings = Object.keys(selectedScale);
	if (availableStrings.indexOf(string) == -1) {
		alert('This string is not available for this scale.\nSelect one of the available strings: ' + 
			availableStrings.join(', ')
			.replace(/_/g, ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' '));
		return;
	}

	$("#root-note").removeClass('info-message');
	$('#reset-button').removeAttr('disabled');
	
	deactivateNotes();
	hideNotes();

	// Get available shapes by string
	var shapes = selectedScale[string];

	// Iterate the shapes
	for (var shape in shapes) {

		// Set checkbox checked and enabled for the available shapes
		$('#' + shape).prop('checked', true);
		$('#' + shape).removeAttr('disabled');

		var shapeData = shapes[shape];

		// Iterate the shape data
		for (var noteData of shapeData) {

			var stringName = noteData.string;
			var offset = noteData.offset;
			var label = noteData.label;

			var currentNote = $('.mask[data-string="' + stringName + '"] li[data-index="' + (index + offset) + '"]');

			// Activate, set text and visibility
			currentNote.removeClass('inactive');
			if (label == '1' || label == '8') {
				currentNote.addClass('active-root');
			} else {
				currentNote.addClass('active');
			}
			currentNote.text(label);
			currentNote.css('visibility', 'visible');

			// Add or update data-shape attr
			if (currentNote.attr('data-shape') == '') {
				currentNote.attr('data-shape', shape);
			} else {
				currentNote.attr('data-shape', currentNote.attr('data-shape') + ',' + shape);
			}
						
		}

	}

}

function shapeClick() {

	// Iterate all notes that has data-shape attr
	$('.guitar-neck .notes li[data-shape]').each(function() {

		var shape = $(this).attr('data-shape');
		var shapeArray = shape.split(',');

		// Check if any shape present in the note has checked checkbox
		var isActive = isAnyShapeActive(shapeArray);
		if (isActive) {
			// If any shape is active, set the note to active
			$(this).removeClass('inactive');
			$(this).addClass('active');
		} else {
			// If no shape is active, set the note to inactive
			$(this).removeClass('active');
			$(this).addClass('inactive');
		}

	});


}

function isAnyShapeActive(shapeArray) {
	var isActive = false;

	for (var i = 0; i < shapeArray.length; i++) {
		if ($('#' + shapeArray[i]).is(':checked')) {
			isActive = true;
			break;
		}
	}

	return isActive;
	
}

function activateNotes(note) {
	
	$('#reset-button').removeAttr('disabled');
	$('#root-note').removeClass('info-message');

	$('.guitar-neck .notes li').each(function() {
		if ($(this).data('note') == note) {
			$(this).removeClass('inactive');
			$(this).addClass('active-root');
		}
	});

}

//
// Handle scale progression feature
//
const progression = [];

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
