function createSpinner(parentEl) {
    const spinnerWrapEl = createElement(parentEl, 'div', ['spinner-wrap']);
    const spinnerBorderEl = createElement(spinnerWrapEl, 'div', ['spinner-border'],
        {'role': 'status'});
    createElementWithText(spinnerBorderEl, 'span', ['sr-only'], {}, 'Loading...');
}

function createMoreButton(parentEl, targetId, eventListener) {
    const btnEl = createElementWithText(parentEl, 'button',
        ['btn', 'btn-list-more', 'btn-brd-black'],
        {'data-target': targetId}, `+ ${TEXT_MORE}`);
    btnEl.addEventListener('click', eventListener);
}

function createSyncNotification(parentEl, id, isInitText= true) {
    createElementWithText(parentEl, 'span', ['noti', 'float-right'], {'id': id},
        isInitText ? TEXT_JUST_BEFORE : '');
}