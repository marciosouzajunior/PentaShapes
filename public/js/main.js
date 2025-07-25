
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

	// Set custom shape labels if available
	var selectedScaleName = $(this).val();
	var selectedScale = scales[selectedScaleName];	
	if (selectedScale && selectedScale.shape_labels) {
		$('span[name="shape_label"]').each(function(index) {			
			$(this).parent().show();			
			let shape_label = selectedScale.shape_labels[index];			
			if (!shape_label) {
				$(this).parent().hide();				
				return;
			}
			$(this).text(shape_label);
		});	
	}
});

// Auto select penta_min
$('#scale-select').val('penta_min').change();

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