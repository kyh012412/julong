!function ($) {
    $(function () {
        $('#signUpForm').submit(function (e) {
            e.preventDefault();
            const p = $(this).parsley();
            if (p.validate()) {
                const data = {
                    memberId: $('[name="memberId"]').val(),
                    password: $('[name="password"]').val(),
                    memberName: $('[name="memberName"]').val(),
                    email: $('[name="email"]').val(),
                    phoneNo: $('[name="phoneNo"]').val()
                };

                $.ajax({
                    type: 'POST',
                    url: '/api/member/signup',
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=UTF-8",
                }).done(function (data) {
                    Swal.fire({
                        text: "회원가입이 완료되었습니다.",
                        icon: "success",
                        confirmButtonText: "로그인하기",
                        allowOutsideClick: false
                    }).then((_isConfirm) => {
                        location.href="/account/login";
                    })
                }).fail(function (data) {
                    Swal.fire({
                        text: data.responseJSON.message,
                        icon: "error"
                    })
                });
            }

        });
    });

    window.Parsley.addValidator('memberId', {
        requirementType: 'regexp',
        validateString: function (value) {
            const pattern = /^[a-zA-Z0-9_]{4,20}$/;
            return pattern.test(value);
        },
        messages: {
            ko: "정상적인 아이디가 아닙니다. (한글, 특수문자 제외)"
        }
    });

    window.Parsley.addValidator('passwordMinlength', {
        requirementType: 'string',
        validateString: function (value) {
            return value.length > 5;
        },
        messages: {
            ko: "비밀번호는 최소 6자 이상으로 설정해주세요."
        }
    });

    window.Parsley.addValidator('confirmPassword', {
        requirementType: 'string',
        validateString: function (value, requirement) {
            return $(requirement).val() === value;
        },
        messages: {
            ko: "비밀번호가 일치하지 않습니다."
        }
    });

    $(".not-kor").keyup(function (e) {
        const _notKorRegEx = /[^A-Za-z0-9~!@#$%^&*()_+|<>?:{}]/gi;
        if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
            let _value = $(this).val();
            $(this).val(_value.replace(_notKorRegEx, ''));
        }
    });

    window.Parsley.addValidator("phoneNo", {
        requirementType: 'regexp',
        validateString: function (value) {
            const _phoneRegEx = /^(01([0|1|[6-9]?){3})-([0-9]{3,4})-([0-9]{4})$/;
            return _phoneRegEx.test(value);
        },
        messages: {
            ko: "정상적인 휴대폰번호가 아닙니다. (숫자와 하이픈(-)만 가능)"
        }

    });
}(window.jQuery);