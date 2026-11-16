import type { StudyPage } from './study-model';

export type EnglishPage = Pick<StudyPage,'paragraphs'|'practice'> & Partial<Pick<StudyPage,'title'|'question'|'answer'|'insight'>>;
export type EnglishMission = {
  title:string; sceneTitle:string; text:string; instruction:string; practiceLabel:string;
  alt:string; prompt?:string; followup?:string; pages:EnglishPage[];
};
export type EnglishTrack = {title:string;summary:string;prerequisites:string[];guideTitle:string;missions:Record<string,EnglishMission>};

export const foundationEnglish:EnglishTrack={
  title:'Minor pentatonic · Part 1',
  summary:'Find the scale through E and A shapes, move the shapes to other keys and create phrases over the backing.',
  prerequisites:['Recognise open Em and Am chords and try moving their shapes with a barre.'],
  guideTitle:'Minor pentatonic · Part 1',
  missions:{
    'first-path':{
      title:'The first path',sceneTitle:'Five notes to start with',practiceLabel:'Practise',alt:'',
      text:'A pentatonic scale has five notes. In this track, we will explore the minor pentatonic, often used in blues and rock melodies and solos. Start in A minor, using the [[chord:Am]] chord as a reference to find the scale on the fretboard.',
      instruction:'Play up and down twice to get to know the shape. Then turn off “Hear example”: play the chord tones first, then add [[note:D]] and [[note:G]] to complete the scale.',
      pages:[{paragraphs:[
        'Move the open [[chord:Em]] shape to fret 5. The barre takes the place of the open strings, turning the chord into [[chord:Am]]. [[note:A]] is the reference for this position.',
        'The chord contains [[note:A]], [[note:C]] and [[note:E]]. The A minor pentatonic adds [[note:D]] and [[note:G]]: five note names that recur at different pitches across the six strings. Solid outlines show the chord tones; [[note:D]] and [[note:G]] have dashed outlines.',
        'Play from low to high and return along the same path. Use your index finger at fret 5, ring finger at 7 and little finger at 8. Each note takes half a beat; slow down if changing strings interrupts the movement.',
        'The degrees use [[note:A]] as their reference: [[note:A]], [[note:C]] and [[note:E]] are [[degree:1]], [[degree:♭3]] and [[degree:5]], the chord tones. [[note:D]] ([[degree:4]]) and [[note:G]] ([[degree:♭7]]) complete the scale. Alternate the chord tones with the full scale to hear what they add.',
      ],practice:'If you lose the shape, find [[note:A]], [[note:C]] and [[note:E]] in the chord again, then look for [[note:D]] and [[note:G]] nearby. Return to the scale at your own pace.'}],
    },
    'moving-the-shape':{
      title:'Moving the shape',sceneTitle:'The same shape finds another key',practiceLabel:'Practise',
      alt:'A small group of dots reappears in the same shape in another place, joined by a curved arrow and movement marks.',
      text:'Return to the A minor scale. Now move your whole hand back two frets: the reference moves from [[note:A]] to [[note:G]], and the same shape finds G minor. We will also try B minor and return to A minor.',
      instruction:'In [[chord:Am]], [[chord:Gm]] and [[chord:Bm]], play through the shape once and play the same two-bar motif. On the return to [[chord:Am]], recall the motif without playing the full scale again.',
      pages:[{paragraphs:[
        'A shape with no open strings can move as a unit. The distances between your fingers stay the same; the chord and scale change key. On the sixth string, [[note:G]] is at fret 3, [[note:A]] at 5 and [[note:B]] at 7. From the new tonic, find the same landmarks: [[degree:♭3]] three frets higher; [[degree:4]] at the same fret on the next higher-pitched string; [[degree:5]] two frets higher on that string.',
        '[[chord:Gm]] contains [[note:G]], [[note:B♭]] and [[note:D]]; its pentatonic adds [[note:C]] and [[note:F]]. [[chord:Bm]] contains [[note:B]], [[note:D]] and [[note:F♯]]; its pentatonic adds [[note:E]] and [[note:A]]. The shape stays intact because every position moves by the same distance.',
        'In each new key, the example plays through the shape once and ends with the same motif: [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]] and back again. Only the motif returns in [[chord:Am]]. Listen for the musical idea moving with the scale shape.',
      ],practice:'Sing or remember the motif in [[chord:Am]]. Move the same idea to [[chord:Gm]] and [[chord:Bm]], keeping its rhythm, rests and contour. If you lose your place, find the tonic on the sixth string before starting again.'}],
    },
    'phrase-and-space':{
      title:'Room for a phrase',sceneTitle:'A blues classic',practiceLabel:'Practise',
      alt:'The degrees show 4 bending up to 5 and landing on 1; after a rest, the phrase descends through ♭7, 5, 4 and ♭3 to return to 1.',
      text:'You have explored the shape. Now listen to a familiar blues gesture: [[note:D]] bends up to [[note:E]] and lands on [[note:A]]. After a rest, the phrase descends through [[note:G]], [[note:E]], [[note:D]] and [[note:C]] before returning to [[note:A]].',
      instruction:'Listen for two bars and respond for four. Start by copying the contour; then keep the rest and try a different rhythm or ending. The backing stays on [[chord:Am]].',
      pages:[{paragraphs:[
        'The first gesture starts on [[note:D]], the fourth of [[note:A]]. A way to find [[degree:4]]: it often sits directly below the tonic in the diagram, at the same fret on the next higher-pitched string. Here, start from [[note:A]] on the fourth string, fret 7, and find [[note:D]] on the third string, also at fret 7. Between the third and second strings, the exception in standard tuning means looking one fret higher for [[degree:4]].',
        'Bend this [[note:D]] up a whole step to sound like [[note:E]], the fifth. Push the third string at fret 7 without changing fret, and compare the target pitch with [[note:E]] on the second string, fret 5.',
        'After the high [[note:A]], the rest separates call and response. The descent [[note:G–E–D–C–A]] uses only pentatonic notes and ends on the tonic. Sing the contour before finding the frets.',
        'In your response, start by copying the length of the rest. Then change only the ending: compare landing on [[note:A]], [[note:C]] or [[note:E]] over the same backing. All three belong to the chord, but each ending has its own sound.',
      ],practice:'Repeat the lick until the bend reaches [[note:E]] without rushing. Then create a short response, keeping space between the ideas.'}],
    },
    'another-starting-point':{
      title:'Another starting point',sceneTitle:'The same degrees, another shape',practiceLabel:'Practise',
      alt:'A delicate pattern of dots changes into another shape; the purple tonic moves from the sixth string to the fifth.',
      text:'You have heard how a chord helps you find the scale. Now use the same idea with [[chord:Dm]] in an [[chord:Am]] shape: start from the chord, complete the pentatonic, then move the new shape to [[chord:Em]] and [[chord:Cm]].',
      instruction:'Each chord follows the same order: Chord, Scale and Motif. Practise [[chord:Dm]], [[chord:Em]] and [[chord:Cm]], keeping the pulse between stages. Hear the scale as an extension of the chord and the motif as a selection from the scale.',
      pages:[{paragraphs:[
        'The fingering x–5–7–7–6–5 gives [[chord:Dm]] in an [[chord:Am]] shape. Keep the sixth string silent. [[note:D]] is [[degree:1]], [[note:F]] is [[degree:♭3]] and [[note:A]] is [[degree:5]]: these three notes form the chord. [[note:G]], the [[degree:4]], and [[note:C]], the [[degree:♭7]], complete the pentatonic.',
        'See the chord as the centre of the shape. First find [[note:D]], [[note:F]] and [[note:A]] on the map. Then look for [[note:G]] and [[note:C]] around them. The scale expands the paths available for a phrase over the chord.',
        'The scale also reaches the sixth string: [[note:A]] and [[note:C]] complete the pattern there. The ascent starts on that low [[note:A]], although the root guiding this shape is [[note:D]] on the fifth string. The chord starts on the fifth string; the scale uses all six.',
        'When moving the shape, build the chord on the fifth string first and recognise its three notes. In [[chord:Dm]], add [[note:G]] and [[note:C]]; in [[chord:Em]], [[note:A]] and [[note:D]]; in [[chord:Cm]], [[note:F]] and [[note:B♭]]. These are always [[degree:4]] and [[degree:♭7]] completing [[degree:1]], [[degree:♭3]] and [[degree:5]].',
        'The labels organise three stages for each chord. In Chord, play the full shape twice and hear [[degree:1]], [[degree:♭3]] and [[degree:5]] together. In Scale, play through the full pattern. In Motif, use [[degree:1]], [[degree:♭3]], [[degree:4]] and [[degree:5]] and return along the same contour. The order stays the same in [[chord:Em]] and [[chord:Cm]].',
      ],practice:'Follow the Chord, Scale and Motif labels. Play the full chord shape twice before playing through the scale and repeating the motif.'}],
    },
    'next-chord':{
      title:'The next chord',sceneTitle:'A few notes, plenty of space',practiceLabel:'Practise',
      alt:'The Am and Dm shapes overlap; most dots coincide, while a purple E moves one fret to a green F.',
      text:'This lick uses a familiar blues idea: a few high notes, space between phrases and an expressive bend. When [[chord:Dm]] arrives, [[note:E]] moves up one fret to [[note:F]], and the response continues over the new chord.',
      instruction:'Play along for two bars of [[chord:Am]] and two of [[chord:Dm]]. Then improvise for four bars on each chord. Use [[note:E–F]] to follow the change; add the bend when you feel comfortable.',
      pages:[{paragraphs:[
        'The first idea plays [[note:A–C–A]] and leaves a rest. The response descends through [[note:G]] and [[note:E]]; then [[note:D]] bends up to [[note:E]]. Play slowly and let each note finish before moving on: the space is part of the lick.',
        'One way to connect chords is to choose a note from [[chord:Am]] and take a short path to a note from [[chord:Dm]]. Here, [[note:E]] is [[degree:5]] of [[chord:Am]], and [[note:F]] is [[degree:♭3]] of [[chord:Dm]]. They sit side by side on the second string, frets 5 and 6. This one-fret step follows the change in the backing.',
        '[[note:A]] belongs to both chords: it is [[degree:1]] in [[chord:Am]] and [[degree:5]] in [[chord:Dm]]. Sustaining it through the change creates continuity, even as its role changes.',
        '[[note:C]] is also shared: [[degree:♭3]] of [[chord:Am]] and [[degree:♭7]] of [[chord:Dm]]. Use shared notes to sustain a phrase and neighbouring notes, such as [[note:E–F]], to lead it onwards. The change can continue the phrase you are already playing.',
        'These are two possibilities, rather than a rule: choose a note of the next chord as your destination, or hold a shared note while the harmony changes.',
      ],practice:'For your own response, try ending a phrase on [[note:E]] over [[chord:Am]] and reaching [[note:F]] when [[chord:Dm]] arrives. Leave a rest before starting another idea.'}],
    },
    'cycle-of-fourths':{
      title:'Around the sequence',sceneTitle:'Part of the cycle of fourths',practiceLabel:'Practise',
      alt:'Am, Dm, Gm and Cm sit at four evenly spaced points on a hand-drawn circle.',
      text:'Start on [[chord:Am]] and move up a fourth to [[chord:Dm]]. Repeat the movement to reach [[chord:Gm]], then [[chord:Cm]]. This comes from the cycle of fourths, a simple order for moving an idea between related keys. After [[chord:Cm]], reverse the path: play over [[chord:Gm]] and [[chord:Dm]] again before restarting on [[chord:Am]].',
      followup:'The motif repeats the tonic with short attacks, then descends to a sustained ending. Listen to the passage to get to know this gesture.',
      instruction:'In [[chord:Am]], [[chord:Dm]], [[chord:Gm]] and [[chord:Cm]], play along for two bars and improvise for two. After [[chord:Cm]], [[chord:Gm]] and [[chord:Dm]] each last four bars with backing only: improvise from the chord change.',
      pages:[{paragraphs:[
        'In each chord, the motif uses a selection from the pentatonic. The table below shows which shapes to use for your response.',
        'A way to find the fourth: from the sixth string, it is at the same fret on the next higher-pitched string. At fret 5, [[note:A]] leads to [[note:D]] on the fifth string. At fret 3, [[note:G]] leads to [[note:C]]. These pairs help you locate the regions in the sequence.',
      ],practice:'Create a phrase of your own. Try playing the same note twice before continuing. If you like, add a bend or connect two notes on the same string with a slide.',
      insight:{afterParagraph:2,afterPractice:true,title:'Explore later',text:'In this Berklee Online lesson, Rick Peckham introduces the cycle of fourths and demonstrates how to use it for guitar practice.',link:{label:'Watch the lesson on the cycle of fourths',href:'https://www.youtube.com/watch?v=1DcOm0v3XAQ'}}}],
    },
  },
};

