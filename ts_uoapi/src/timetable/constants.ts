import { BasicAcceptedElems, Element } from 'cheerio';

// Selectors
export const TIMETABLE_COURSE_SELECTOR: BasicAcceptedElems<Element> =
  'div[id^="win0divSSR_CLSRSLT_WRK_GROUPBOX2$"]';
export const COURSE_TITLE_SELECTOR = 'div[id^="win0divSSR_CLSRSLT_WRK_GROUPBOX2GP"]';
export const COURSE_SECTION_SELECTOR = 'div[id^="win0divSSR_CLSRSLT_WRK_GROUPBOX"]';
export const COURSE_SUBSECTION_SELECTOR = 'tr[id*="trSSR_CLSRCH_MTG"]';
export const COURSE_DESCRIPTION_SELECTOR = 'div[id*="win0divDERIVED_CLSRCH_DESCRLONG"]';
export const COURSE_SECTION_NAME_SELECTOR = 'a[id*="MTG_CLASSNAME"]';
export const COURSE_SECTION_STATUS_SELECTOR = 'div[id*="win0divDERIVED_CLSRCH_SSR_STATUS_LONG"]';
export const COURSE_SECTION_ROOMS_SELECTOR = 'span[id*="MTG_ROOM"]';
export const COURSE_SECTION_INSTRUCTOR_SELECTOR = 'span[id*="MTG_INSTR"]';
export const COURSE_SECTION_TOPIC_SELECTOR = 'span[id*="MTG_TOPIC"]';

// regex
export const COURSE_SECTION_REGEX = /\s*([A-Z]*)\s*[0-9]*-\s*([A-Z]+)\s*/;
export const DATE_REGEX = /[0-9]{4}(?:\s*-\s*[0-9]{2}){2}/g;

