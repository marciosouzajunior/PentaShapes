
var notes = {
	e_high: ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
	b:  	['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
	g:  	['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
	d:  	['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
	a:  	['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', "A", 'A#', 'B', 'C', 'C#', 'D'],
	e_low:  ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
}

for (var i = 0; i < notes.e_low.length; i++) {
	$('.mask.high-e ul').append('<li class="inactive" data-index=' + i + ' data-note=' + notes.e_high[i] 	+ ' onclick="renderShapes(\'e_high\',' 	+ i + ')">' + notes.e_high[i] + '</li>')
	$('.mask.b ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.b[i] 		+ ' onclick="renderShapes(\'b\',' 		+ i + ')">' + notes.b[i] + '</li>')
	$('.mask.d ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.d[i] 		+ ' onclick="renderShapes(\'d\',' 		+ i + ')">' + notes.d[i] + '</li>')
	$('.mask.g ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.g[i] 		+ ' onclick="renderShapes(\'g\',' 		+ i + ')">' + notes.g[i] + '</li>')
	$('.mask.a ul')		.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.a[i] 		+ ' onclick="renderShapes(\'a\',' 		+ i + ')">' + notes.a[i] + '</li>')
	$('.mask.low-e ul')	.append('<li class="inactive" data-index=' + i + ' data-note=' + notes.e_low[i] 	+ ' onclick="renderShapes(\'e_low\',' 	+ i + ')">' + notes.e_low[i] + '</li>')
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
	}
  };


function reset(){

	$('.guitar-neck .notes li').each(function() {
		var note = $(this).data('note');
		$(this).text(note);

		// remove the class active
		$(this).removeClass('active');
		$(this).addClass('inactive');
	});

}

function hideAll() {
	$('.guitar-neck .notes li').each(function() {
		$(this).css('visibility', 'hidden');
	});
}

function renderShapes(string, index) {

	reset();
	hideAll();

	// TODO: Add logic to render shapes for other strings
	if (string == 'e_high' || string == 'b' || string == 'g') {
		alert('This string is not available. Select the root note in lower strings.');
		return;
	}

	// Display the root note
	var rootNote = notes[string][index];
	$('#root-note').text(rootNote);

	// Get selected scale
	var selectedScale = $('#scale-select').val();
	console.log(selectedScale);

	// If is penta_min
	if (selectedScale == 'penta_min') {

		// Get available shapes
		var shapes = penta_min[string];
		//console.log(shapes);

		// Iterate the shapes and notes
		for (var shape in shapes) {

			var shapeData = shapes[shape];

			for (var noteData of shapeData) {

				var stringName = noteData.string;
				var offset = noteData.offset;
				var label = noteData.label;

				$('.mask[data-string="' + stringName + '"] li[data-index="' + (index + offset) + '"]').removeClass('inactive');
				$('.mask[data-string="' + stringName + '"] li[data-index="' + (index + offset) + '"]').addClass('active');
				$('.mask[data-string="' + stringName + '"] li[data-index="' + (index + offset) + '"]').text(label);
				$('.mask[data-string="' + stringName + '"] li[data-index="' + (index + offset) + '"]').css('visibility', 'visible');






				
			}

		}


	}



	// activate the selected note
	//$('.mask[data-string="' + string + '"] li[data-note="' + rootNote + '"]').removeClass('inactive');
	//$('.mask[data-string="' + string + '"] li[data-note="' + rootNote + '"]').addClass('active');
	//console.log('.guitar-neck .notes div[data-string="e_low"] .' + string + ' li[data-note="' + note + '"]');
	


	

	


}

function getShapesByString(data, stringName) {
	if (!data[stringName]) return [];

	return Object.keys(data[stringName]);
}