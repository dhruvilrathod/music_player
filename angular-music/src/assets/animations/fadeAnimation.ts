import { trigger, state, style, transition, animate, keyframes, animation } from '@angular/animations';

export const fadeAnimations = () => animation([
    trigger('fade', [
        state('void', style({ opacity: 0 })),
        transition(':enter', [
            animate(300)
        ])
    ]),
    trigger('fadeOut', [
        state('void', style({ opacity: 0 })),
        transition(':leave', [
            animate(300)
        ])
    ]),
    trigger('shake', [
        state('false', style({ transform: 'translateX(10px)' })),
        transition('0 => 1', [
            animate(300)
        ])
    ]),
    trigger('slideIn', [
        state('void', style({ transform: 'translateX(10px)' })),
        transition(':enter', [
            animate(300)
        ])
    ]),
    trigger('hideShow', [
        state('false', style({ opacity: 0 })),
        transition('0 => 1', animate(300)),
    ])
]);