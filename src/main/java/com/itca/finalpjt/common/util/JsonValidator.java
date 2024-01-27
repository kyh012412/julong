package com.itca.finalpjt.common.util;

import com.google.gson.JsonParser;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class JsonValidator implements ConstraintValidator<JsonFormat, String> {

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        try {
            JsonParser.parseString(s);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
