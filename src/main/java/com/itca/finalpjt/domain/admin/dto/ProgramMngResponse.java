package com.itca.finalpjt.domain.admin.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ProgramMngResponse implements Serializable {
	private static final long serialVersionUID = -178251896371237281L;

	private int programkey;
	private String programname;
	private String programurl;
	private String menulgroupcode;
	private String menumgroupcode;
	private int sortno;
	private boolean useyn;
	private boolean singlemenuyn;
	private boolean inoutyn;
	private String createId;
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	private LocalDateTime createDatetime;
	private String updateId;
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	private LocalDateTime updateDatetime;

	private String menulgroupcodename;
	private String menumgroupcodename;
	private String createDatetimeT;
	private String updateDatetimeT;

	@Builder
	public ProgramMngResponse(int programkey, String programurl, String programname, String menulgroupcode,
			String menumgroupcode, boolean singlemenuyn) {
		this.programkey = programkey;
		this.programurl = programurl;
		this.programname = programname;
		this.menulgroupcode = menulgroupcode;
		this.menumgroupcode = menumgroupcode;
		this.singlemenuyn = singlemenuyn;
	}

}
