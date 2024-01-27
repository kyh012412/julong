package com.itca.finalpjt.domain.admin.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminDataSearchResponse {

    private int memberkey;
    private String memberid;
    private String membername;
    private String memberenname;
    private String membercnname;
    private String companycode;
    private String companykrname;
    private String companyenname;
    private String companycnname;
    private String pgcode;
    private String pgkrname;
    private String pgenname;
    private String pgcnname;
    private String pucode;
    private String pukrname;
    private String puenname;
    private String pucnname;
    private String divisioncode;
    private String divisionkrname;
    private String divisioncnname;
    private String divisionenname;
    private String resignationstatus;

    private String position;
    private boolean useyn;
    private boolean lockyn;
    private String memberinquiryright;
    private String memberpuinquiryright;
    private String email;
    private String codemembertype;

    @Builder
    public AdminDataSearchResponse(String memberid, String email, String membername, String memberenname, String membercnname, String companycode, String companykrname
                                 , String companyenname, String companycnname, String pgcode, String pgkrname, String pgenname, String pgcnname, String pucode, String pukrname
                                 , String puenname, String pucnname, String divisioncode, String divisionkrname, String divisionenname, String divisioncnname, String resignationstatus
                                 , boolean useyn, boolean lockyn, String position, int memberkey
		) {
                       this.memberid          =   memberid;
                       this.email             =   email;
                       this.membername        =   membername;
                       this.memberenname      =   memberenname;
                       this.membercnname      =   membercnname;
                       this.companycode       =   companycode;
                       this.companykrname     =   companykrname;
                       this.companyenname     =   companyenname;
                       this.companycnname     =   companycnname;
                       this.pgcode            =   pgcode;
                       this.pgkrname          =   pgkrname;
                       this.pgenname          =   pgenname;
                       this.pgcnname          =   pgcnname;
                       this.pucode            =   pucode;
                       this.pukrname          =   pukrname;
                       this.puenname          =   puenname;
                       this.pucnname          =   pucnname;
                       this.divisioncode      =   divisioncode;
                       this.divisionkrname    =   divisionkrname;
                       this.divisionenname    =   divisionenname;
                       this.divisioncnname    =   divisioncnname;
                       this.resignationstatus =   resignationstatus;
                       this.useyn             =   useyn;
                       this.lockyn            =   lockyn;
                       this.position          =   position;
                       this.memberkey         =   memberkey;

    }

}
