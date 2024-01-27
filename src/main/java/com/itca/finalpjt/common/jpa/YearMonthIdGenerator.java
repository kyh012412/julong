package com.itca.finalpjt.common.jpa;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.HibernateException;
import org.hibernate.MappingException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.Configurable;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.internal.util.config.ConfigurationHelper;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.Type;

import java.io.Serializable;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Properties;

@Slf4j
public class YearMonthIdGenerator implements IdentifierGenerator, Configurable {
    private static final String LOWER_ALPHA_NUMERIC = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final String YEAR_MONTH_FORMAT = "yyyyMM";

    private static final String PARAM_PREFIX = "prefix";
    private static final String PARAM_LENGTH = "length";

    private String prefix;
    private int length;

    @Override
    public void configure(Type type, Properties params, ServiceRegistry serviceRegistry) throws MappingException {
        this.prefix = ConfigurationHelper.getString(PARAM_PREFIX, params, "");
        this.length = ConfigurationHelper.getInt(PARAM_LENGTH, params, 40);
    }

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        var dateFormat = new SimpleDateFormat(YEAR_MONTH_FORMAT);
        return this.prefix
                + dateFormat.format(Calendar.getInstance().getTime())
                + generateRandomString(this.length);
    }

    public String generateRandomString(int length) {
        var random = new SecureRandom();

        if (length < 1) throw new IllegalArgumentException();

        var sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            // 0-62 (exclusive), random returns 0-61
            var rndCharAt = random.nextInt(LOWER_ALPHA_NUMERIC.length());
            var rndChar = LOWER_ALPHA_NUMERIC.charAt(rndCharAt);

            sb.append(rndChar);
        }

        return sb.toString();
    }

}
