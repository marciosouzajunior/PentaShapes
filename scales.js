const scales = (() => {
    
    const chromatic = {
        e_low: {
            shape_1: [
                { string: 'e_high', offset: 5, label: 'p4' },
                { string: 'e_high', offset: 4, label: '∆3' },
                { string: 'e_high', offset: 3, label: '♭3' },
                { string: 'e_high', offset: 2, label: '∆2' },
                { string: 'e_high', offset: 1, label: '♭2' },

                { string: 'b', offset: 5, label: '8' },
                { string: 'b', offset: 4, label: '∆7' },
                { string: 'b', offset: 3, label: '♭7' },                
                { string: 'b', offset: 2, label: '∆6' },
                { string: 'b', offset: 1, label: '♭6' },

                { string: 'g', offset: 4, label: 'p5' },
                { string: 'g', offset: 3, label: '♭5' },
                { string: 'g', offset: 2, label: 'p4' },
                { string: 'g', offset: 1, label: '∆3' },
                { string: 'g', offset: 0, label: '♭3' }
                ,
                { string: 'd', offset: 4, label: '∆2' },
                { string: 'd', offset: 3, label: '♭2' },
                { string: 'd', offset: 2, label: '8' },
                { string: 'd', offset: 1, label: '∆7' },
                { string: 'd', offset: 0, label: '♭7' },
                
                { string: 'a', offset: 4, label: '∆6' },
                { string: 'a', offset: 3, label: '♭6' },
                { string: 'a', offset: 2, label: 'p5' },
                { string: 'a', offset: 1, label: '♭5' },
                { string: 'a', offset: 0, label: 'p4' },

                { string: 'e_low', offset: 4, label: '∆3' },
                { string: 'e_low', offset: 3, label: '♭3' },
                { string: 'e_low', offset: 2, label: '∆2' },
                { string: 'e_low', offset: 1, label: '♭2' },
                { string: 'e_low', offset: 0, label: '1' }            
            ]
        }

    };

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

    const blues = {
        e_low: {
            shape_1: [
                { string: 'e_high', offset: 3, label: '♭3' },
                { string: 'e_high', offset: 0, label: '1' },
                { string: 'b', offset: 3, label: '♭7' },
                { string: 'b', offset: 0, label: '5' },
                { string: 'g', offset: 3, label: '♭5' },
                { string: 'g', offset: 2, label: '4' },
                { string: 'g', offset: 0, label: '♭3' },
                { string: 'd', offset: 2, label: '1' },
                { string: 'd', offset: 0, label: '♭7' },
                { string: 'a', offset: 2, label: '5' },
                { string: 'a', offset: 1, label: '♭5' },
                { string: 'a', offset: 0, label: '4' },
                { string: 'e_low', offset: 3, label: '♭3' },
                { string: 'e_low', offset: 0, label: '1' }
            ],
            shape_2: [
                { string: 'e_high', offset: 5, label: '4' },
                { string: 'e_high', offset: 3, label: '♭3' },
                { string: 'b', offset: 5, label: '1' },
                { string: 'b', offset: 3, label: '♭7' },
                { string: 'g', offset: 4, label: '5' },
                { string: 'g', offset: 3, label: '♭5' }
            ],
            shape_3: [
                { string: 'e_high', offset: 7, label: '5' },
                { string: 'e_high', offset: 5, label: '4' },
                { string: 'b', offset: 8, label: '♭3' },
                { string: 'b', offset: 7, label: '2' },
                { string: 'b', offset: 5, label: '1' },
                { string: 'g', offset: 6, label: '6' }
            ]
        }
    };

    const penta_maj = {
        e_low: {
            shape_1: [
                { string: 'e_high', offset: 2, label: '2' },
                { string: 'e_high', offset: 0, label: '1' },
                { string: 'b', offset: 2, label: '6' },
                { string: 'b', offset: 0, label: '5' },
                { string: 'g', offset: 1, label: '3' },
                { string: 'g', offset: -1, label: '2' },
                { string: 'd', offset: 2, label: '1' },
                { string: 'd', offset: -1, label: '6' },
                { string: 'a', offset: 2, label: '5' },
                { string: 'a', offset: -1, label: '3' },
                { string: 'e_low', offset: 2, label: '2' },
                { string: 'e_low', offset: 0, label: '1' }
            ],
            shape_5: [
                { string: 'e_high', offset: -3, label: '6' },
                { string: 'e_high', offset: 0, label: '1' },
                { string: 'b', offset: -3, label: '3' },
                { string: 'b', offset: 0, label: '5' },
                { string: 'g', offset: -3, label: '1' },
                { string: 'g', offset: -1, label: '2' },
                { string: 'd', offset: -3, label: '5' },
                { string: 'd', offset: -1, label: '6' },
                { string: 'a', offset: -3, label: '2' },
                { string: 'a', offset: -1, label: '3' },
                { string: 'e_low', offset: -3, label: '6' },
                { string: 'e_low', offset: 0, label: '1' }
            ]
        },
        a: {
            shape_3: [
                { string: 'e_high', offset: -3, label: '3' },
                { string: 'e_high', offset: 0, label: '5' },
                { string: 'b', offset: -2, label: '1' },
                { string: 'b', offset: 0, label: '2' },
                { string: 'g', offset: -3, label: '5' },
                { string: 'g', offset: -1, label: '6' },
                { string: 'd', offset: -3, label: '2' },
                { string: 'd', offset: -1, label: '3' },
                { string: 'a', offset: -3, label: '6' },
                { string: 'a', offset: 0, label: '1' },
                { string: 'e_low', offset: -3, label: '3' },
                { string: 'e_low', offset: 0, label: '5' }
            ],
            shape_4: [
                { string: 'e_high', offset: 2, label: '6' },
                { string: 'e_high', offset: 0, label: '5' },
                { string: 'b', offset: 2, label: '3' },
                { string: 'b', offset: 0, label: '2' },
                { string: 'g', offset: 2, label: '1' },
                { string: 'g', offset: -1, label: '6' },
                { string: 'd', offset: 2, label: '5' },
                { string: 'd', offset: -1, label: '3' },
                { string: 'a', offset: 2, label: '2' },
                { string: 'a', offset: 0, label: '1' },
                { string: 'e_low', offset: 2, label: '6' },
                { string: 'e_low', offset: 0, label: '5' }
            ]
        },
        d: {
            shape_1: [
                { string: 'e_high', offset: -2, label: '1' },
                { string: 'e_high', offset: 0, label: '2' },
                { string: 'b', offset: -2, label: '5' },
                { string: 'b', offset: 0, label: '6' },
                { string: 'g', offset: -3, label: '2' },
                { string: 'g', offset: -1, label: '3' },
                { string: 'd', offset: -3, label: '6' },
                { string: 'd', offset: 0, label: '1' },
                { string: 'a', offset: -3, label: '3' },
                { string: 'a', offset: 0, label: '5' },
                { string: 'e_low', offset: -2, label: '1' },
                { string: 'e_low', offset: 0, label: '2' }
            ],
            shape_2: [
                { string: 'e_high', offset: 2, label: '3' },
                { string: 'e_high', offset: 0, label: '2' },
                { string: 'b', offset: 3, label: '1' },
                { string: 'b', offset: 0, label: '6' },
                { string: 'g', offset: 2, label: '5' },
                { string: 'g', offset: -1, label: '3' },
                { string: 'd', offset: 2, label: '2' },
                { string: 'd', offset: 0, label: '1' },
                { string: 'a', offset: 2, label: '6' },
                { string: 'a', offset: 0, label: '5' },
                { string: 'e_low', offset: 2, label: '3' },
                { string: 'e_low', offset: 0, label: '2' }              
            ]
        }
    };


    return { 
        chromatic,
        penta_min,
        penta_maj,
        blues
    };

})();