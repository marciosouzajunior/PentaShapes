
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

var penta_min = {
	e_low: {
	  shape_1: [
		{ string: 'e_high', offset: 0, label: '1' },
		{ string: 'e_high', offset: 3, label: '♭3' },
		{ string: 'b', offset: 0, label: '5' },
		{ string: 'b', offset: 3, label: '♭7' },
		{ string: 'g', offset: 0, label: '♭3' },
		{ string: 'g', offset: 2, label: '4' },
		{ string: 'd', offset: 0, label: '♭7' },
		{ string: 'd', offset: 2, label: '1' },
		{ string: 'a', offset: 0, label: '4' },
		{ string: 'a', offset: 2, label: '5' },
		{ string: 'e_low', offset: 0, label: '1' },
		{ string: 'e_low', offset: 3, label: '♭3' }
	  ],
	  shape_5: [
		{ string: 'e_high', offset: 0, label: '1' },
		{ string: 'e_high', offset: -2, label: '♭7' },
		{ string: 'b', offset: 0, label: '5' },
		{ string: 'b', offset: -2, label: '4' },
		{ string: 'g', offset: 0, label: '♭3' },
		{ string: 'g', offset: -3, label: '1' },
		{ string: 'd', offset: 0, label: '♭7' },
		{ string: 'd', offset: -3, label: '5' },
		{ string: 'a', offset: 0, label: '4' },
		{ string: 'a', offset: -2, label: '♭3' },
		{ string: 'e_low', offset: 0, label: '1' },
		{ string: 'e_low', offset: -2, label: '♭7' }
	  ]
	},
	a: {
	  shape_3: [
		{ string: 'e_high', offset: 0, label: '5' },
		{ string: 'e_high', offset: -2, label: '4' },
		{ string: 'b', offset: 1, label: '♭3' },
		{ string: 'b', offset: -2, label: '1' },
		{ string: 'g', offset: 0, label: '♭7' },
		{ string: 'g', offset: -3, label: '5' },
		{ string: 'd', offset: 0, label: '4' },
		{ string: 'd', offset: -2, label: '♭3' },
		{ string: 'a', offset: 0, label: '1' },
		{ string: 'a', 	offset: -2, label: '♭7' },
		{ string: 'e_low', offset: 0, label: '5' },
		{ string: 'e_low', offset: -2, label: '4' }
	  ],
	  shape_4: [
		{ string: 'e_high', offset: 3, label: '♭7' },
		{ string: 'e_high', offset: 0, label: '5' },
		{ string: 'b', offset: 3, label: '4' },
		{ string: 'b', offset: 1, label: '♭3' },
		{ string: 'g', offset: 2, label: '1' },
		{ string: 'g', offset: 0, label: '♭7' },
		{ string: 'd', offset: 2, label: '5' },
		{ string: 'd', offset: 0, label: '4' },
		{ string: 'a', offset: 3, label: '♭3' },
		{ string: 'a', offset: 0, label: '1' },
		{ string: 'e_low', offset: 3, label:'♭7'},
	    { string: 'e_low', offset: 0, label: '5'}
	  ]
	},
	d: {
		shape_1: [
		  { string: 'e_high', offset: -2, label: '1' },
		  { string: 'e_high', offset: 1, label: '♭3' },
		  { string: 'b', offset: -2, label: '5' },
		  { string: 'b', offset: 1, label: '♭7' },
		  { string: 'g', offset: -2, label: '♭3' },
		  { string: 'g', offset: 0, label: '4' },
		  { string: 'd', offset: -2, label: '♭7' },
		  { string: 'd', offset: 0, label: '1' },
		  { string: 'a', offset: -2, label: '4' },
		  { string: 'a', offset: 0, label: '5' },
		  { string: 'e_low', offset: -2, label:'1'},
		  { string: 'e_low', offset: 1, label: '♭3'}
		],
		shape_2: [
		  { string: 'e_high', offset: 3, label: '4' },
		  { string: 'e_high', offset: 1, label: '♭3' },
		  { string: 'b', offset: 3, label: '1' },
		  { string: 'b', offset: 1, label: '♭7' },
		  { string: 'g', offset: 2, label: '5' },
		  { string: 'g', offset: 0, label: '4' },
		  { string: 'd', offset: 3, label: '♭3' },
		  { string: 'd', offset: 0, label: '1' },
		  { string: 'a', offset: 3, label: '♭7' },
		  { string: 'a', offset: 0, label: '5' },
		  { string: 'e_low', offset: 3, label:'4'},
		  { string: 'e_low', offset: 1, label: '♭3'}
		]
	}
  };


$('#reset-button').click(function() {
	reset();
	showAllNotes();
	$('#root-note').text('');
	$('#reset-button').attr('disabled', 'disabled');
});

function reset() {

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
	$('#shape-checkbox input[type="checkbox"]')
		.prop('checked', false)
		.prop('disabled', true);

}

function hideAllNotes() {
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

	// TODO: Add logic to render shapes for other strings
	if (string == 'e_high' || string == 'b' || string == 'g') {
		alert('This string is not available. Select the root note in lower strings.');
		return;
	}

	$('.info-message').hide();
	$('#reset-button').removeAttr('disabled');

	reset();
	hideAllNotes();

	// Display the root note
	var rootNote = notes[string][index];
	$('#root-note').text(rootNote);

	// Get selected scale
	var selectedScale = $('#scale-select').val();

	// If is penta_min
	if (selectedScale == 'penta_min') {

		// Get available shapes
		var shapes = penta_min[string];

		// Iterate the shapes and notes
		for (var shape in shapes) {

			// Set checkbox checked and enabled
			$('#' + shape).prop('checked', true);
			$('#' + shape).removeAttr('disabled');

			var shapeData = shapes[shape];

			for (var noteData of shapeData) {

				var stringName = noteData.string;
				var offset = noteData.offset;
				var label = noteData.label;

				var currentNote = $('.mask[data-string="' + stringName + '"] li[data-index="' + (index + offset) + '"]');

				// Activate, set text and visibility
				currentNote.removeClass('inactive');
				if (label == '1') {
					currentNote.addClass('active-root');
				}
				else {
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

}


function shapeClick(){

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