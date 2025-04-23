const scales = (() => {

    const penta_min = {
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
                { string: 'a', offset: -2, label: '♭7' },
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
                { string: 'e_low', offset: 3, label: '♭7' },
                { string: 'e_low', offset: 0, label: '5' }
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
                { string: 'e_low', offset: -2, label: '1' },
                { string: 'e_low', offset: 1, label: '♭3' }
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
                { string: 'e_low', offset: 3, label: '4' },
                { string: 'e_low', offset: 1, label: '♭3' }
            ]
        }
    };

    const chromatic = {
        e_low: {
            shape_1: [
                { string: 'e_low', offset: 12, label: '1' },
                { string: 'e_low', offset: 11, label: '∆7' },
                { string: 'e_low', offset: 10, label: '∆6' },
                { string: 'e_low', offset: 9, label: '♭6' },
                { string: 'e_low', offset: 8, label: 'p5' },
                { string: 'e_low', offset: 7, label: '♭5' },
                { string: 'e_low', offset: 6, label: '4' },
                { string: 'e_low', offset: 5, label: 'p4' },
                { string: 'e_low', offset: 4, label: '∆3' },
                { string: 'e_low', offset: 3, label: '♭3' },
                { string: 'e_low', offset: 2, label: '∆2' },
                { string: 'e_low', offset: 1, label: '♭2' },
                { string: 'e_low', offset: 0, label: '1' }
            ]
        },
        a: {
            shape_1: [
                { string: 'a', offset: 12, label: '1' },
                { string: 'a', offset: 11, label: '∆7' },
                { string: 'a', offset: 10, label: '∆6' },
                { string: 'a', offset: 9, label: '♭6' },
                { string: 'a', offset: 8, label: 'p5' },
                { string: 'a', offset: 7, label: '♭5' },
                { string: 'a', offset: 6, label: '4' },
                { string: 'a', offset: 5, label: 'p4' },
                { string: 'a', offset: 4, label: '∆3' },
                { string: 'a', offset: 3, label: '♭3' },
                { string: 'a', offset: 2, label: '∆2' },
                { string: 'a', offset: 1, label: '♭2' },
                { string: 'a', offset: 0, label: '1' }
            ]
        },
        d: {
            shape_1: [
                { string: 'd', offset: 12, label: '1' },
                { string: 'd', offset: 11, label: '∆7' },
                { string: 'd', offset: 10, label: '∆6' },
                { string: 'd', offset: 9, label: '♭6' },
                { string: 'd', offset: 8, label: 'p5' },
                { string: 'd', offset: 7, label: '♭5' },
                { string: 'd', offset: 6, label: '4' },
                { string: 'd', offset: 5, label: 'p4' },
                { string: 'd', offset: 4, label: '∆3' },
                { string: 'd', offset: 3, label: '♭3' },
                { string: 'd', offset: 2, label: '∆2' },
                { string: 'd', offset: 1, label: '♭2' },
                { string: 'd', offset: 0, label: '1' }
            ]
        }

    };

    return { 
        chromatic,
        penta_min 
    };

})();