export const TEST_HTML = `<?xml version='1.0' encoding='utf-8' ?>
<PAGE id='UO_PUB_CLSSRCH_RES'><GENSCRIPT id='script'><![CDATA[var oWin=window;
 var oDoc = window.document;
oWin.strCurrUrl='https://uocampus.public.uottawa.ca/psc/csprpr9pub/EMPLOYEE/SA/c/UO_SR_AA_MODS.UO_PUB_CLSSRCH.GBL?&PAGE=UO_PUB_CLSSRCH_RES';
oWin.strReqURL='';
]]></GENSCRIPT><GENSCRIPT id='script'><![CDATA[oWin.gridRowSelRgbColor_win0 ='rgb(212,219,217)';
]]></GENSCRIPT><GENSCRIPT id='onloadScript'><![CDATA[var pt_pageinfo = document.getElementById('pt_pageinfo_win0');
if (pt_pageinfo) {
pt_pageinfo.setAttribute('Page', 'UO_PUB_CLSSRCH_RES');
pt_pageinfo.setAttribute('Component', 'UO_PUB_CLSSRCH');
pt_pageinfo.setAttribute('Menu', 'UO_SR_AA_MODS');
pt_pageinfo.setAttribute('Mode', 'CLASSIC');
}
g_bAccessibilityMode=false;
var actn='';
var oWin=window;
var oDoc=document;
actn=oDoc.win0.ICAction.value;
oDoc.win0.ICAction.value='None';
oDoc.win0.ICResubmit.value='0';
oWin.nResubmit='0';
oDoc.win0.ICStateNum.value=2;initVars_win0();
if (typeof resetVars_win0 == "function")resetVars_win0();
oDoc.win0.ICFocus.value='';
setupTimeout2();
if (oDoc.win0.ICTypeAheadID) oDoc.win0.ICTypeAheadID.value='';
if (!isCrossDomainTop()) top.document.title=document.title;
ptEvent.add(window,'scroll',positionWAIT_win0);
ptCommonObj2.generateABNSearchResults(document.win0);
getGblSrchPageNum(actn);
if (gSrchRsltPageNum <= 5) getAllRelatedActions();

if (typeof(myAppsWindowOpenJS) != 'undefined' && myAppsWindowOpenJS != null && myAppsWindowOpenJS != '')
 {
try {eval(myAppsWindowOpenJS);} catch(e) {}
  myAppsWindowOpenJS=null;
}
if (typeof(ptLongEditCounter) != 'undefined' && ptLongEditCounter != null)
   ptLongEditCounter.onLoadLongEditCounter();
if (typeof(HelppopupObj_win0) != 'undefined' && HelppopupObj_win0 != null)
 HelppopupObj_win0.StopPopup('win0');ResetGlyph_win0();
self.scroll(0,0);
if (typeof ptGridObj_win0 != 'undefined' && ptGridObj_win0)
 ptGridObj_win0.clearGridArr();
objToBeFocus = null;
if (typeof oWin == 'undefined') setEventHandlers_win0('ICFirstAnchor_win0', 'ICLastAnchor_win0', false);
 else
 oWin.setEventHandlers_win0('ICFirstAnchor_win0', 'ICLastAnchor_win0', false);
setFocus_win0('DERIVED_CLSRCH_SSR_CLSRCH_CRIT',-1);
ptLoadingStatus_empty(0);
setupTimeout2();
processing_win0(0,3000);]]></GENSCRIPT>
<FIELD id='win0divPSHIDDENFIELDS'><![CDATA[<input type='hidden' name='ICType' id='ICType' value='Panel' />
<input type='hidden' name='ICElementNum' id='ICElementNum' value='0' />
<input type='hidden' name='ICStateNum' id='ICStateNum' value='2' />
<input type='hidden' name='ICAction' id='ICAction' value='None' />
<input type='hidden' name='ICModelCancel' id='ICModelCancel' value='0' />
<input type='hidden' name='ICXPos' id='ICXPos' value='0' />
<input type='hidden' name='ICYPos' id='ICYPos' value='0' />
<input type='hidden' name='ResponsetoDiffFrame' id='ResponsetoDiffFrame' value='-1' />
<input type='hidden' name='TargetFrameName' id='TargetFrameName' value='None' />
<input type='hidden' name='FacetPath' id='FacetPath' value='None' />
<input type='hidden' name='ICFocus' id='ICFocus' value='' />
<input type='hidden' name='ICSaveWarningFilter' id='ICSaveWarningFilter' value='0' />
<input type='hidden' name='ICChanged' id='ICChanged' value='-1' />
<input type='hidden' name='ICSkipPending' id='ICSkipPending' value='0' />
<input type='hidden' name='ICAutoSave' id='ICAutoSave' value='0' />
<input type='hidden' name='ICResubmit' id='ICResubmit' value='0' />
<input type='hidden' name='ICSID' id='ICSID' value='5lImXeOBQUcS4CSrXzinooi2Ax0sw5/hYyjV9BuGG7E=' />
<input type='hidden' name='ICActionPrompt' id='ICActionPrompt' value='false' />
<input type='hidden' name='ICTypeAheadID' id='ICTypeAheadID' value='' />
<input type='hidden' name='ICBcDomData' id='ICBcDomData' value='' />
<input type='hidden' name='ICPanelName' id='ICPanelName' value='' />
<input type='hidden' name='ICFind' id='ICFind' value='' />
<input type='hidden' name='ICAddCount' id='ICAddCount' value='' />
<input type='hidden' name='ICAppClsData' id='ICAppClsData' value='' />
]]></FIELD>
<FIELD id='win0divPAGEBAR'><![CDATA[<DIV><table cols='3' width='100%' cellpadding='0' cellspacing='0' hspace='0' vspace='0'>
<tr>
<td width='80%'></td><td width='10%' nowrap='nowrap' align='right'><label for='#ICDataLang'><span class='PSDROPDOWNLABEL' >Data Language:&nbsp;&nbsp;</span><select name='#ICDataLang' id='#ICDataLang' tabindex='1' class='PSMULTILANG'  PSaccesskey='9' onchange="addchg_win0(this);submitAction_win0(this.form,this.id);">
<option value="CFR">Canadian French</option>
<option value="ENG" selected='selected'>English</option>
</select></label></td>
<td width='10%' nowrap='nowrap' align='right'></td></tr>
</table>
</DIV>]]></FIELD><GENSCRIPT id='onloadScript'><![CDATA[if (typeof window.top.ptrc != "undefined" && window.top.ptrc != null){window.top.ptrc.SetRcEnabled(false);window.top.ptrc.initRC();}]]></GENSCRIPT>
<FIELD id='win0divPSPANELTABS'><![CDATA[]]></FIELD>
<FIELD id='win0divPAGECONTAINER'><![CDATA[<table class='PSPAGECONTAINER' role='main' aria-labelledby='app_label'><tr><td>
<DIV class='ps_pspagecontainer' id='win0divPSPAGECONTAINER'><table role='presentation'  border='0' id='ACE_width' cellpadding='0' cellspacing='0' class='PSPAGECONTAINER' cols='13' width='807'>
<tr>
<td width='0' height='7'></td>
<td width='4'></td>
<td width='8'></td>
<td width='1'></td>
<td width='4'></td>
<td width='219'></td>
<td width='168'></td>
<td width='156'></td>
<td width='12'></td>
<td width='8'></td>
<td width='4'></td>
<td width='195'></td>
<td width='28'></td>
</tr>
<tr>
<td height='48'></td>
<td colspan='7'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_GROUPBOX2'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='559'>
<tr><td class='PAGROUPBOXLABELINVISIBLE'  align='left'>Groupbox</td></tr>
<tr><td width='557'>
<table role='presentation'  border='0' id='ACE_DERIVED_CLSRCH_GROUPBOX2' cellpadding='0' cellspacing='0' cols='3' width='557' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='13' height='0'></td>
<td width='311'></td>
<td width='233'></td>
</tr>
<tr>
<td height='18'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_SS_TRANSACT_TITLE'><span   role='heading' aria-level='1'  class='PATRANSACTIONTITLE' id='DERIVED_CLSRCH_SS_TRANSACT_TITLE'>Search for Classes</span>
</DIV></td>
</tr>
<tr>
<td height='5'></td>
<td rowspan='2'  valign='top' align='left'>
<DIV  id='win0divDERIVED_CLSRCH_SSR_CLASS_LBLlbl'><span  class='PAPAGETITLE' >Search Results</span></DIV></td>
</tr>
<tr>
<td height='13'></td>
<td  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_SSR_CLASS_LBL'><span    class='PSEDITBOX_DISPONLY' id='DERIVED_CLSRCH_SSR_CLASS_LBL'>&nbsp;</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='9' colspan='13'></td>
</tr>
<tr>
<td height='29' colspan='4'></td>
<td colspan='8'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_SSR_MSG_TEXT'><span    class='PAPAGEINSTRUCTIONS' style='word-wrap:break-word;overflow:hidden;display:block; width:584px;  overflow:auto;' id='DERIVED_CLSRCH_SSR_MSG_TEXT'>&nbsp;</span>
</DIV></td>
</tr>
<tr>
<td height='14' colspan='5'></td>
<td colspan='7'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_SSS_PAGE_KEYDESCR'><span    class='SSSKEYTEXT' id='DERIVED_CLSRCH_SSS_PAGE_KEYDESCR'>University of Ottawa | 2020 Winter Term</span>
</DIV></td>
</tr>
<tr>
<td height='44' colspan='3'></td>
<td colspan='7'  valign='top' align='left'>
<DIV    id='win0div$ICField94'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='567'>
<tr><td width='565'>
<table role='presentation'  border='0' id='ACE_$ICField94' cellpadding='0' cellspacing='0' cols='3' width='565' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='3' height='4'></td>
<td width='552'></td>
<td width='10'></td>
</tr>
<tr>
<td height='38'></td>
<td  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_SSR_CLSRCH_CRIT'><div style="width:552px; " >
<!-- Begin HTML Area Name Undisclosed -->
<table class="SSSTEXTBLUE"><tr><td>The following classes match your search criteria Course Subject: <strong>Mathematics</strong>,&nbsp;&nbsp;Show Open Classes Only: <strong>No</strong><strong></strong>,&nbsp;&nbsp;Year of Study: <strong>4th</strong></td></tr></table>
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='4' colspan='13'></td>
</tr>
<tr>
<td height='36' colspan='2'></td>
<td colspan='11'  valign='top' align='left'>
<DIV    id='win0divDERIVED_REGFRM1_DESCR1'><table cellpadding='2' cellspacing='0' cols='1'  class='PSGROUPBOXWBO'  width='803'>
<tr><td class='PAGROUPBOXLABELINVISIBLE'  align='left'>Descr</td></tr>
<tr><td width='801'>
<table role='presentation'  border='0' id='ACE_DERIVED_REGFRM1_DESCR1' cellpadding='0' cellspacing='0' cols='3' width='801' class='PSGROUPBOX' style='border-style:none' >
<tr>
<td width='451' height='0'></td>
<td width='282'></td>
<td width='68'></td>
</tr>
<tr>
<td height='19'></td>
<td  valign='top' align='left'>
<DIV    id='win0divDERIVED_REGFRM1_SSR_WAIT_LIST_OFF'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='281'>
<tr><td width='279'>
<table role='presentation'  border='0' id='ACE_DERIVED_REGFRM1_SSR_WAIT_LIST_OFF' cellpadding='0' cellspacing='0' cols='9' width='279' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='39' height='0'></td>
<td width='18'></td>
<td width='2'></td>
<td width='44'></td>
<td width='48'></td>
<td width='18'></td>
<td width='2'></td>
<td width='52'></td>
<td width='56'></td>
</tr>
<tr>
<td height='15'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField13'><img src=/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif width='16' height='16' alt='Open' title='Open' class='PSSTATICIMAGE' />
</DIV></td>
<td></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField10'><span    class='SSSKEYTEXT' >Open</span>
</DIV></td>
<td></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField14'><img src=/cs/csprpr9pub/cache/PS_CS_STATUS_CLOSED_ICN_1.gif width='16' height='16' alt='Closed' title='Closed' class='PSSTATICIMAGE' />
</DIV></td>
<td></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField11'><span    class='PSTEXT' >Closed</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='7' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='4' colspan='13'></td>
</tr>
<tr>
<td height='42'></td>
<td colspan='10'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_GROUP5'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='583'>
<tr><td width='581'>
<table role='presentation'  border='0' id='ACE_DERIVED_CLSRCH_GROUP5' cellpadding='0' cellspacing='0' cols='4' width='581' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='235' height='0'></td>
<td width='168'></td>
<td width='168'></td>
<td width='10'></td>
</tr>
<tr>
<td height='28'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField$3$'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='167'>
<tr><td width='165'>
<table role='presentation'  border='0' id='ACE_$ICField$3$' cellpadding='0' cellspacing='0' cols='2' width='165' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='3' height='0'></td>
<td width='162'></td>
</tr>
<tr>
<td height='23'></td>
<td nowrap='nowrap'  valign='top' align='left'>
<DIV    id='win0divCLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH'><a role='presentation' class='PSPUSHBUTTON Left' ><span style='background-Color: transparent;'><input type='button' name='CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH' id='CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH' tabindex='20' value='New Search'  class='PSPUSHBUTTON' style='width:152px; ' onclick="submitAction_win0(document.win0,this.id,event);" title='Start a New Search'  /></span></a>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField$5$'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='167'>
<tr><td width='165'>
<table role='presentation'  border='0' id='ACE_$ICField$5$' cellpadding='0' cellspacing='0' cols='2' width='165' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='7' height='0'></td>
<td width='158'></td>
</tr>
<tr>
<td height='23'></td>
<td nowrap='nowrap'  valign='top' align='left'>
<DIV    id='win0divCLASS_SRCH_WRK2_SSR_PB_MODIFY'><a role='presentation' class='PSPUSHBUTTON Left' ><span style='background-Color: transparent;'><input type='button' name='CLASS_SRCH_WRK2_SSR_PB_MODIFY' id='CLASS_SRCH_WRK2_SSR_PB_MODIFY' tabindex='21' value='Modify Search'  class='PSPUSHBUTTON' style='width:152px; ' onclick="submitAction_win0(document.win0,this.id,event);" /></span></a>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='9' colspan='4'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='1148'></td>
<td colspan='10'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_GROUP6'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='583'>
<tr><td width='581'>
<table role='presentation'  border='0' id='ACE_DERIVED_CLSRCH_GROUP6' cellpadding='0' cellspacing='0' cols='2' width='581' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='3' height='0'></td>
<td width='578'></td>
</tr>
<tr>
<td height='1134'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX1'><table cellpadding='2' cellspacing='0' cols='1'  class='PSGROUPBOXWBO'  width='687'>
<tr><td class='PSGROUPBOXLABEL'  align='left'>15 class section(s) found</td></tr>
<tr><td width='685'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX1' cellpadding='0' cellspacing='0' cols='3' width='685' class='PSGROUPBOX' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='684'></td>
<td width='2'></td>
</tr>
<tr>
<td height='1116'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField$4$$0'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField$4$$scroll$0' onclick="getScrollTableId('$ICField$4$$scroll$0')" width='683'>
<tr><td width='681'>
<table role='presentation'  border='0' id='ACE_$ICField$4$$0' cellpadding='0' cellspacing='0' cols='3' width='681' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='680'></td>
<td width='2'></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$0'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$0'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4143 - Groups and Galois Theory' name='SSR_CLSRSLT_WRK_GROUPBOX2$0' id='SSR_CLSRSLT_WRK_GROUPBOX2$0' tabindex='36' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$0');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4143 - Groups and Galois Theory' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4143 - Groups and Galois Theory&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$0' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$0'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$0' onclick="getScrollTableId('$ICField48$scroll$0')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$0' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$0'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$0' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$0'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$0' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$0' id='SSR_CLSRCH_MTG1$srt6$0' tabindex='71' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$0');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$0' id='SSR_CLSRCH_MTG1$srt7$0' tabindex='72' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$0');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$0' id='SSR_CLSRCH_MTG1$srt8$0' tabindex='73' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$0');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$0' id='SSR_CLSRCH_MTG1$srt9$0' tabindex='74' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$0');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$0' id='SSR_CLSRCH_MTG1$srt10$0' tabindex='75' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$0');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$0' id='SSR_CLSRCH_MTG1$srt11$0' tabindex='76' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$0');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$0_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$0_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$0_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$0_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$0'><span id='MTG_CLASS_NBR$span$0'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$0' id='MTG_CLASS_NBR$0'  ptlinktgt='pt_peoplecode' tabindex='78' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$0');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$0'><span id='MTG_CLASSNAME$span$0'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$0' id='MTG_CLASSNAME$0'  ptlinktgt='pt_peoplecode' tabindex='79' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$0');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$0'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$0'>Mo 14:30 - 15:50<br />We 16:00 - 17:20</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$0'><span    class='PSLONGEDITBOX' id='MTG_ROOM$0'>800 King Edward (STE) J0106<br />800 King Edward (STE) J0106</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$0'><span    class='PSLONGEDITBOX' id='MTG_INSTR$0'>David Handelman<br />David Handelman</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$0'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$0'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$0'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$1'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$1'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4157 - Algebraic Topology I' name='SSR_CLSRSLT_WRK_GROUPBOX2$1' id='SSR_CLSRSLT_WRK_GROUPBOX2$1' tabindex='245' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$1');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4157 - Algebraic Topology I' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4157 - Algebraic Topology I&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$1' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$1'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$1' onclick="getScrollTableId('$ICField48$scroll$1')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$1' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$1'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$1' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$1'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$1' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$1' id='SSR_CLSRCH_MTG1$srt6$1' tabindex='280' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$1');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$1' id='SSR_CLSRCH_MTG1$srt7$1' tabindex='281' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$1');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$1' id='SSR_CLSRCH_MTG1$srt8$1' tabindex='282' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$1');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$1' id='SSR_CLSRCH_MTG1$srt9$1' tabindex='283' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$1');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$1' id='SSR_CLSRCH_MTG1$srt10$1' tabindex='284' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$1');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$1' id='SSR_CLSRCH_MTG1$srt11$1' tabindex='285' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$1');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$1_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$1_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$1_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$1_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$1'><span id='MTG_CLASS_NBR$span$1'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$1' id='MTG_CLASS_NBR$1'  ptlinktgt='pt_peoplecode' tabindex='287' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$1');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$1'><span id='MTG_CLASSNAME$span$1'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$1' id='MTG_CLASSNAME$1'  ptlinktgt='pt_peoplecode' tabindex='288' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$1');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$1'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$1'>Mo 10:00 - 11:20<br />We 13:00 - 14:20</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$1'><span    class='PSLONGEDITBOX' id='MTG_ROOM$1'>161 Louis Pasteur (CBY) B012<br />161 Louis Pasteur (CBY) B012</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$1'><span    class='PSLONGEDITBOX' id='MTG_INSTR$1'>Paul Eugène J. Parent<br />Paul Eugène J. Parent</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$1'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$1'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$1'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$2'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$2'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4162 - Topics in Mathematical Logic' name='SSR_CLSRSLT_WRK_GROUPBOX2$2' id='SSR_CLSRSLT_WRK_GROUPBOX2$2' tabindex='454' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$2');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4162 - Topics in Mathematical Logic' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4162 - Topics in Mathematical Logic&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$2' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$2'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$2' onclick="getScrollTableId('$ICField48$scroll$2')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$2' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$2'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$2' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$2'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$2' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$2' id='SSR_CLSRCH_MTG1$srt6$2' tabindex='489' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$2');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$2' id='SSR_CLSRCH_MTG1$srt7$2' tabindex='490' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$2');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$2' id='SSR_CLSRCH_MTG1$srt8$2' tabindex='491' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$2');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$2' id='SSR_CLSRCH_MTG1$srt9$2' tabindex='492' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$2');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$2' id='SSR_CLSRCH_MTG1$srt10$2' tabindex='493' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$2');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$2' id='SSR_CLSRCH_MTG1$srt11$2' tabindex='494' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$2');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$2_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$2_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$2_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$2_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$2'><span id='MTG_CLASS_NBR$span$2'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$2' id='MTG_CLASS_NBR$2'  ptlinktgt='pt_peoplecode' tabindex='496' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$2');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$2'><span id='MTG_CLASSNAME$span$2'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$2' id='MTG_CLASSNAME$2'  ptlinktgt='pt_peoplecode' tabindex='497' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$2');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$2'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$2'>Mo 16:00 - 17:20<br />We 14:30 - 15:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$2'><span    class='PSLONGEDITBOX' id='MTG_ROOM$2'>120 University (FSS) 1005<br />120 University (FSS) 1005</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$2'><span    class='PSLONGEDITBOX' id='MTG_INSTR$2'>Pieter Hofstra<br />Pieter Hofstra</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$2'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$2'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$2'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$3'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$3'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4167 - Topics in Number Theory' name='SSR_CLSRSLT_WRK_GROUPBOX2$3' id='SSR_CLSRSLT_WRK_GROUPBOX2$3' tabindex='663' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$3');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4167 - Topics in Number Theory' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4167 - Topics in Number Theory&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$3' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$3'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$3' onclick="getScrollTableId('$ICField48$scroll$3')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$3' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$3'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$3' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$3'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$3' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$3' id='SSR_CLSRCH_MTG1$srt6$3' tabindex='698' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$3');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$3' id='SSR_CLSRCH_MTG1$srt7$3' tabindex='699' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$3');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$3' id='SSR_CLSRCH_MTG1$srt8$3' tabindex='700' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$3');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$3' id='SSR_CLSRCH_MTG1$srt9$3' tabindex='701' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$3');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$3' id='SSR_CLSRCH_MTG1$srt10$3' tabindex='702' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$3');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$3' id='SSR_CLSRCH_MTG1$srt11$3' tabindex='703' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$3');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$3_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$3_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$3_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$3_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$3'><span id='MTG_CLASS_NBR$span$3'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$3' id='MTG_CLASS_NBR$3'  ptlinktgt='pt_peoplecode' tabindex='705' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$3');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$3'><span id='MTG_CLASSNAME$span$3'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$3' id='MTG_CLASSNAME$3'  ptlinktgt='pt_peoplecode' tabindex='706' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$3');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$3'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$3'>Tu 10:00 - 11:20<br />Th 08:30 - 09:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$3'><span    class='PSLONGEDITBOX' id='MTG_ROOM$3'>136 Jean-Jacques L. (VNR) 3075<br />136 Jean-Jacques L. (VNR) 3075</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$3'><span    class='PSLONGEDITBOX' id='MTG_INSTR$3'>Damien Roy<br />Damien Roy</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$3'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$3'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$3'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$4'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$4'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4171 - Probability Theory II' name='SSR_CLSRSLT_WRK_GROUPBOX2$4' id='SSR_CLSRSLT_WRK_GROUPBOX2$4' tabindex='872' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$4');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4171 - Probability Theory II' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4171 - Probability Theory II&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$4' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$4'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$4' onclick="getScrollTableId('$ICField48$scroll$4')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$4' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$4'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$4' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$4'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$4' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$4' id='SSR_CLSRCH_MTG1$srt6$4' tabindex='907' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$4');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$4' id='SSR_CLSRCH_MTG1$srt7$4' tabindex='908' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$4');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$4' id='SSR_CLSRCH_MTG1$srt8$4' tabindex='909' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$4');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$4' id='SSR_CLSRCH_MTG1$srt9$4' tabindex='910' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$4');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$4' id='SSR_CLSRCH_MTG1$srt10$4' tabindex='911' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$4');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$4' id='SSR_CLSRCH_MTG1$srt11$4' tabindex='912' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$4');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$4_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$4_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$4_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$4_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$4'><span id='MTG_CLASS_NBR$span$4'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$4' id='MTG_CLASS_NBR$4'  ptlinktgt='pt_peoplecode' tabindex='914' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$4');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$4'><span id='MTG_CLASSNAME$span$4'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$4' id='MTG_CLASSNAME$4'  ptlinktgt='pt_peoplecode' tabindex='915' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$4');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$4'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$4'>Mo 19:00 - 21:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$4'><span    class='PSLONGEDITBOX' id='MTG_ROOM$4'>800 King Edward (STE) F0126</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$4'><span    class='PSLONGEDITBOX' id='MTG_INSTR$4'>Rafal Kulik</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$4'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$4'>2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$4'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$5'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$5'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4371 - Applied Probability' name='SSR_CLSRSLT_WRK_GROUPBOX2$5' id='SSR_CLSRSLT_WRK_GROUPBOX2$5' tabindex='1081' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$5');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4371 - Applied Probability' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4371 - Applied Probability&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$5' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$5'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$5' onclick="getScrollTableId('$ICField48$scroll$5')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$5' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$5'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$5' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$5'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$5' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$5' id='SSR_CLSRCH_MTG1$srt6$5' tabindex='1116' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$5');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$5' id='SSR_CLSRCH_MTG1$srt7$5' tabindex='1117' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$5');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$5' id='SSR_CLSRCH_MTG1$srt8$5' tabindex='1118' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$5');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$5' id='SSR_CLSRCH_MTG1$srt9$5' tabindex='1119' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$5');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$5' id='SSR_CLSRCH_MTG1$srt10$5' tabindex='1120' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$5');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$5' id='SSR_CLSRCH_MTG1$srt11$5' tabindex='1121' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$5');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$5_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$5_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$5_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$5_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$5'><span id='MTG_CLASS_NBR$span$5'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$5' id='MTG_CLASS_NBR$5'  ptlinktgt='pt_peoplecode' tabindex='1123' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$5');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$5'><span id='MTG_CLASSNAME$span$5'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$5' id='MTG_CLASSNAME$5'  ptlinktgt='pt_peoplecode' tabindex='1124' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$5');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$5'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$5'>Tu 16:00 - 17:20<br />Th 14:30 - 15:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$5'><span    class='PSLONGEDITBOX' id='MTG_ROOM$5'>550 Cumberland (TBT) 070<br />550 Cumberland (TBT) 070</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$5'><span    class='PSLONGEDITBOX' id='MTG_INSTR$5'>Clémonell Lord Baronat Bilayi-Biakana<br />Clémonell Lord Baronat Bilayi-Biakana</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$5'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$5'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$5'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$6'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$6'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4372 - Financial Mathematics' name='SSR_CLSRSLT_WRK_GROUPBOX2$6' id='SSR_CLSRSLT_WRK_GROUPBOX2$6' tabindex='1290' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$6');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4372 - Financial Mathematics' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4372 - Financial Mathematics&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$6' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$6'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$6' onclick="getScrollTableId('$ICField48$scroll$6')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$6' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$6'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$6' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$6'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$6' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$6' id='SSR_CLSRCH_MTG1$srt6$6' tabindex='1325' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$6');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$6' id='SSR_CLSRCH_MTG1$srt7$6' tabindex='1326' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$6');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$6' id='SSR_CLSRCH_MTG1$srt8$6' tabindex='1327' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$6');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$6' id='SSR_CLSRCH_MTG1$srt9$6' tabindex='1328' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$6');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$6' id='SSR_CLSRCH_MTG1$srt10$6' tabindex='1329' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$6');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$6' id='SSR_CLSRCH_MTG1$srt11$6' tabindex='1330' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$6');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$6_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$6_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$6_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$6_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$6'><span id='MTG_CLASS_NBR$span$6'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$6' id='MTG_CLASS_NBR$6'  ptlinktgt='pt_peoplecode' tabindex='1332' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$6');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$6'><span id='MTG_CLASSNAME$span$6'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$6' id='MTG_CLASSNAME$6'  ptlinktgt='pt_peoplecode' tabindex='1333' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$6');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$6'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$6'>Tu 11:30 - 12:50<br />Fr 13:00 - 14:20</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$6'><span    class='PSLONGEDITBOX' id='MTG_ROOM$6'>60 University (SMD) 222<br />60 University (SMD) 222</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$6'><span    class='PSLONGEDITBOX' id='MTG_INSTR$6'>Mahmoud Zarepour<br />Mahmoud Zarepour</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$6'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$6'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$6'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$7'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$7'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4373 - Statistical Machine Learning' name='SSR_CLSRSLT_WRK_GROUPBOX2$7' id='SSR_CLSRSLT_WRK_GROUPBOX2$7' tabindex='1499' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$7');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4373 - Statistical Machine Learning' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4373 - Statistical Machine Learning&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$7' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$7'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$7' onclick="getScrollTableId('$ICField48$scroll$7')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$7' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$7'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$7' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$7'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$7' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$7' id='SSR_CLSRCH_MTG1$srt6$7' tabindex='1534' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$7');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$7' id='SSR_CLSRCH_MTG1$srt7$7' tabindex='1535' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$7');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$7' id='SSR_CLSRCH_MTG1$srt8$7' tabindex='1536' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$7');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$7' id='SSR_CLSRCH_MTG1$srt9$7' tabindex='1537' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$7');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$7' id='SSR_CLSRCH_MTG1$srt10$7' tabindex='1538' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$7');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$7' id='SSR_CLSRCH_MTG1$srt11$7' tabindex='1539' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$7');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$7_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$7_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$7_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$7_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$7'><span id='MTG_CLASS_NBR$span$7'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$7' id='MTG_CLASS_NBR$7'  ptlinktgt='pt_peoplecode' tabindex='1541' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$7');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$7'><span id='MTG_CLASSNAME$span$7'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$7' id='MTG_CLASSNAME$7'  ptlinktgt='pt_peoplecode' tabindex='1542' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$7');"  class='PSHYPERLINK' >C00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$7'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$7'>Mo 14:30 - 15:50<br />We 16:00 - 17:20</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$7'><span    class='PSLONGEDITBOX' id='MTG_ROOM$7'>120 University (FSS) 1030<br />120 University (FSS) 1030</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$7'><span    class='PSLONGEDITBOX' id='MTG_INSTR$7'>Tanya Schmah<br />Tanya Schmah</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$7'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$7'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$7'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='68'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$8'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$8'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4374 - Modern Computational Statistics' name='SSR_CLSRSLT_WRK_GROUPBOX2$8' id='SSR_CLSRSLT_WRK_GROUPBOX2$8' tabindex='1708' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$8');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4374 - Modern Computational Statistics' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4374 - Modern Computational Statistics&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$8' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='52'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$8'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$8' onclick="getScrollTableId('$ICField48$scroll$8')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$8' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='47'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$8'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$8' cellpadding='0' cellspacing='0' cols='3' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='668'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$8'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$8' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$8' id='SSR_CLSRCH_MTG1$srt6$8' tabindex='1743' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$8');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$8' id='SSR_CLSRCH_MTG1$srt7$8' tabindex='1744' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$8');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$8' id='SSR_CLSRCH_MTG1$srt8$8' tabindex='1745' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$8');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$8' id='SSR_CLSRCH_MTG1$srt9$8' tabindex='1746' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$8');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$8' id='SSR_CLSRCH_MTG1$srt10$8' tabindex='1747' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$8');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$8' id='SSR_CLSRCH_MTG1$srt11$8' tabindex='1748' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$8');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$8_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$8_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$8_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$8_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$8'><span id='MTG_CLASS_NBR$span$8'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$8' id='MTG_CLASS_NBR$8'  ptlinktgt='pt_peoplecode' tabindex='1750' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$8');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$8'><span id='MTG_CLASSNAME$span$8'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$8' id='MTG_CLASSNAME$8'  ptlinktgt='pt_peoplecode' tabindex='1751' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$8');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$8'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$8'>Mo 16:00 - 17:20<br />We 14:30 - 15:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$8'><span    class='PSLONGEDITBOX' id='MTG_ROOM$8'>57 Louis Pasteur (FTX) 232<br />145 Jean-Jacq. Luss. (LMX) 221</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$8'><span    class='PSLONGEDITBOX' id='MTG_INSTR$8'>Gilles Lamothe<br />Gilles Lamothe</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$8'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$8'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$8'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='158'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$9'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$9'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4376 - Topics in Statistics' name='SSR_CLSRSLT_WRK_GROUPBOX2$9' id='SSR_CLSRSLT_WRK_GROUPBOX2$9' tabindex='1917' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$9');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4376 - Topics in Statistics' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4376 - Topics in Statistics&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$9' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='142'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$9'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$9' onclick="getScrollTableId('$ICField48$scroll$9')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$9' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='67'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$9'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$9' cellpadding='0' cellspacing='0' cols='4' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='5'></td>
<td width='663'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$9'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$9' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$9' id='SSR_CLSRCH_MTG1$srt6$9' tabindex='1952' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$9');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$9' id='SSR_CLSRCH_MTG1$srt7$9' tabindex='1953' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$9');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$9' id='SSR_CLSRCH_MTG1$srt8$9' tabindex='1954' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$9');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$9' id='SSR_CLSRCH_MTG1$srt9$9' tabindex='1955' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$9');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$9' id='SSR_CLSRCH_MTG1$srt10$9' tabindex='1956' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$9');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$9' id='SSR_CLSRCH_MTG1$srt11$9' tabindex='1957' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$9');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$9_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$9_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$9_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$9_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$9'><span id='MTG_CLASS_NBR$span$9'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$9' id='MTG_CLASS_NBR$9'  ptlinktgt='pt_peoplecode' tabindex='1959' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$9');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$9'><span id='MTG_CLASSNAME$span$9'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$9' id='MTG_CLASSNAME$9'  ptlinktgt='pt_peoplecode' tabindex='1960' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$9');"  class='PSHYPERLINK' >B00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$9'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$9'>Mo 10:00 - 11:20<br />We 08:30 - 09:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$9'><span    class='PSLONGEDITBOX' id='MTG_ROOM$9'>120 University (FSS) 4014<br />800 King Edward (STE) J0106</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$9'><span    class='PSLONGEDITBOX' id='MTG_INSTR$9'>Chen Xu<br />Chen Xu</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$9'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$9'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$9'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='4' colspan='4'></td>
</tr>
<tr>
<td height='18' colspan='2'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_DESCRLONG$9'><span    class='PSLONGEDITBOX' style='word-wrap:break-word;overflow:hidden;display:block; width:544px;  overflow:auto;' id='DERIVED_CLSRCH_DESCRLONG$9'>Topic: High-dimensional Data Analysis</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='4' colspan='3'></td>
</tr>
<tr>
<td height='66'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$10'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$10' cellpadding='0' cellspacing='0' cols='4' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='5'></td>
<td width='663'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$10'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$10' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$10' id='SSR_CLSRCH_MTG1$srt6$10' tabindex='2132' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$10');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$10' id='SSR_CLSRCH_MTG1$srt7$10' tabindex='2133' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$10');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$10' id='SSR_CLSRCH_MTG1$srt8$10' tabindex='2134' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$10');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$10' id='SSR_CLSRCH_MTG1$srt9$10' tabindex='2135' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$10');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$10' id='SSR_CLSRCH_MTG1$srt10$10' tabindex='2136' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$10');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$10' id='SSR_CLSRCH_MTG1$srt11$10' tabindex='2137' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$10');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$10_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$10_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$10_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$10_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$10'><span id='MTG_CLASS_NBR$span$10'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$10' id='MTG_CLASS_NBR$10'  ptlinktgt='pt_peoplecode' tabindex='2139' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$10');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$10'><span id='MTG_CLASSNAME$span$10'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$10' id='MTG_CLASSNAME$10'  ptlinktgt='pt_peoplecode' tabindex='2140' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$10');"  class='PSHYPERLINK' >F00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$10'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$10'>Mo 11:30 - 12:50<br />We 10:00 - 11:20</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$10'><span    class='PSLONGEDITBOX' id='MTG_ROOM$10'>140 Louis-Pasteur (MRN) 021<br />140 Louis-Pasteur (MRN) 021</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$10'><span    class='PSLONGEDITBOX' id='MTG_INSTR$10'>Rafal Kulik<br />Rafal Kulik</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$10'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$10'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$10'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='4' colspan='4'></td>
</tr>
<tr>
<td height='18' colspan='2'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_DESCRLONG$10'><span    class='PSLONGEDITBOX' style='word-wrap:break-word;overflow:hidden;display:block; width:544px;  overflow:auto;' id='DERIVED_CLSRCH_DESCRLONG$10'>Topic: Mathematical Foundations of Risk Management</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='87'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$10'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$10'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4377 - Topics in Applied Probability' name='SSR_CLSRSLT_WRK_GROUPBOX2$10' id='SSR_CLSRSLT_WRK_GROUPBOX2$10' tabindex='2306' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$10');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4377 - Topics in Applied Probability' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4377 - Topics in Applied Probability&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$10' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='71'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$10'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$10' onclick="getScrollTableId('$ICField48$scroll$10')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$10' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='66'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$11'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$11' cellpadding='0' cellspacing='0' cols='4' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='5'></td>
<td width='663'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$11'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$11' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$11' id='SSR_CLSRCH_MTG1$srt6$11' tabindex='2341' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$11');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$11' id='SSR_CLSRCH_MTG1$srt7$11' tabindex='2342' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$11');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$11' id='SSR_CLSRCH_MTG1$srt8$11' tabindex='2343' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$11');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$11' id='SSR_CLSRCH_MTG1$srt9$11' tabindex='2344' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$11');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$11' id='SSR_CLSRCH_MTG1$srt10$11' tabindex='2345' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$11');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$11' id='SSR_CLSRCH_MTG1$srt11$11' tabindex='2346' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$11');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$11_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$11_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$11_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$11_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$11'><span id='MTG_CLASS_NBR$span$11'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$11' id='MTG_CLASS_NBR$11'  ptlinktgt='pt_peoplecode' tabindex='2348' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$11');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$11'><span id='MTG_CLASSNAME$span$11'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$11' id='MTG_CLASSNAME$11'  ptlinktgt='pt_peoplecode' tabindex='2349' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$11');"  class='PSHYPERLINK' >B00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$11'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$11'>Fr 10:00 - 12:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$11'><span    class='PSLONGEDITBOX' id='MTG_ROOM$11'>801 King Edward (MNO) C211</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$11'><span    class='PSLONGEDITBOX' id='MTG_INSTR$11'>David Sankoff</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$11'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$11'>2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$11'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='4' colspan='4'></td>
</tr>
<tr>
<td height='18' colspan='2'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_DESCRLONG$11'><span    class='PSLONGEDITBOX' style='word-wrap:break-word;overflow:hidden;display:block; width:544px;  overflow:auto;' id='DERIVED_CLSRCH_DESCRLONG$11'>Topic: Mathematical Genomics</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='87'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$11'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$11'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4776 - Chapitres choisis de statistique' name='SSR_CLSRSLT_WRK_GROUPBOX2$11' id='SSR_CLSRSLT_WRK_GROUPBOX2$11' tabindex='2515' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$11');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4776 - Chapitres choisis de statistique' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4776 - Chapitres choisis de statistique&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$11' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='71'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$11'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$11' onclick="getScrollTableId('$ICField48$scroll$11')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$11' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='66'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$12'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$12' cellpadding='0' cellspacing='0' cols='4' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='5'></td>
<td width='663'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$12'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$12' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$12' id='SSR_CLSRCH_MTG1$srt6$12' tabindex='2550' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$12');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$12' id='SSR_CLSRCH_MTG1$srt7$12' tabindex='2551' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$12');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$12' id='SSR_CLSRCH_MTG1$srt8$12' tabindex='2552' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$12');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$12' id='SSR_CLSRCH_MTG1$srt9$12' tabindex='2553' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$12');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$12' id='SSR_CLSRCH_MTG1$srt10$12' tabindex='2554' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$12');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$12' id='SSR_CLSRCH_MTG1$srt11$12' tabindex='2555' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$12');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$12_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$12_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$12_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$12_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$12'><span id='MTG_CLASS_NBR$span$12'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$12' id='MTG_CLASS_NBR$12'  ptlinktgt='pt_peoplecode' tabindex='2557' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$12');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$12'><span id='MTG_CLASSNAME$span$12'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$12' id='MTG_CLASSNAME$12'  ptlinktgt='pt_peoplecode' tabindex='2558' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$12');"  class='PSHYPERLINK' >D00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$12'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$12'>Th 10:00 - 12:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$12'><span    class='PSLONGEDITBOX' id='MTG_ROOM$12'>Department</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$12'><span    class='PSLONGEDITBOX' id='MTG_INSTR$12'>David Sankoff</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$12'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$12'>2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$12'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='4' colspan='4'></td>
</tr>
<tr>
<td height='18' colspan='2'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_DESCRLONG$12'><span    class='PSLONGEDITBOX' style='word-wrap:break-word;overflow:hidden;display:block; width:544px;  overflow:auto;' id='DERIVED_CLSRCH_DESCRLONG$12'>Topic: Algor.de l&#039;évolution génomique</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='87'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$12'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$12'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4995 - Special Topics in Mathematics' name='SSR_CLSRSLT_WRK_GROUPBOX2$12' id='SSR_CLSRSLT_WRK_GROUPBOX2$12' tabindex='2724' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$12');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4995 - Special Topics in Mathematics' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4995 - Special Topics in Mathematics&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$12' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='71'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$12'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$12' onclick="getScrollTableId('$ICField48$scroll$12')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$12' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='66'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$13'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$13' cellpadding='0' cellspacing='0' cols='4' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='5'></td>
<td width='663'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$13'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$13' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$13' id='SSR_CLSRCH_MTG1$srt6$13' tabindex='2759' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$13');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$13' id='SSR_CLSRCH_MTG1$srt7$13' tabindex='2760' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$13');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$13' id='SSR_CLSRCH_MTG1$srt8$13' tabindex='2761' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$13');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$13' id='SSR_CLSRCH_MTG1$srt9$13' tabindex='2762' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$13');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$13' id='SSR_CLSRCH_MTG1$srt10$13' tabindex='2763' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$13');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$13' id='SSR_CLSRCH_MTG1$srt11$13' tabindex='2764' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$13');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$13_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$13_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$13_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$13_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$13'><span id='MTG_CLASS_NBR$span$13'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$13' id='MTG_CLASS_NBR$13'  ptlinktgt='pt_peoplecode' tabindex='2766' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$13');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$13'><span id='MTG_CLASSNAME$span$13'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$13' id='MTG_CLASSNAME$13'  ptlinktgt='pt_peoplecode' tabindex='2767' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$13');"  class='PSHYPERLINK' >A00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$13'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$13'>Mo 13:00 - 14:20<br />We 11:30 - 12:50</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$13'><span    class='PSLONGEDITBOX' id='MTG_ROOM$13'>800 King Edward (STE) F0126<br />800 King Edward (STE) F0126</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$13'><span    class='PSLONGEDITBOX' id='MTG_INSTR$13'>Anne Broadbent<br />Anne Broadbent</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$13'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$13'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$13'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='4' colspan='4'></td>
</tr>
<tr>
<td height='18' colspan='2'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_DESCRLONG$13'><span    class='PSLONGEDITBOX' style='word-wrap:break-word;overflow:hidden;display:block; width:544px;  overflow:auto;' id='DERIVED_CLSRCH_DESCRLONG$13'>Topic: Quantum Computing</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='86'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$13'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='679'>
<tr><td class='PAGROUPBOXLABELLEVEL1'  align='left'><DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX2GP$13'><a class='PSHYPERLINK PTCOLLAPSE_ARROW' title='Collapse section MAT 4996 - Special Topics in Applied Mathematics' name='SSR_CLSRSLT_WRK_GROUPBOX2$13' id='SSR_CLSRSLT_WRK_GROUPBOX2$13' tabindex='2933' href="javascript:submitAction_win0(document.win0,'SSR_CLSRSLT_WRK_GROUPBOX2$13');" aria-expanded='true'><img src='/cs/csprpr9pub/cache/PT_TRANS_PIX_1.png' alt='Collapse section MAT 4996 - Special Topics in Applied Mathematics' class='PTCOLLAPSE' title='Collapse section' border='0' /></a>&nbsp;MAT 4996 - Special Topics in Applied Mathematics&nbsp;</DIV></td></tr>
<tr><td width='677'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX2$13' cellpadding='0' cellspacing='0' cols='3' width='677' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='676'></td>
<td width='2'></td>
</tr>
<tr>
<td height='71'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField48$13'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  id='$ICField48$scroll$13' onclick="getScrollTableId('$ICField48$scroll$13')" width='675'>
<tr><td width='673'>
<table role='presentation'  border='0' id='ACE_$ICField48$13' cellpadding='0' cellspacing='0' cols='3' width='673' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='3'></td>
<td width='672'></td>
<td width='2'></td>
</tr>
<tr>
<td height='66'></td>
<td  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRSLT_WRK_GROUPBOX3$14'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='671'>
<tr><td width='669'>
<table role='presentation'  border='0' id='ACE_SSR_CLSRSLT_WRK_GROUPBOX3$14' cellpadding='0' cellspacing='0' cols='4' width='669' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='0' height='0'></td>
<td width='5'></td>
<td width='663'></td>
<td width='2'></td>
</tr>
<tr>
<td height='39'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divSSR_CLSRCH_MTG1$14'>
<table cellspacing='0' class='PSLEVEL1GRIDNBONBO'  id='SSR_CLSRCH_MTG1$scroll$14' dir='ltr' cols='7' width='668' cellpadding='2'>
<tr>
<th scope='col' width='30' align='left' class='PSLEVEL1GRIDCOLUMNHDR' >&nbsp;</th>
<th scope='col' abbr='Section' width='80' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt6$14' id='SSR_CLSRCH_MTG1$srt6$14' tabindex='2968' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt6$14');" title="Click to sort ascending">Section</a></th>
<th scope='col' abbr='Days &amp; Times' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt7$14' id='SSR_CLSRCH_MTG1$srt7$14' tabindex='2969' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt7$14');" title="Click to sort ascending">Days &amp; Times</a></th>
<th scope='col' abbr='Room' width='91' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt8$14' id='SSR_CLSRCH_MTG1$srt8$14' tabindex='2970' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt8$14');" title="Click to sort ascending">Room</a></th>
<th scope='col' abbr='Instructor' width='98' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt9$14' id='SSR_CLSRCH_MTG1$srt9$14' tabindex='2971' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt9$14');" title="Click to sort ascending">Instructor</a></th>
<th scope='col' abbr='Meeting Dates' width='94' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt10$14' id='SSR_CLSRCH_MTG1$srt10$14' tabindex='2972' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt10$14');" title="Click to sort ascending">Meeting Dates</a></th>
<th scope='col' abbr='Status' width='41' align='left' class='PSLEVEL1GRIDCOLUMNHDR' ><a name='SSR_CLSRCH_MTG1$srt11$14' id='SSR_CLSRCH_MTG1$srt11$14' tabindex='2973' class='PSLEVEL1GRIDCOLUMNHDR' href="javascript:submitAction_win0(document.win0,'SSR_CLSRCH_MTG1$srt11$14');" title="Click to sort ascending">Status</a></th>
</tr>
<tr id='trSSR_CLSRCH_MTG1$14_row1' valign='center' onClick="HighLightTR('rgb(212,219,217)','','trSSR_CLSRCH_MTG1$14_row1');" onMouseOver="hoverLightTR('rgb(249,254,203)','',0,'trSSR_CLSRCH_MTG1$14_row1');" onmouseout="hoverLightTR('rgb(249,254,203)','',1,'trSSR_CLSRCH_MTG1$14_row1');">
<td align='left'  height='20' class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASS_NBR$14'><span id='MTG_CLASS_NBR$span$14'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASS_NBR$14' id='MTG_CLASS_NBR$14'  ptlinktgt='pt_peoplecode' tabindex='2975' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASS_NBR$14');"  class='PSHYPERLINK' >Details</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_CLASSNAME$14'><span id='MTG_CLASSNAME$span$14'  class='PSHYPERLINK'  title=' ' ><a name='MTG_CLASSNAME$14' id='MTG_CLASSNAME$14'  ptlinktgt='pt_peoplecode' tabindex='2976' onclick='javascript:cancelBubble(event);'href="javascript:submitAction_win0(document.win0,'MTG_CLASSNAME$14');"  class='PSHYPERLINK' >B00-LEC<br />FullSess.</a></span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_DAYTIME$14'><span    class='PSLONGEDITBOX' id='MTG_DAYTIME$14'>Mo 08:30 - 09:50<br />We 13:00 - 14:20</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_ROOM$14'><span    class='PSLONGEDITBOX' id='MTG_ROOM$14'>800 King Edward (STE) J0106<br />800 King Edward (STE) J0106</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_INSTR$14'><span    class='PSLONGEDITBOX' id='MTG_INSTR$14'>Victor Leblanc<br />Victor Leblanc</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divMTG_TOPIC$14'><span    class='PSLONGEDITBOX' id='MTG_TOPIC$14'>2020-01-06 - 2020-04-04<br />2020-01-06 - 2020-04-04</span>
</DIV></td>
<td class='PSLEVEL3GRIDODDROW'  align='left'  class='PSLEVEL3GRIDODDROW' >
<DIV    id='win0divDERIVED_CLSRCH_SSR_STATUS_LONG$14'><div style="min-width:41px; " >
<!-- Begin HTML Area Name Undisclosed -->
<img src="/cs/csprpr9pub/cache/PS_CS_STATUS_OPEN_ICN_1.gif" width="16" height="16" alt="Open" STYLE="vertical-align:middle;text-align:center;margin-left:12px">
<!-- End HTML Area -->
</div>
</DIV></td>
</tr>
</table>
</DIV>
</td>
</tr>
<tr>
<td height='4' colspan='4'></td>
</tr>
<tr>
<td height='18' colspan='2'></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0divDERIVED_CLSRCH_DESCRLONG$14'><span    class='PSLONGEDITBOX' style='word-wrap:break-word;overflow:hidden;display:block; width:544px;  overflow:auto;' id='DERIVED_CLSRCH_DESCRLONG$14'>Topic: Bifurcation Theory</span>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='3' colspan='3'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='9' colspan='2'></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='8' colspan='13'></td>
</tr>
<tr>
<td height='28' colspan='6'></td>
<td  valign='top' align='left'>
<DIV    id='win0div$ICField$6$'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='167'>
<tr><td width='165'>
<table role='presentation'  border='0' id='ACE_$ICField$6$' cellpadding='0' cellspacing='0' cols='2' width='165' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='3' height='0'></td>
<td width='162'></td>
</tr>
<tr>
<td height='23'></td>
<td nowrap='nowrap'  valign='top' align='left'>
<DIV    id='win0divCLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH$3$'><a role='presentation' class='PSPUSHBUTTON Left' ><span style='background-Color: transparent;'><input type='button' name='CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH$3$' id='CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH$3$' tabindex='3157' value='New Search'  class='PSPUSHBUTTON' style='width:152px; ' onclick="submitAction_win0(document.win0,this.id,event);" title='Start a New Search'  /></span></a>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
<td colspan='2'  valign='top' align='left'>
<DIV    id='win0div$ICField$7$'><table cellpadding='2' cellspacing='0' cols='1'  class='PABACKGROUNDINVISIBLEWBO'  width='167'>
<tr><td width='165'>
<table role='presentation'  border='0' id='ACE_$ICField$7$' cellpadding='0' cellspacing='0' cols='2' width='165' class='PABACKGROUNDINVISIBLE' style='border-style:none' >
<tr>
<td width='7' height='0'></td>
<td width='158'></td>
</tr>
<tr>
<td height='23'></td>
<td nowrap='nowrap'  valign='top' align='left'>
<DIV    id='win0divCLASS_SRCH_WRK2_SSR_PB_MODIFY$5$'><a role='presentation' class='PSPUSHBUTTON Left' ><span style='background-Color: transparent;'><input type='button' name='CLASS_SRCH_WRK2_SSR_PB_MODIFY$5$' id='CLASS_SRCH_WRK2_SSR_PB_MODIFY$5$' tabindex='3158' value='Modify Search'  class='PSPUSHBUTTON' style='width:152px; ' onclick="submitAction_win0(document.win0,this.id,event);" /></span></a>
</DIV></td>
</tr>
</table>
</td></tr>
</table>
</DIV></td>
</tr>
<tr>
<td height='10' colspan='13'></td>
</tr>
</table>
</DIV>
</td></tr>
</table>
<DIV class='x'  id='pt_dragtxt' class='PSLEVEL1GRIDCOLUMNHDR'></div><div onmouseup='ptGridResizeObj_win0.TDselUp();' onmousemove='ptGridResizeObj_win0.TDselMove();' id='pt_dragResize' onmouseout='ptGridResizeObj_win0.dragTD=false;' onmbouseover='ptGridResizeObj_win0.dragTD=true;'></div>]]></FIELD>
<FIELD id='win0divPSPANELTABLINKS'><![CDATA[]]></FIELD>
<SYSVAR id='sysvar'><![CDATA[nMaxSavedStates=5;
sHistURL="https://uocampus.public.uottawa.ca/psc/csprpr9pub/EMPLOYEE/SA/c/UO_SR_AA_MODS.UO_PUB_CLSSRCH.GBL?page=UO_PUB_CLSSRCH_RES&";
bCloseModal = false;
bICList = false;
bHtml5Doc = true;
bClearBackState=false;
bPageTransfered=true;
bTransferAnimate=false;
UpdateHistory('', '', 'returntolastpage@0', 'UO_PUB_CLSSRCH_RES', 0, '', 1, 0);
AddToHistory('Search Results', '', 'returntolastpage@0', 'UO_PUB_CLSSRCH_RES', 2, 0, 1, 0,'', 1, '', 0);
corsHistoryTansaction();
bCleanHtml = false;
bDefer = true;
document.hiddenFldArr_win0 =new Array('ICType','ICElementNum','ICStateNum','ICAction','ICModelCancel','ICXPos','ICYPos','ResponsetoDiffFrame','TargetFrameName','FacetPath','ICFocus','ICSaveWarningFilter','ICChanged','ICSkipPending','ICAutoSave','ICResubmit','ICSID','ICActionPrompt','ICTypeAheadID','ICBcDomData','ICPanelName','ICFind','ICAddCount','ICAppClsData');
document.chgFldArr_win0 = new Array();
bCDATA = false;
bAccessibleLayout = false;
bGenDomInfo = false;
]]></SYSVAR></PAGE>`;
