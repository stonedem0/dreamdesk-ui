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
    try { console.debug('DD: fullscreen start', { prev: previousState, zIndex: getComputedStyle(win).zIndex, anims: win.getAnimations?.().length }); } catch(_) {}
    // Ensure animation starts from the exact measured previous rect
    const animation = win.animate([
        {
            position: 'fixed',
            top: `${Math.round(previousState.top)}px`,
            left: `${Math.round(previousState.left)}px`,
            width: `${Math.round(previousState.width)}px`,
            height: `${Math.round(previousState.height)}px`,
            offset: 0,
            zIndex: 9999
        },
        {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '100vw',
            height: '100vh',
            offset: 1,
            zIndex: 9999
        }
    ], {
        duration: 400,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    animation.onfinish = () => {
        win.style.position = 'fixed';
        win.style.top = '0px';
        win.style.left = '0px';
        win.style.width = '100vw';
        win.style.height = '100vh';
        win.style.zIndex = 9999;
        try { console.debug('DD: fullscreen finish', { zIndex: win.style.zIndex, compZ: getComputedStyle(win).zIndex, anims: win.getAnimations?.().length }); } catch(_) {}
    };
}

export function unfullscreen(win, previousState) {
    try { win.getAnimations?.().forEach(a => a.cancel()); } catch(_) {}
    try { console.debug('DD: unfullscreen start', { prev: previousState, zIndex: getComputedStyle(win).zIndex, anims: win.getAnimations?.().length }); } catch(_) {}
    const animation = win.animate([
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
            top: `${Math.round(previousState.top)}px`,
            left: `${Math.round(previousState.left)}px`,
            width: `${Math.round(previousState.width)}px`,
            height: `${Math.round(previousState.height)}px`,
            offset: 1,
    
        }
    ], {
        duration: 400,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    animation.onfinish = () => {
        win.style.position = previousState.position || 'absolute';
        win.style.top = `${Math.round(previousState.top)}px`;
        win.style.left = `${Math.round(previousState.left)}px`;
        win.style.width = `${Math.round(previousState.width)}px`;
        win.style.height = `${Math.round(previousState.height)}px`;
        if (previousState.zIndex) {
            win.style.zIndex = previousState.zIndex;
        } else {
            win.style.removeProperty('z-index');
        }
        try { animation.cancel(); } catch(_) {}
        try { console.debug('DD: unfullscreen finish', { final: { pos: win.style.position, left: win.style.left, top: win.style.top, w: win.style.width, h: win.style.height }, zIndex: win.style.zIndex, compZ: getComputedStyle(win).zIndex, anims: win.getAnimations?.().length }); } catch(_) {}
    };
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