export const purpleEnglish:EnglishTrack={
  title:'Purple Haze',summary:'From the opening octaves to the chords and solo. Listen to the passages, practise with the backing and create your own response.',prerequisites:[],guideTitle:'Notes and relationships in Purple Haze',
  missions:{
    s01:{title:'An octave apart',sceneTitle:'One sound calls, another answers',practiceLabel:'Practise the opening',
      text:'At the start of Purple Haze, the guitar alternates a low sound with a high one. Listen to them in sequence and notice what changes.',prompt:'Why do these two sounds seem so similar?',
      alt:'A curved dotted arrow points from the low note to the high note.',
      instruction:'Alternate the low and high [[note:B♭]]: the same note at different pitches. Compare them with [[note:E]], the reference point of the music.',
      pages:[{title:'An echo on the fretboard',paragraphs:['The pitch changes. Both sounds are [[note:B♭]], an octave apart. Find the low note on the thickest string and the high one on the D string, two frets higher.'],practice:'Play the low [[note:B♭]] and let it ring. Answer with the high one, then return to the low one. Repeat until you can hear the leap before playing it.',question:'Are the two B♭ notes at the same pitch?',answer:'No. They are the same note in different octaves: a low B♭ and its higher version.'},
        {title:'The contrast with E',paragraphs:['Play [[note:E]] before returning to [[note:B♭]]. [[note:E]] is the reference point of the music. Remember the two sounds together and listen for the contrast in the opening.','There are six semitones, or three whole steps, between [[note:E]] and [[note:B♭]]. This distance is called a tritone. [[note:B♭]] can also be labelled [[degree:♭5]]: the fifth of [[note:E]], [[note:B]], lowered by a semitone.'],practice:'Play [[note:E]], then leap between the two [[note:B♭]] notes. Return to [[note:E]] and hear what changes as the phrase reaches that reference point.',question:'Does [[degree:♭5]] mean fret 5?',answer:'No. [[degree:♭5]] means the fifth of E lowered by a semitone: B♭.'}],
    },
    s02:{title:'The answering riff',sceneTitle:'The first notes of the riff',practiceLabel:'Practise the riff',
      text:'The riff rises through [[note:B]], [[note:D]] and [[note:G]], then lands on a sustained [[note:A]]. Listen to what follows. The guitar answers in a lower register and returns to [[note:E]]. Notice how the rise and the response move differently, while using notes from the same scale.',
      alt:'The drawing rises from B to D and G, drops to a sustained A, then continues into the low response.',
      instruction:'Listen to [[note:B–D–G]] rise and land on [[note:A]] before the low response. Hear how these notes relate to [[note:E]].',
      pages:[{title:'The pentatonic on the fretboard',paragraphs:['[[note:E]], [[note:G]], [[note:A]], [[note:B]] and [[note:D]] form the E minor pentatonic. Follow the purple notes on the fretboard below to find the start of the riff. Dashed circles complete the scale shape in this region.'],practice:'Find [[note:B]], [[note:D]], [[note:G]] and [[note:A]] on the fretboard. Play them in the order of the example and let [[note:A]] ring. When the first part feels comfortable, add the low response.',question:'Do I need all five notes in every phrase?',answer:'No. The scale offers possibilities. An idea can use just two or three notes, with repetition, different lengths and rests.'}],
    },
    's02-variation':{title:'The rising A',sceneTitle:'The finger stays, the pitch rises',practiceLabel:'Practise the variation',
      text:'After the riff, [[note:G]] and [[note:A]] return in a short phrase. The second [[note:A]] rises to [[note:B]] before the phrase returns to [[note:G]]. Listen to the difference between the two [[note:A]] notes.',
      alt:'G, A, then another A bending up to B before returning to G.',
      instruction:'Listen to [[note:G]] and [[note:A]] gain movement. The bend takes [[note:A]] towards [[note:B]], then the phrase returns to [[note:G]].',
      pages:[{title:'Bending A to B',paragraphs:['The second [[note:A]] rises because the string is stretched while the note sounds. This gesture is called a bend. The mark ↗1t means a whole-step bend, the distance from [[note:A]] to [[note:B]].'],practice:'Play [[note:B]] to remember the target pitch. Return to [[note:A]] and use your ring finger, supported by the fingers behind it, to bend the string until you hear [[note:B]]. Then place the gesture between the first [[note:A]] and the return to [[note:G]].',question:'Does a bend change fret?',answer:'No. Stretching the string changes the pitch while your finger stays at the starting fret.'}],
    },
    s05:{title:'Three chords, back to E',sceneTitle:'The path back to E',practiceLabel:'Play with the backing',
      text:'In the verse backing, the [[chord:E]] chord lasts four beats. [[chord:G]] and [[chord:A]] move faster, with two beats each. Listen to the sequence and count along to feel when it is time to return to [[chord:E]].',
      alt:'E7♯9 lasts four beats. G and A last two beats each.',
      instruction:'Play [[chord:E7♯9]] for four beats, [[chord:G]] for two and [[chord:A]] for two. Repeat the sequence, returning to [[chord:E7♯9]].',
      pages:[{title:'The colour of the first chord',paragraphs:[
        'Start with [[note:E]], the root that names the chord. Add [[note:G♯]], the major third. The fifth of [[note:E]] is [[note:B]], which is omitted in this fingering.',
        'Add [[note:D]], the minor seventh of [[note:E]]. This is the note indicated by [[degree:7]] in the chord name.',
        'Finally add the high [[note:G]], marked [[degree:♯9]]. This is the augmented ninth. Play the first three notes together, then add this [[note:G]] to hear the change.',
        'Use the four middle strings for [[chord:E7♯9]]. [[chord:G]] and [[chord:A]] use open shapes. Keep the thickest string silent for [[chord:A]].',
      ],practice:'',question:'What sounds do [[degree:7]] and [[degree:♯9]] add to the E chord?',answer:'D is the minor seventh; the high G sounds the augmented ninth. F♯ is only a reference for understanding how the augmented ninth is reached.',insight:{afterParagraph:4,title:'From second to ninth',text:'In E, the major second is F♯. Play that F♯ an octave higher and you have the ninth. To reach [[degree:♯9]], move one more fret on the same string. That is the high G in this chord.'}}],
    },
    s03:{title:'E in another place',sceneTitle:'The hand changes position',practiceLabel:'Practise the solo motif',
      text:'Near the solo entrance, a phrase rises from [[note:C♯]] to [[note:E]] and [[note:B]]. The next starts on the same [[note:E]], played on another string, and reaches a high [[note:G]]. Listen to the two [[note:E]] notes and notice how they connect the parts.',
      alt:'C♯, E and B rise in the first phrase. In the second, E returns at the same pitch before two G notes in different octaves.',
      instruction:'Listen to [[note:C♯–E–B]] and compare it with the higher passage. Find the same [[note:E]] in two positions before joining the parts.',
      pages:[{title:'Two paths to the same E',paragraphs:['The first [[note:E]] is on the G string and the second on the D string, at the same pitch. The second position brings your hand closer to the high [[note:G]] that follows. Compare the two [[note:G]] notes in the diagram: the second is an octave above the first.','The ↗¼ mark on [[note:B]] and the high [[note:G]] means a quarter-tone bend. It is a small movement of the string, much smaller than the [[note:A]] to [[note:B]] bend in the riff variation.'],practice:'Play [[note:C♯–E–B]], then find the same [[note:E]] on the D string to start the second part. Change position slowly, keeping [[note:E]] as your reference sound.',question:'Does changing position always change the pitch?',answer:'No. The two E notes have the same pitch; the two G notes are an octave apart.'}],
    },
    s04:{title:'A response of your own',sceneTitle:'What comes after the phrase?',practiceLabel:'Create a response',
      text:'The passage rises from [[note:E]] to [[note:G]] and [[note:A]], then returns to [[note:E]] and lets [[note:G]] ring. Listen to the contour and imagine what could follow. You can repeat the opening and change just the last note.',
      alt:'The phrase rises, falls and rises again. After the arrow, a dotted line suggests a path for your own response.',
      instruction:'Find the phrase in the E minor pentatonic shape and use the highlighted [[note:E]] notes as references. The dashed [[note:F♯]] and [[note:C♯]] are extra notes to try in your own response.',
      pages:[{title:'Notes for your response',paragraphs:['Use the [[note:E]] notes in the diagram as references. Around them is the E minor pentatonic you heard in the riff. Choose two or three nearby notes and leave a rest between the phrase you heard and your response.','[[note:F♯]] and [[note:C♯]] have dashed outlines. They are two extra notes to try after finding a response with the pentatonic notes.'],practice:'Start by creating a response with [[note:G]], [[note:A]] and [[note:E]]. In the next round, keep its opening and try ending on [[note:G]]. Hear how the ending changes.',question:'Are these all the notes in the solo?',answer:'No. This is a selection to start exploring; the recording includes other passages, bends and expressive variations.'}],
    },
  },
};
