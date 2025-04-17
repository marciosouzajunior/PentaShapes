var slideSpeed = 300;
var noteToShow = "All";
var canClick = true;

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
/*
$('.controls a.down').click(function () {
	if (!canClick) { return false; }
	canClick = false;

	$('.mask').each(function () {
		var el = $(this);
		var nextNote = el.find('li:nth-child(12)').text();

		el.animate({ right: -268 }, slideSpeed);
		setTimeout(function () {
			el.find('ul').prepend("<li note=" + nextNote + ">" + nextNote + "</li>");
			el.find('li:last-child').remove();
			el.css({ right: -189 });
		}, slideSpeed + 20)
	});

	setTimeout(function () {
		changeOpenNotes();
		showNotes(noteToShow);
		canClick = true;
	}, slideSpeed + 20)

	return false;
});

$('.controls a.up').click(function () {
	if (!canClick) { return false; }
	canClick = false;

	$('.mask').each(function () {
		var el = $(this);
		var nextNote = el.find('li:nth-child(2)').text();

		$("<li note=" + nextNote + ">" + nextNote + "</li>").appendTo(el.find('ul'));
		el.css({ right: -268 });
		el.find('li:first-child').remove();
		el.animate({ right: -189 }, slideSpeed);

	});

	changeOpenNotes();
	showNotes(noteToShow);

	setTimeout(function () {
		canClick = true;
	}, slideSpeed + 20)
	return false;
});

$('.controls li').click(function () {
	noteToShow = $(this).text();
	showNotes(noteToShow);
});

function showNotes(noteToShow) {
	if (noteToShow == "All") {
		$('.guitar-neck .notes li').animate({ opacity: 1 }, 500);
	} else {
		$('.guitar-neck .notes li').not('[note="' + noteToShow + '"]').animate({ opacity: 0 }, 500);
		$('.guitar-neck .notes li[note="' + noteToShow + '"]').animate({ opacity: 1 }, 500);
	}
}

function changeOpenNotes() {
	$('.notes .mask').each(function () {
		var el = $(this);
		var elClass = el.attr('class').split(' ')[1];
		var note = el.find('li:last-child').text();

		$('.open-notes .' + elClass).text(note);
	});
}
*/
function inactiveAll(){
	$('.guitar-neck .notes li').removeClass('active');
	$('.guitar-neck .notes li').addClass('inactive');
}

function renderShapes(string, index) {

	inactiveAll();

	console.log(string, index);

	// TODO: Add logic to render shapes for other strings
	if (string == 'e_high' || string == 'b' || string == 'g') {
		alert('This string is not available. Select the root note in lower strings.');
		return;
	}
	var note = notes[string][index];
	console.log(note);
	// activate the selected note
	$('.mask[data-string="' + string + '"] li[data-note="' + note + '"]').removeClass('inactive');
	$('.mask[data-string="' + string + '"] li[data-note="' + note + '"]').addClass('active');
	//console.log('.guitar-neck .notes div[data-string="e_low"] .' + string + ' li[data-note="' + note + '"]');
	
	

	


}