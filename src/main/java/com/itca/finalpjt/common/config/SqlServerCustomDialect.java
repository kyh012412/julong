package com.itca.finalpjt.common.config;

import org.hibernate.dialect.SQLServer2008Dialect;
import org.hibernate.dialect.function.SQLFunctionTemplate;
import org.hibernate.type.StandardBasicTypes;

public class SqlServerCustomDialect extends SQLServer2008Dialect {
    public SqlServerCustomDialect() {
        super();
        registerFunction("CONVERT", new SQLFunctionTemplate(StandardBasicTypes.STRING, "CONVERT(?1, ?2, ?3)"));
    }
}
