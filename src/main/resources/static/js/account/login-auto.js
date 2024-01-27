const form = new FormData();
form.set('username', 'test');
form.set('password', 'xtrm11');

fetch('/account/loginProcess', {
    method: 'post',
    body: form,
}).then(() => location.href = '/main');