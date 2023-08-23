import { animate, animateChild, group, query, stagger, style, transition, trigger } from "@angular/animations";

export const delayAnimation2 = trigger('routeAnimations', [
  transition('* => *', [
    query(':leave', [
      style({ position: 'absolute', inset: 0, zIndex: 6 })
    ], {optional: true}),

    query(':leave', animateChild(), {optional: true}),
    group([
      query(':leave', [
        animate('550ms ease-out',style({position: 'absolute' }))
      ],{optional: true}),
      query(':enter', [
        style({ opacity: 0 })
      ], {optional: true}),
      query(':enter', [
        animate('550ms ease-out', style({ opacity: 0 }))
      ],{optional: true})
    ]),

    query(':enter', animateChild(), {optional: true}),
    query(':enter', [
      animate('10ms ease-out', style({ opacity: 1 }))
    ],{optional: true})
  ]),
]);

export const fadeAnimation = 
trigger('state', [
  transition(':enter', [
      style({
        opacity: 0 
      }),
      animate('350ms cubic-bezier(0.4, 0.0, 1, 1)',
      style({
        opacity: 1,
      }))
  ]),
  transition(':leave', [
  animate('350ms cubic-bezier(0.4, 0.0, 1, 1)',
      style({
        opacity: 0,
      }))
  ])
]);

export const fadeOut =
trigger('fadeOut', [
  transition(':leave', [
    style({ opacity: 1 }),
    animate('400ms ease-out', 
      style({ opacity: 0})
    )
  ]),
])

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [

    query(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 })
    ], {optional: true}),

    query(':leave', animateChild(), {optional: true}),
    group([
      query(':enter', [
        stagger('60ms',animate('600ms ease-out', style({ transform: 'translateX(0%)',  opacity: 1 })))
      ],{optional: true})
    ]),
    query(':enter', animateChild(), {optional: true}),
  ]),
]);


export const delayAnimation = trigger('routeAnimations', [
  transition('* => *', [

    query(':enter', [
      style({ opacity: 0 })
    ], {optional: true}),

    query(':leave', animateChild(), {optional: true}),
    group([
      query(':leave', [
        stagger('500ms',animate('500ms ease-out', style({ opacity: 0 })))
      ],{optional: true}),
      query(':enter', [
        stagger('500ms',animate('600ms ease-out', style({ opacity: 1 })))
      ],{optional: true})
    ]),
    query(':enter', animateChild(), {optional: true}),
  ]),
]);