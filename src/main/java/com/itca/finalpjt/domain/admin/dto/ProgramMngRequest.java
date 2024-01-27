package com.itca.finalpjt.domain.admin.dto;

import com.itca.finalpjt.domain.admin.entity.ProgramMng;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProgramMngRequest {
	private int programkey;
	private String programname;
	private String programurl;
	private String menulgroupcode;
	private String menumgroupcode;
	private int sortno;
	private boolean useyn;
	private boolean singlemenuyn;

	private String inoutyn_str;
	private String type_str;

	@Builder
	public ProgramMngRequest(ProgramMng programMng) {
		this.programkey = programMng.getProgramkey();
		this.programname = programMng.getProgramname();
		this.programurl = programMng.getProgramurl();
		this.menulgroupcode = programMng.getMenulgroupcode();
		this.menumgroupcode = programMng.getMenumgroupcode();
		this.sortno = programMng.getSortno();
		this.useyn = programMng.isUseyn();
		this.singlemenuyn = programMng.isSinglemenuyn();
	}

}
