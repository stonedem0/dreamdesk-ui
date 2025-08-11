export function minimize(win) {
    win.style.transformOrigin = '50% 100%';
    win.animate([
        {
            transform: 'scale(1)',
            offset: 0
        },
        {
            transform: 'scale(0)',
            offset: 1
        }
    ], {
        duration: 600,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
}

export function fullscreen(win, previousState) {
    win.animate([
        {
            position: 'fixed',
            top: `${previousState.top}px`,
            left: `${previousState.left}px`,
            width: `${previousState.width}px`,
            height: `${previousState.height}px`,
            offset: 0,
            zIndex: 1
        },
        {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '100vw',
            height: '100vh',
            offset: 1,
            zIndex: 1
        }
    ], {
        duration: 400,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
}

export function unfullscreen(win, previousState) {
    win.animate([
        {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '100vw',
            height: '100vh',
            offset: 0,
        },
        {
            position: previousState.position,
            top: `${previousState.top}px`,
            left: `${previousState.left}px`,
            width: `${previousState.width}px`,
            height: `${previousState.height}px`,
            offset: 1,
    
        }
    ], {
        duration: 400,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
}

export function close(win, onfinish) {
    win.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.95)' }
    ], {
        duration: 300,
        easing: 'ease',
        fill: 'forwards'
    }).onfinish = () => {
        if (onfinish) onfinish();
    };
}